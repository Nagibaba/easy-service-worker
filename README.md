# lazy-service-worker

Laziest caching ever. No need to hard work as ETag or whatever. As easy as drinking a coffee, even easier.
| WARNING: Any regenerated strings like csrf tokens may end up with forever reloading. If so, avoid reload function! |
| --- |

#### 1. Caches only urls. Images and other assets should be the concern  of browsers

#### 2. First, returns cached version of url. 

#### 3. After that, makes a fetch request on background to that url.

#### 4. If there is any difference between cached and remote html, then updates it on background and sends a message to client 

#### 5. When client gets a message to refresh, it can reload the page or load via js (example: jQuery load function)


#### See the example folder for testing it yourself


## Usage

### Service worker file

```
importScripts('https://cdn.jsdelivr.net/gh/nagibaba/lazy-service-worker@v1.0.0/lib/index.js');

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
```

### Html part (Client)


```
<script>
	if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register("/sw.js")
            .then((reg) => {
              console.log('Service worker registered.', reg);
            });
        });


        navigator.serviceWorker.onmessage = function (evt) {
          const message = JSON.parse(evt.data);
          const isRefresh = message.type === 'refresh';

          if(isRefresh){
            location.reload();
            // or jQuery load function
           }
        }
        
    }
</script>

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
