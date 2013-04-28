(function (Ω) {

	"use strict";

	var Game = Ω.Game.extend({

		canvas: "#board",

		init: function (w, h, col) {

			this._super(w, h, col);

			Ω._progress = function (cur, max) {
				// use for progress bar
			};

			var az = urlParams.azerty;

			Ω.input.binds([
				["space", "jump"],
				["escape", "escape"],
				[az ? "az_a" : "a", "left"],
				[az ? "az_d" : "d", "right"],
				[az ? "az_w" : "w", "jump"],
				[az ? "az_s" : "s", "down"],
				["left", "left"],
				["right", "right"],
				["up", "jump"],
				["down", "down"],
				["mouse1", "fire"]
			]);

			this.setScreen(new MainScreen());

		},

		reset: function () {

			Ω.Sound._reset();
			Ω.input.reset();
			this.setScreen(new MainScreen());

		}

	});

	window.Game = Game;

}(Ω));