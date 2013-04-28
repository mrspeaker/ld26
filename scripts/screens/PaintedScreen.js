(function (Ω) {
	"use strict";

	var PaintedScreen = Ω.Screen.extend({

		init: function (map) {

			this.map = map;

			this.ctx = Ω.gfx.createCanvas(this.map.w, this.map.h);

			this.w = this.map.w;
			this.h = this.map.h;

		},

		tick: function () {

		},

		bombed: function (x, y) {

			//var c = this.ctx;

			//c.fillRect(x - 50, y - 50, 100, 100);
			this.paint(x, y, 0, true);

		},

		paint: function (x, y, 	angle, powpow) {

			if (!powpow) {
				//console.log("anyone capp this?");
				//return;
			}

			var c = this.ctx,
				size,
				dist,
				amount = Math.random() * (powpow ? 20 : 1) + (powpow ? 4 : 1),
				col = "hsla(" + (Math.random() * 90 | 0) + ", 0%, " + (Math.random() * 50 + 50 | 0)  +"%, " + ((Math.random().toFixed(2) * 0.5) + 0.5) + ")";

			for(var i = 0; i < amount; i++) {

				if (powpow) {
					col = "hsla(" + ((Math.random() * 30 | 0) + 60) + ", 50%, 90%, " + (Math.random().toFixed(2) * 0.8 + 0.2) + ")";
					dist = Math.random() * 30 + 4;
					size = Math.random() * 10 + 2 | 0;
				} else {

					dist = Math.random() * 2 + 2;
					size = Math.random() * 2 + 1 | 0;
				}

				var xo = (x + Math.random() * (powpow ? 30 : 12))  + Math.cos(angle) * dist,
					yo = (y + Math.random() * (powpow ? 30 : 12)) + Math.sin(angle) * dist;

				var block = this.map.getBlocks([[xo, yo]])[0];

				if(!powpow && block < 1){
				 	//continue;
				 }

				c.fillStyle = col;
				c.beginPath(); // Start the path
				c.arc(xo, yo, size, 0, Math.PI*2, false); // Draw a circle context.closePath(); // Close the path
				c.fill(); // Fill the path
				//c.fillRect(xo, yo, size / 4, size);

			}

		},

		render: function (gfx, cam) {

			var c = gfx.ctx;

			c.save();

			var co = c.globalCompositeOperation;

			this.map.render(gfx, cam);

			c.globalCompositeOperation = "destination-in";
			//drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)

			// TODO: crop properly!
			gfx.ctx.drawImage(
				this.ctx.canvas,
				0,
				0,
				this.w,
				this.h,
				0,
				0,
				this.w,
				this.h);

			c.globalCompositeOperation = "destination-over";

			c.fillStyle = "#fff";
			c.fillRect(0, 0, this.w, this.h)

			c.globalCompositeOperation = co;

			c.restore();
		}
	});

	window.PaintedScreen = PaintedScreen;
}(Ω));
