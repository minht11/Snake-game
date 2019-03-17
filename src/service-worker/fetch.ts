import { cacheName, urlsToCacheKeys } from './cache'

const ignoreUrlParametersMatching = [/^utm_/]

const addDirectoryIndex = (originalUrl, index) => {
  const url = new URL(originalUrl)
  if (url.pathname.slice(-1) === '/') {
    url.pathname += index
  }
  return url.toString()
}

const stripIgnoredUrlParameters = (originalUrl, ignoreUrlParametersMatching) => {
  const url = new URL(originalUrl)
  // Remove the hash
  url.hash = ''

  url.search = url.search.slice(1) // Exclude initial '?'
    .split('&') // Split into an array of 'key=value' strings
    .map((kv) => kv.split('='))
    .filter((kv) => ignoreUrlParametersMatching.every((ignoredRegex) => 
        !ignoredRegex.test(kv[0]) // Return true if the key doesn't match any of the regexes.
      )
    )
    .map((kv) => kv.join('=')) // Join each [key, value] array into a 'key=value' string
    .join('&') // Join the array of 'key=value' strings into a string with '&' in between each

  return url.toString()
}

const fetchCachedResource = async ({ request }, url: string) => {
  try {
    const cache = await caches.open(cacheName)
    const urlD = urlsToCacheKeys.get(url) as string
    const response = await cache.match(urlD)
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
  if (event.request.method === 'GET') {
    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    let shouldRespond
    let url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching)
    shouldRespond = urlsToCacheKeys.has(url)

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    const directoryIndex = 'index.html'
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex)
      shouldRespond = urlsToCacheKeys.has(url)
    }

    if (shouldRespond) {
      event.respondWith(
        fetchCachedResource(event, url)
      )
    }
  }
})
