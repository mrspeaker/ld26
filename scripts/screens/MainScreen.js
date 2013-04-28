(function (Ω) {

	"use strict";

	var MainScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),

		sound: new Ω.Sound("res/audio/tickle", 0.8, true),

		loaded: false,

		requiresGun: false,

		init: function () {

			$.ajax({
				url: "res/tiled.json",
				context: this
			}).done(function (data) {

				// For some reason som data from tiles is 1 tile too high.
				// Hence the y-32 everywhere.

				var mapped = [],
					mainLayer = Ω.utils.getByKeyValue(data.layers, "name", "main"),
					cells =  mainLayer.data;

				// Can't just "reach the door" on the first level
				if (mainLayer.properties.requires_gun){
					this.requiresGun = true;
				}

				while (cells.length > 0) {
				    mapped.push(cells.splice(0, mainLayer.width));
				}

				this.map = new Ω.Map(this.sheet, mapped);

				var entities = Ω.utils.getByKeyValue(data.layers, "name", "entities"),
					player = Ω.utils.getByKeyValue(entities.objects, "name", "player_start"),
					pickups = Ω.utils.getAllByKeyValue(entities.objects, "name", "pickup"),
					door = Ω.utils.getByKeyValue(entities.objects, "name", "door"),
					self = this;

				this.player = new Player(player.x, player.y - 32, this);
				this.player.setMap(this.map);

				this.door = new Door(door.x, door.y, function () {

					if (!self.requiresGun || self.player.weapons[1]) {
						self.door.sound.play(); // TODO: move sound here.
						self.levelOver();
					}

				});

				this.physics = new Ω.Physics();

				this.pickups = pickups.map(function (pickup) {
					var p = null;
					switch (pickup.type) {
						case "laser":
							p = new LaserBrushPickup(pickup.x, pickup.y - 32);
							break;
					}
					return p;
				});

				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);
				this.painted = new PaintedScreen(this.map);

				this.loaded = true;

				// wtf? getting dom exc. so wrappied in timeout
				setTimeout(function () {
					self.sound.play();
				}, 1000);


			});

			this.bullets = [];

		},

		tick: function () {

			var self = this;

			this.player.tick(this.map);

			if (Math.random () < 0.01) {
				//this.addBullet(15 * 32, 3 * 32, Math.random() * (Math.PI * 2));
			}

			this.pickups = this.pickups.filter(function (p) {
				return p.tick();
			});

			this.bullets = this.bullets.filter(function (b) {
				return b.tick(self.map);
			});

			this.physics.checkCollision(this.player, this.pickups, "pickhit");
			this.physics.checkCollision(this.player, [this.door], "doorhit");

			this.camera.tick();

		},

		levelOver: function () {

			alert("win the game!");
			game.reset();

		},

		addBullet: function (x, y, angle) {

			this.bullets.push(new PaintBullet(x, y, angle, this));

		},

		bombed: function (x, y) {

			this.painted.bombed(x, y);

		},

		paint: function (x, y, angle, pow) {

			this.painted.paint(x, y, angle, pow);

		},

		paint_laser: function (x, y, angle) {

			this.painted.paint(x, y, angle, true);
		},

		paint_vision: function (x, y, angle) {

			this.painted.paint(x, y, angle, false);

		},

		render: function (gfx) {

			var c = gfx.ctx;

			c.fillStyle = "hsl(120, 3%, 0%)";
			c.fillRect(0, 0, gfx.w, gfx.h);

			this.camera.render(gfx, [this.map, this.door, this.painted, this.player, this.bullets, this.pickups]);

		}

	});

	window.MainScreen = MainScreen;

}(Ω));
