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
				["left", "left"],
				["right", "right"],
				["up", "up"],
				["down", "down"]
			]);

			this.setScreen(new MainScreen());

		}

	});

	window.Game = Game;

}(Ω));