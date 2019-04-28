
import './components/snk-shell'
import './components/snk-popup'
import './components/snk-update-toast'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      const needToShowReloadButton = registrations.length > 0
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('ServiceWorker registration successful')
      
      if (needToShowReloadButton) {
        registration.onupdatefound = () => {
          const updateToastElement = document.createElement('snk-update-toast')
          document.body.appendChild(updateToastElement)
        }
      }

    } catch(err) {
      console.log('ServiceWorker registration failed: ', err)
    }
  })
}
