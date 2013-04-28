(function (Ω) {
	"use strict";

	var Spawner = Ω.Entity.extend({

		active: true,
		ticks: 0,

		cleaners: [],

		init: function (x, y) {
			this.x = x;
			this.y = y;
		},

		tick: function () {

			if(this.ticks++ % 100 === 0) {
				this.cleaners.push(new Cleaner(this.x, this.y));
			};

			this.cleaners = this.cleaners.filter(function (c) {
				return c.tick();
			});

		},

		render: function (gfx) {

			this.cleaners.forEach(function (c) {
				c.render(gfx);
			});

		}


	});

	window.Spawner = Spawner;
}(Ω));
