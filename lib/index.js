'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = LazySW;
function LazySW() {
	var _this = this;

	this.CACHENAME = 'default-lazy-cache';
	this.resources = [];

	this.exclude = function (url) {
		return null;
	};

	this.precache = function () {
		return caches.open(_this.CACHENAME).then(function (cache) {
			return cache.addAll(resources);
		});
	};

	this.fromCache = function (request) {
		return caches.open(_this.CACHENAME).then(function (cache) {
			return cache.match(request).then(function (matching) {
				return matching || fetch(request).catch(function (error) {
					return caches.match('/offline.html');
				});
			});
		});
	};

	this.update = function (request) {

		return caches.open(_this.CACHENAME).then(function (cache) {

			return fetch(request).then(function (response) {
				if (response.status < 300 && response.type === 'basic') {

					return Promise.all([response.clone(), response.text()]);
				}

				return [false, null];
			}).then(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
				    response = _ref2[0],
				    text = _ref2[1];

				if (text) {

					cache.match(request).then(function (matching) {
						return matching ? matching.text() : null;
					}).then(function (cachedText) {
						if (cachedText && !this.stringsAreSame(text, cachedText)) {

							cache.put(request, response.clone()).then(function () {

								this.refresh(response, [text.length, cachedText.length]);
							});
						} else if (!cachedText) {
							cache.put(request, response.clone()).then(function () {});
						}
					});
				}
			}).catch(function (error) {
				return "Network failed";
			});
		});
	};

	this.stringsAreSame = function (a, b) {

		if (a.length !== b.length) {
			return false;
		}

		return a.localeCompare(b) === 0;
	};

	// function lengthsAreSame(a, b){
	//   return a.length === b.length
	// }


	this.refresh = function (response) {
		var info = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		return self.clients.matchAll().then(function (clients) {
			clients.forEach(function (client) {

				var message = {
					type: 'refresh',
					url: response.url,
					info: info
					// eTag: response.headers.get('ETag')
				};
				client.postMessage(JSON.stringify(message));
			});
		});
	};

	this.init = function () {
		self.addEventListener('install', function (evt) {
			console.log('The lazy service worker is being installed.');
			self.skipWaiting();
			if (this.resources) evt.waitUntil(this.precache());
		});

		// delete old caches
		self.addEventListener('activate', function (event) {
			event.waitUntil(caches.keys().then(function (cacheNames) {
				return Promise.all(cacheNames.filter(function (cacheName) {
					// Return true if you want to remove this cache,
					// but remember that caches are shared across
					// the whole origin
					return cacheName !== this.CACHENAME;
				}).map(function (cacheName) {
					return caches.delete(cacheName);
				}));
			}));
		});

		self.addEventListener('fetch', function (evt) {

			var cachableDestinations = ['document', 'font', 'script', 'style', 'image'];

			// !cachableDestinations.includes(evt.request.destination) ||
			var nonCachable = !(evt.request.url.indexOf('http') === 0) || evt.request.destination !== 'document' || evt.request.method == "POST" || evt.request.mode === 'cors' || /[?]/.test(evt.request.url) || /favicon/.test(evt.request.url);
			if (this.exclude.bind(null, evt.request.url) || nonCachable) {
				return evt.respondWith(fetch(evt.request).catch(function (error) {
					return console.log(error);
				}));
			}
			evt.respondWith(this.fromCache(evt.request));

			evt.waitUntil(this.update(evt.request)
			// .then(refresh)
			);
		});
	};

	this.init();
}