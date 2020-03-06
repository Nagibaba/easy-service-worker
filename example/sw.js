importScripts('https://nagibaba.github.io/lazy-service-worker/lib/index.js');

const sw = new LazySW();

sw.CACHENAME = 'default-lazy-cache-v1'

// resources to be precached
sw.precacheResources = ['/', '/page1'];

// Cache requests including "?"
sw.cacheGetRequests = false;

// offline if not cached
sw.offlinePage = '/offline.html';


// Returns true if you don't want the URL to be cached
// @return boolean
// @param {url} requested url
sw.exclude = (url) => {
	return false;
}


