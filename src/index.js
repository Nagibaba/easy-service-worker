const _self = self

function LazySW() {
	
	const mainClass = this

	this.CACHENAME = 'default-lazy-cache'
	this.precacheResources = ['/'];
	this.cacheGetRequests = false;
	this.offlinePage = '/offline.html';
	this.exclude = (url) => {
		return false
	}

	precache = () => {
	  return caches.open(mainClass.CACHENAME).then(function (cache) {
	    return cache.addAll(mainClass.precacheResources);
	  });
	}

	fromCache = (request) => {
	  return caches.open(mainClass.CACHENAME
	    ).then(function (cache) {
	    return cache.match(request).then(function (matching) {
	      return matching ||  fetch(request).catch(error=>{
	                              return caches.match(mainClass.offlinePage)
	                          
	                          });
	    });
	  });
	}

	update = (request) => {
	  return caches.open(mainClass.CACHENAME).then(function (cache) {

	    return fetch(request).then(function (response) {
	      if(response.status<300 && response.type==='basic'){
	  
	        return Promise.all([response.clone(), response.text()]);
	      }

	      return [false, null];


	      

	      

	    })

	    .then(([response, text])=>{
	      if(text){

	        cache.match(request).then(matching=>matching?matching.text():null).then(function (cachedText) {
	          if(cachedText && !stringsAreSame(text, cachedText)){
	            
	            cache.put(request, response.clone()).then(function () {

	              refresh(response, [text.length, cachedText.length])
	            });
	            
	          } else if(!cachedText) {
	            cache.put(request, response.clone()).then(function () {});
	          }


	        })
	      }

	    })
	    .catch(error=>"Network failed");



	  });
	}

	stringsAreSame = (a, b) => {
	    
	    if (a.length !== b.length) {
	      return false;
	    }
	    
	    return a.localeCompare(b) === 0;
	}

	// function lengthsAreSame(a, b){
	//   return a.length === b.length
	// }


	refresh = (response, info=null) => {
	  return _self.clients.matchAll().then(function (clients) {
	    clients.forEach(function (client) {

	      var message = {
	        type: 'refresh',
	        url: response.url,
	        info
	        // eTag: response.headers.get('ETag')
	      };
	      client.postMessage(JSON.stringify(message));
	    });
	  });
	}


		


	


	this.init = () => {
		
		_self.addEventListener('install', function(evt) {
		  console.log('The lazy service worker is being installed.');
		  _self.skipWaiting()
		  evt.waitUntil(precache());
		});

		// delete old caches
		_self.addEventListener('activate', function(event) {
		  event.waitUntil(
		    caches.keys().then(function(cacheNames) {
		      return Promise.all(
		        cacheNames.filter(function(cacheName) {
		          // Return true if you want to remove this cache,
		          // but remember that caches are shared across
		          // the whole origin
		          return cacheName !== mainClass.CACHENAME;
		        }).map(function(cacheName) {
		          return caches.delete(cacheName);
		        })
		      );
		    })
		  );
		});

		_self.addEventListener('fetch', function(evt) {
		  
		  let nonCachable = !(evt.request.url.indexOf('http') === 0)  || evt.request.destination!=='document' || evt.request.method=="POST" || evt.request.mode==='cors' || /favicon/.test(evt.request.url)
		  if(!mainClass.cacheGetRequests){
		  	nonCachable = nonCachable || /[?]/.test(evt.request.url)
		  }

		  if(mainClass.exclude(evt.request.url) || nonCachable){
		    return evt.respondWith(fetch(evt.request).catch(error=>console.log(error)))
		  }
		  evt.respondWith(fromCache(evt.request));
		  
		  evt.waitUntil(update(evt.request)
		    // .then(refresh)
		  );

		});
	}




	this.init();

	

}

