(function (Ω) {

	"use strict";

	var Game = Ω.Game.extend({

		canvas: "#board",

		init: function (w, h) {

			this._super(w, h);

			Ω._progress = function (cur, max) {
				// use for progress bar
			};

			Ω.input.binds([
				["space", "fire"],
				["escape", "escape"],
				["a", "left"],
				["d", "right"],
				["w", "up"],
				["s", "down"]
			]);

			this.setScreen(new MainScreen());

		}

	});

	window.Game = Game;

}(Ω));