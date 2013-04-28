(function (Ω) {
	"use strict";

	var Cleaner = Ω.Entity.extend({

		sheet: new Ω.SpriteSheet("res/heads.png", 16),

		ticks: 0,

		init: function (x, y, screen) {
			this.x = x;
			this.y = y;

			this.dir = screen.hitz.pop();

			this.screen = screen;
		},

		tick: function () {

			if(this.ticks++ % 3 === 0) {
				this.screen.unpaint(this.x, this.y);
			}

			if (this.dir) {
				if(this.x < this.dir[0]) {
					this.x += 5;
				}
				if(this.x > this.dir[0]) {
					this.x -= 5;
				}
				if(this.y < this.dir[1]) {
					this.y += 5;
				}
				if(this.y > this.dir[1]) {
					this.y -= 5;
				}

				if(Math.abs(this.x - this.dir[0]) < 6 && Math.abs(this.y - this.dir[1]) < 6) {
					this.dir = this.screen.hitz.pop();
				}
			} else {
				this.x += (Math.random() * 16)- 8;
				this.y += (Math.random() * 16) - 8;
			}

			return true;
		},

		sendTo: function (x, y) {

		},

		render: function (gfx) {

			this.sheet.render(gfx, 8, 0, this.x, this.y);

		}


	});

	window.Cleaner = Cleaner;
}(Ω));
