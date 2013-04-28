(function (Ω) {
	"use strict";

	var Block = Ω.Entity.extend({

		w: 32,
		h: 32,

		init: function (x, y) {

			this.x = x;
			this.y = y;

		},

		tick: function () {

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "blue";
			c.fillRect(this.x, this.y, this.w, this.h);

		}

	});

	window.Pickup = Pickup;
}(Ω));
