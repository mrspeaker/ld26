(function (Ω) {
	"use strict";

	var Spawner = Ω.Entity.extend({

		active: true,
		ticks: 0,

		_forceRender: true,

		cleaners: [],

		init: function (x, y, rate, delay, level) {

			this.x = x;
			this.y = y;

			this.rate = rate;
			this.delay = delay;
			console.log(this.rate, this.delay);

			this.level = level;
		},

		tick: function () {

			console.log(this.ticks++ < this.delay);
			if (this.ticks++ < this.delay) {
				return true;
			}

			if(this.ticks % this.rate === 0) {
				console.log("spawned.", this.cleaners.length);
				this.cleaners.push(new Cleaner(this.x, this.y, this.level));
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
