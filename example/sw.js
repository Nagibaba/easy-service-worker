importScripts('https://cdn.jsdelivr.net/gh/nagibaba/lazy-service-worker@1.1.3/lib/index.js');

const sw = new LazySW();

sw.CACHENAME = 'default-lazy-cache-v1'

// resources to be precached
// @default ['/']
sw.precacheResources = ['/'];

// Cache requests including "?"
// @default false
sw.cacheGetRequests = false;

// offline if not cached
// @default '/offline.html'
sw.offlinePage = '/offline.html';


// Returns true if you don't want the URL to be cached
// @return boolean
// @param {url} requested url
// @default false
sw.exclude = (url) => {
	return false;
}
