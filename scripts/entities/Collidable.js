(function (Ω) {
	"use strict";

	var Collidable = Ω.Class.extend({

		hit: false,

		init: function (type, x, y, w, h) {

			this.type = type;
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;

		},

		setHit: function (hit) {

			this.hit = hit;

		},

		triggerhit: function () {}

	});

	window.Collidable = Collidable;
}(Ω));
