import { cacheName, urlsToCacheKeys } from './cache'

const cleanResponse = async (originalResponse) => {
  // If this is not a redirected response, then we don't have to do anything.
  if (!originalResponse.redirected) {
    return originalResponse
  }

  // Firefox 50 and below doesn't support the Response.body stream, so we may
  // need to read the entire body to memory as a Blob.
  const body = await 'body' in originalResponse
    ? Promise.resolve(originalResponse.body)
    : originalResponse.blob()

  return new Response(body, {
    headers: originalResponse.headers,
    status: originalResponse.status,
    statusText: originalResponse.statusText
  })
}

const setOfCachedUrls = async (cache) => {
  const requests = await cache.keys()
  const urls = requests.map(request => request.url)
  return new Set(urls)
}

const installCaches = async () => {
  const cache = await caches.open(cacheName)
  const cachedUrls = await setOfCachedUrls(cache)
  const urls = Array.from(urlsToCacheKeys.values()) as string[]
  const tasks = urls.map(async (cacheKey) => {
    // If we don't have a key matching url in the cache already, add it.
    if (!cachedUrls.has(cacheKey)) {
      const request = new Request(cacheKey, {credentials: 'same-origin'})
      const response = await fetch(request)

      if (!response.ok) {
        throw new Error(`Request for ${cacheKey} returned a ${response} with status ${response.status}`)
      }

      const responseToCache = await cleanResponse(response)
      await cache.put(cacheKey, responseToCache)
    }
  })
  await Promise.all(tasks)
  if ('skipWaiting' in self) {
    // @ts-ignore
    self.skipWaiting()
  }
}

self.addEventListener('install', (event) =>
  event.waitUntil(installCaches())
)
