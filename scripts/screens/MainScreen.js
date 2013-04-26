(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		bg: new Ω.Image("res/runstopgames.png"),

		tick: function () {

			if (Ω.input.pressed("fire")) {
				console.log("FIRE!");
			}

		},

		render: function (gfx) {

			var c = gfx.ctx,
				title = "LD 26",
				msg = "by Mr Speaker";

			c.fillStyle = "hsl(120, 10%, 95%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

			this.bg.render(gfx, 0, 0);

			c.font = "20pt Monospace";
			gfx.text.drawShadowed(title, gfx.w / 2 - gfx.text.getHalfWidth(title), gfx.h * 0.45);
			c.font = "8pt Monospace";
			gfx.text.drawShadowed(msg, gfx.w / 2 - gfx.text.getHalfWidth(msg), gfx.h * 0.6, 1);

		}

	});

	window.MainScreen = MainScreen;

}(Ω));
