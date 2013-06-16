(function (Ω) {
	"use strict";

	// Paints in the level as you shoot
	var LaserBrush = Weapon.extend({

		shooting: false,

		sound: new Ω.Sound("res/audio/ray", 0.9, true),

		ticks: 0,

		fire: function (angle) {

			this.ticks = 80;
			this.shooting = true;
			this.angle = angle;
			this.sound.play();

		},

		released: function () {

			this.shooting = false;
			this.sound.rewind();

		},

		tick: function (screen) {

			if (this.shooting) {

				if (!this.ticks--) {
					this.released();
					this.hit = null;
					return;
				}

				this.hit = Ω.rays.cast(
					this.user.angle,
					this.user.x,
					this.user.y,
					screen.map
				);

				this.angle = this.user.angle;

				if (this.hit) {
					this.hit.x *= screen.map.sheet.w;
					this.hit.y *= screen.map.sheet.h;

					screen.paint_laser(
						this.hit.x,
						this.hit.y,
						this.angle);

					screen.hitz.push([this.hit.x, this.hit.y]);
				}

			} else {
				this.hit = null;
			}

		},

		render: function (gfx) {

			if (this.shooting && this.hit) {

				var c = gfx.ctx;

				c.strokeStyle = "rgba(255, 64, 156, 0.2)";
				c.lineWidth = 10;

				var xstart = this.user.x + (this.user.w / 2) + (Math.sin(Math.PI / 2 - this.angle) * 5),
					ystart = this.user.y + (Math.cos(Math.PI / 2 - this.angle) * 5);

				c.beginPath();
				c.moveTo(xstart, ystart);
				c.lineTo(this.hit.x, this.hit.y);
				c.closePath();
				c.stroke();

				c.strokeStyle = "rgba(255, 64, 156, 0.7)";
				c.lineWidth = 3;

				c.beginPath();
				c.moveTo(xstart, ystart);
				c.lineTo(this.hit.x, this.hit.y);
				c.closePath();
				c.stroke();

			}

		}

	})

	window.LaserBrush = LaserBrush;
}(Ω));
