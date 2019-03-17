const precacheConfig = [
  ['index.html', 'sw_hash_replacement'],
  ['app.js', 'sw_hash_replacement'],
  ['game.js', 'sw_hash_replacement'],
  ['game.wasm', 'sw_hash_replacement'],
]

const cacheName = 'snakee-tk-service-worker'

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

const createCacheKey = (originalUrl, paramName, paramValue, dontCacheBustUrlsMatching) => {
    const url = new URL(originalUrl)

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString()
}

const hashParamName = '_sw-precache'
const urlsToCacheKeys: Map<string,string> = new Map(
  precacheConfig.map(([ relativeUrl, hash ]): [string, string] => {
    // @ts-ignore
    const absoluteUrl = new URL(relativeUrl, self.location)
    const cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false)
    return [absoluteUrl.toString(), cacheKey]
  })
)

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

const fetchCachedResource = async ({ request }) => {
  try {
    const cache = await caches.open(cacheName)
    const url = urlsToCacheKeys.get(request.url) as string
    const response = await cache.match(url)
    // If cache hit return response
    if (response) {
      return response
    }
    throw Error('The cached response that was expected is missing.')
  } catch (err) {
    console.warn('Couldn\'t serve response for "%s" from cache: %O', request.url, err)
    return fetch(request)
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && urlsToCacheKeys.has(event.request.url)) {
    event.respondWith(
      fetchCachedResource(event)
    )
  }
})

const activateCache = async () => {
  const setOfExpectedUrls = new Set(urlsToCacheKeys.values())
  const cache = await caches.open(cacheName)
  const existingRequests = await cache.keys()

  const requestTasks = existingRequests.map(async (existingRequest) => {
    if (!setOfExpectedUrls.has(existingRequest.url)) {
      await cache.delete(existingRequest)
    }
  })
  await Promise.all(requestTasks)
  if ('clients' in self && 'claim' in self['clients']) {
    // @ts-ignore
    self.clients.claim()
  }
}

self.addEventListener('activate', (event) => 
  event.waitUntil(activateCache())
)