// These JavaScript module imports need to be bundled:
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'

// @ts-ignore
// precacheAndRoute(self.__WB_MANIFEST);

setDefaultHandler(new StaleWhileRevalidate())

/*
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "activities" })
);

registerRoute(
  ({request}) => request.destination === 'style',
  new CacheFirst()
);

registerRoute(
  ({ url }) => url.pathname === "/api/activities",
  new StaleWhileRevalidate({ cacheName: "activities" })
);
*/
