(function (Ω) {
	"use strict";

	var Pickup = Ω.Entity.extend({

		w: 24,
		h: 24,

		init: function (x, y) {

			this.x = x;
			this.y = y;
			this.got = false;

		},

		tick: function () {

			return !this.got;

		},

		pickhit: function () {},
		picked: function (p) {
			this.got = true;
		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "blue";
			c.fillRect(this.x, this.y, this.w, this.h);

		}

	});

	window.Pickup = Pickup;
}(Ω));
