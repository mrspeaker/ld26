(function (Ω) {
	"use strict";

	var PaintedScreen = Ω.Screen.extend({

		init: function (map) {

			this.map = map;
			this._forceRender = true;

			this.ctx = Ω.gfx.createCanvas(this.map.w, this.map.h);

			this.w = this.map.w;
			this.h = this.map.h;

			// for(var i = 0; i < 1000; i++) {
			// 	var ww = this.ctx.canvas.width,
			// 		hh = this.ctx.canvas.height;
			// 	this.ctx.fillStyle = "hsl(" + (Math.random() * 360 | 0) + ", 50%, 50%)";
			// 	this.ctx.fillRect(Math.random() * ww, Math.random() * hh, Math.random() * 100, Math.random() * 50);
			// }
			this.ctx.fillStyle = "#000";
			this.ctx.fillText("TOPLEFT", 0, 20);

			this.ctx.fillText("TOPRIGHT", this.w - 50, 20);
			this.ctx.fillText("BOTLEFT", 0, this.h - 30);
			this.ctx.fillText("BOTRIGHT", this.w - 50, this.h-30);
			this.ctx.fillText("CENTER", this.w / 2, this.h / 2);

		},

		tick: function () {

		},

		paint: function (x, y) {

			var c = this.ctx,
				size = Math.random() * 3 + 1 | 0,
				col = "hsla(" + (Math.random() * 100 | 0) + ", 50%, 80%, " + Math.random().toFixed(2) + ")";

			c.fillStyle = col;
			c.beginPath(); // Start the path
			c.arc(x, y, size, 0, Math.PI*2, false); // Draw a circle context.closePath(); // Close the path
			c.fill(); // Fill the path

		},

		render: function (gfx, cam) {

			var c = gfx.ctx;

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
		}
	});

	window.PaintedScreen = PaintedScreen;
}(Ω));
