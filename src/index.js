export default function LazySW() {
	

	this.CACHENAME = 'default-lazy-cache'
	this.resources = [];
	


	this.exclude = (url) => {
		return null
	}

	this.precache = () => {
	  return caches.open(this.CACHENAME).then(function (cache) {
	    return cache.addAll(resources);
	  });
	}

	this.fromCache = (request) => {
	  return caches.open(this.CACHENAME
	    ).then(function (cache) {
	    return cache.match(request).then(function (matching) {
	      return matching ||  fetch(request).catch(error=>{
	                              return caches.match('/offline.html')
	                          
	                          });
	    });
	  });
	}

	this.update = (request) => {
	  
	  return caches.open(this.CACHENAME).then(function (cache) {

	    return fetch(request).then(function (response) {
	      if(response.status<300 && response.type==='basic'){
	  
	        return Promise.all([response.clone(), response.text()]);
	      }

	      return [false, null];


	      

	      

	    })

	    .then(([response, text])=>{
	      if(text){

	        cache.match(request).then(matching=>matching?matching.text():null).then(function (cachedText) {
	          if(cachedText && !this.stringsAreSame(text, cachedText)){
	            
	            cache.put(request, response.clone()).then(function () {

	              this.refresh(response, [text.length, cachedText.length])
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

	this.stringsAreSame = (a, b) => {
	    
	    if (a.length !== b.length) {
	      return false;
	    }
	    
	    return a.localeCompare(b) === 0;
	}

	// function lengthsAreSame(a, b){
	//   return a.length === b.length
	// }


	this.refresh = (response, info=null) => {
	  return self.clients.matchAll().then(function (clients) {
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
		self.addEventListener('install', function(evt) {
		  console.log('The lazy service worker is being installed.');
		  self.skipWaiting()
		  if(this.resources) evt.waitUntil(this.precache());
		});

		// delete old caches
		self.addEventListener('activate', function(event) {
		  event.waitUntil(
		    caches.keys().then(function(cacheNames) {
		      return Promise.all(
		        cacheNames.filter(function(cacheName) {
		          // Return true if you want to remove this cache,
		          // but remember that caches are shared across
		          // the whole origin
		          return cacheName !== this.CACHENAME;
		        }).map(function(cacheName) {
		          return caches.delete(cacheName);
		        })
		      );
		    })
		  );
		});

		self.addEventListener('fetch', function(evt) {

		  const cachableDestinations = ['document', 'font', 'script', 'style', 'image']

		  // !cachableDestinations.includes(evt.request.destination) ||
		  const nonCachable = !(evt.request.url.indexOf('http') === 0)  || evt.request.destination!=='document' || evt.request.method=="POST" || evt.request.mode==='cors' || /[?]/.test(evt.request.url) || /favicon/.test(evt.request.url)
		  if(this.exclude.bind(null, evt.request.url) || nonCachable){
		    return evt.respondWith(fetch(evt.request).catch(error=>console.log(error)))
		  }
		  evt.respondWith(this.fromCache(evt.request));
		  
		  evt.waitUntil(this.update(evt.request)
		    // .then(refresh)
		  );

		});
	}




	this.init()

	

}