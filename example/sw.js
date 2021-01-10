importScripts('https://cdn.jsdelivr.net/gh/nagibaba/easy-service-worker@1.1.4/lib/index.js');

const sw = new EazySW();

sw.CACHENAME = 'default-easy-cache-v1'

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
