(function (Ω) {
	"use strict";

	var Weapon = Ω.Class.extend({

		init: function (user) {

			this.user = user;

		},

		tick: function (paintScreen) {},

		fire: function (angle) {},

		released: function () {},

		render: function (gfx) {}

	})

	window.Weapon = Weapon;
}(Ω));
