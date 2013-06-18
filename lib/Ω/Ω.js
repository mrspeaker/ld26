var Ω = (function() {

	"use strict";

	var preloading = true,
		pageLoaded = false,
		assetsToLoad = 0,
		maxAssets = 0,
		timers = [];

	window.test_load = function () {

		console.log(preloading, assetsToLoad, maxAssets);

	};

	return {

		evt: {
			onload: [],
			progress: []
		},

		env: {
			w: 0,
			h: 0
		},

		preload: function () {

			if (!preloading) {
				return function () {};
			}

			maxAssets = Math.max(++assetsToLoad, maxAssets);

			return function () {

				assetsToLoad -= 1;

				Ω.evt.progress.map(function (p) {
					return p(assetsToLoad, maxAssets);
				});

				if (assetsToLoad === 0) {
					// FIXME: onload could fire if first resource finishes
					// loading before second added to queue
					if (!preloading) {
						console.error("Preloading finished (onload called) multiple times!");
					}
					preloading = false;

					console.log("Finished loading " + maxAssets + " assets. Running " + Ω.evt.onload.length + " onload handlers");
					Ω.evt.onload.map(function (o) {
						o();
					});
				}


			}
		},

		pageLoad: function () {

			pageLoaded = true;

			console.log("Page load called", preloading, assetsToLoad, maxAssets);
			if (maxAssets === 0) {
				// No assets to load, so fire onload
				Ω.evt.onload.map(function (o) {
					o();
				});
			}

		},

		timers: {

			add: function (timer) {

				timers.push(timer);

			},

			tick: function () {

				timers = timers.filter(function (t) {

					return t.tick();

				});

			}

		},

		urlParams: (function () {
			var params = {},
				match,
				pl = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query = window.location.search.substring(1);

			while (match = search.exec(query)) {
			   params[decode(match[1])] = decode(match[2]);
			}

			return params;
		}())

	};

}());

// Polyfills
Array.isArray || (Array.isArray = function (a){ return '' + a !== a && {}.toString.call(a) == '[object Array]' });
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

