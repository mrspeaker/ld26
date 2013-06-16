(function (Ω) {
	"use strict";

	var Spawner = Ω.Entity.extend({

		sound: new Ω.Sound("res/audio/bug", 0.6, false),

		active: false,
		ticks: 0,

		_forceRender: true,

		cleaners: [],

		init: function (x, y, rate, delay, bugspeed, rate_inc, level) {

			this.x = x;
			this.y = y;

			this.rate = rate;
			this.delay = delay;
			this.bugspeed = bugspeed;
			this.rate_inc = rate_inc;

			this.active = true;

			this.level = level;
		},

		tick: function () {

			if (!this.active) {
				return;
			}

			if (this.ticks++ < this.delay) {
				return true;
			}

			if((this.ticks % this.rate) === 0) {

				this.sound.play();

				if(this.cleaners.length < 30) {
					this.cleaners.push(new Cleaner(this.x, this.y, this.bugspeed, this.level));
				}

				if(this.rate_inc && this.rate > 50) {
					this.rate -= this.rate_inc;
				}
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
