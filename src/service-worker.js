/*
 * Created on Mon Dec 10 2018
 * Authored by zonebond
 * @github - github.com/zonebond
 * @e-mail - zonebond@126.com
 */

// For better Performance and Compatibility, write code with ES5, Please!
// /abc/dkas/kdla
/* eslint-disable */

const MOCK_SERVICE_BASE = new URL(location).searchParams.get('mock-service-base');

const version = "great-adventure" + ' T_' + (Number(Date.now()).toString(36));
const prefetch = {
	name: version + ' - prefetch',
	list: []
};
const cachePatterns = null;

const useMocksServer = true;
const mockRequestPatterns = [];

const fetchOptions = {};
const REG_REFERRER = /^http(s)?:\/\/[^\/]+\//;
const mockFetchOptions  = {
  mode: 'no-cors',
  headers: {
    "Accept": "mock-server/data, */*"
  }
};

self.addEventListener('install', function(evt) {
	if (typeof self.skipWaiting === 'function') {
		evt.waitUntil(self.skipWaiting());
	}
	evt.waitUntil(precache(prefetch.name, prefetch.list));
});

self.addEventListener('activate', function(evt) {
	if(self.clients && (typeof self.clients.claim === 'function')) {
		evt.waitUntil(self.clients.claim());
	}
	evt.waitUntil(updateCache([prefetch.name]));
});

self.addEventListener('fetch', function(evt) {
	if(useMocksServer && matchMockRequests(evt.request)) {
		evt.respondWith(fromMockService(evt.request));
	}
});

function precache() {
	return caches.open(prefetch.name).then(function(cache) {
		return cache.addAll(prefetch.list);
	});
}

function updateCache(profileNames) {
	return caches.keys().then((cacheNames) => {
		return Promise.all(cacheNames.map(cahceName => {
			if(profileNames.indexOf(cahceName) === -1) {
				return caches.delete(cahceName);
			}
		}));
	});
}

function retrieves(request) {
  if(useMocksServer && matchMockRequests(request)) {
    return fromMockService(request);
	}
	return fromCache(request).then(matching => matching).catch(() => fromNetwork(request));
}

function fromCache(request) {
	return caches.open(prefetch.name).then(cache => {
    return cache.match(request.clone()).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
	});
}

function fromNetwork(request) {
	return fetch(request.clone(), fetchOptions).then(response => {
		if(response.ok) {
			cacheFetch(request.clone(), response.clone());
		}
		return response || Promise.reject('network-error');
	});
}

function cacheFetch(request, response) {
	if(matchFile(request.url)) {
		caches.open(prefetch.name).then(function(cache) {
			return cache.put(request, response);
		})
	}
}

function matchFile(url) {
	return cachePatterns && cachePatterns.some(p => p.test(url));
}

function matchRacers(url) {
	return racerPatterns && racerPatterns.some(p => p.test(url));
}

function matchMockRequests(request) {

	const url = request.url;
  const headers = request.headers;

  return headers.get('use-mock-service') === 'true' ? true : false;
}

function fromMockService(request) {

	const url    = request.url.split(request.referrer);
	const method = request.method.toLowerCase();
	const type   = '.json';

	if(url.length !== 2) {
		return Promise.reject('mock-service-error');
	}

	const origin = url.pop();
	const routes = origin.split('/');
	const max_id = routes.length - 1;

	let target = '/';
	routes.some((r, i) => i === max_id ? (target += `${method}.${r}`, target) : (target += `${r}/`, false));

  let resource = (target + type).replace(/\?/g, '.').replace(/&/g, '.').replace(/=[\w%\d]+/g, '');

  console.warn(`\t[USE-MOCK-SERVICE]\t
  \t[${method.toUpperCase()}] /${decodeURIComponent(origin)}
  \t[${'>'.repeat(method.length)}] ${decodeURIComponent(resource)}`);

  resource = MOCK_SERVICE_BASE === 'undefined' ? resource : MOCK_SERVICE_BASE + resource;

	return fetch(new URL(resource, request.referrer), mockFetchOptions).then(response => response || Promise.reject('mock-service-error'));
}
