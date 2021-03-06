(function (Ω) {
	"use strict";

	var PaintedScreen = Ω.Screen.extend({

		crazy: false,

		init: function (map) {

			this.map = map;

			this.ctx = Ω.gfx.createCanvas(this.map.w, this.map.h);

			this.w = this.map.w;
			this.h = this.map.h;

		},

		tick: function () {},

		bombed: function (x, y) {

			this.paint(x, y, 0, true);

		},

		paint: function (x, y, 	angle, laserBlast, erase) {

			var c = this.ctx,
				size,
				dist,
				amount = Math.random() * (laserBlast ? 20 : 1) + (laserBlast ? 4 : 1),
				col = "hsla(" + (Math.random() * 90 | 0) + ", 0%, " + (Math.random() * 50 + 50 | 0)  +"%, " + ((Math.random().toFixed(2) * 0.5) + 0.5) + ")";

			var cc;
			if(erase) {
				cc = c.globalCompositeOperation;
				c.globalCompositeOperation = "destination-out";
			}
			for(var i = 0; i < amount; i++) {

				if (laserBlast) {
					col = "hsla(" + ((Math.random() * 30 | 0) + 60) + ", 50%, 90%, " + (Math.random().toFixed(2) * 0.8 + 0.2) + ")";
					dist = Math.random() * 30 + 4;
					size = Math.random() * 10 + 2 | 0;
				} else {

					dist = Math.random() * 2 + 2;
					size = Math.random() * 2 + 1 | 0;
				}

				var xo = (x + Math.random() * (laserBlast ? 30 : 12))  + Math.cos(angle) * dist,
					yo = (y + Math.random() * (laserBlast ? 30 : 12)) + Math.sin(angle) * dist;

				c.fillStyle = col;
				c.beginPath();
				c.arc(xo, yo, size, 0, Math.PI*2, false);
				c.closePath();
				c.fill();
			}
			if(erase) {
				c.globalCompositeOperation = cc;
			}

		},

		render: function (gfx, cam) {

			var c = gfx.ctx,
				co = c.globalCompositeOperation;

			c.globalCompositeOperation = "destination-in";

			var x1 = cam.x < 0 ? 0 : cam.x,
				y1 = cam.y < 0 ? 0 : cam.y,
				w1 = cam.x < 0 ? cam.w - cam.x : cam.w,
				h1 = cam.y < 0 ? cam.h - cam.y : cam.h;


			// FIXME: crashes to black if level too narrow!
			// w1 = w1 > 640 ? 640 : w1;
			// h1 = h1 > 480 ? 480 : h1;


			// Could sine move the backtround...
			var xo = !this.crazy ? 0 : Math.sin(Date.now()/110) * 5,
				yo = !this.crazy ? 0 : Math.sin(Date.now()/900) * 5;

			//drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
			gfx.ctx.drawImage(
				this.ctx.canvas,
				x1,
				y1,
				w1,
				h1,
				x1 + xo,
				y1  +yo,
				w1,
				h1);

			c.globalCompositeOperation = "destination-over";

			c.fillStyle = "#fff";
			c.fillRect(0, 0, this.w, this.h)

			c.globalCompositeOperation = co;

		}
	});

	window.PaintedScreen = PaintedScreen;
}(Ω));
