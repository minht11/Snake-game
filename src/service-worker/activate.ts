import { cacheName, urlsToCacheKeys } from './cache'

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
