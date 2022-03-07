# Easy service worker

## Easiest caching ever

No need to hard work as ETag or whatever. As easy as drinking a coffee, even easier.

##### 1. Caches only html. Images and other assets should be the concern of browsers

##### 2. First, returns the cached version of the url.

##### 3. After that, makes a fetch request on background to that very same url.

##### 4. If our algorithm finds any difference between the cached and the remote html, then updates the cache on background and sends a message to the client

##### 5. When the client gets the message to refresh, it can reload the page or load it via js (example: jQuery load function)

#### See the example folder for testing it yourself

## Usage

### Service worker file

```

importScripts('https://cdn.jsdelivr.net/gh/nagibaba/easy-service-worker@1.2.3/lib/index.js');

const sw = new EasySW();

sw.CACHENAME = 'default-easy-cache-v1'

// resources to be precached
// @default ['/']
sw.precacheResources = ['/'];

// Cache requests including "?"
// @default false
sw.cacheGetRequests = false;

// offline if not cached
// @default '/offline'
sw.offlinePage = '/offline';


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
            const isUncachableResponse = message.type === 'uncachable-response';

            if(isRefresh){
              location.reload();
            }

            if(isUncachableResponse){
              // response code is 300 or more
            }
          }

    }
</script>

```

| WARNING: Any regenerated strings like csrf tokens may end up with forever reloading. If so, avoid reload function or wrap any regenerated texts inside `<!--EasySWIgnore--> <!--/EasySWIgnore-->`|

## Example
#### See the example folder for testing it yourself

```
npm run serve
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

```
npm run prepublish
```

## Version 1.2.3

## License

[MIT](https://choosealicense.com/licenses/mit/)
