export const precacheConfig = [
  ['index.html', 'sw_hash_replacement'],
  ['manifest.json', 'sw_hash_replacement'],
  ['app.js', 'sw_hash_replacement'],
  ['game.js', 'sw_hash_replacement'],
  ['game.wasm', 'sw_hash_replacement'],
  ['images/favicon.ico', 'sw_hash_replacement'],
]

export const cacheName = 'snakee-tk-service-cache'

const createCacheKey = (originalUrl, paramName, paramValue, dontCacheBustUrlsMatching) => {
  const url = new URL(originalUrl)

  // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
  // then add in the extra cache-busting URL parameter.
  if (!dontCacheBustUrlsMatching ||
      !(url.pathname.match(dontCacheBustUrlsMatching))) {
    url.search += `${(url.search ? '&' : '')}
      ${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`
  }

  return url.toString()
}

const hashParamName = '_sw-precache'
export const urlsToCacheKeys: Map<string,string> = new Map(
  precacheConfig.map(([ relativeUrl, hash ]): [string, string] => {
    // @ts-ignore
    const absoluteUrl = new URL(relativeUrl, self.location)
    const cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false)
    return [absoluteUrl.toString(), cacheKey]
  })
)