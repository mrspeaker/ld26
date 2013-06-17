(function (Ω) {

	"use strict";

	var LevelScreen = Ω.Screen.extend({

		sheet: new Ω.SpriteSheet("res/tiles.png", 32),
		sound: new Ω.Sound("res/audio/tickle", 0.8, true),

		loaded: false,
		finalLevel: false,
		requiresGun: false,

		player: null,
		door: null,
		pickups: null,
		collidables: null,
		spawner: null,

		ticks: 0,

		init: function (levelIdx, isFinal) {

			this.finalLevel = levelIdx === 3;
			this.hitz = [];

			$.ajax({
				url: "res/levels/level_" + (levelIdx + 1) + ".json",
				context: this
			}).done(function (data) {

				// For some reason som data from Tiled is 1 tile too high.
				// Hence the y-32 everywhere.

				var mapped = [],
					mainLayer = Ω.utils.getByKeyValue(data.layers, "name", "main"),
					entities = Ω.utils.getByKeyValue(data.layers, "name", "entities"),
					maptities = Ω.utils.getByKeyValue(data.layers, "name", "maptities"),
					cells =  mainLayer.data;

				// Can't just "reach the door" on the first level
				if (mainLayer.properties && mainLayer.properties.requires_gun){
					this.requiresGun = true;
				}

				// Convert the Tiled 1d map array to 2d
				while (cells.length > 0) {
				    mapped.push(cells.splice(0, mainLayer.width));
				}

				this.map = new Ω.Map(this.sheet, mapped);

				var player = Ω.utils.getByKeyValue(entities.objects, "name", "player_start"),
					pickups = Ω.utils.getAllByKeyValue(entities.objects, "name", "pickup"),
					door = Ω.utils.getByKeyValue(entities.objects, "name", "door"),
					spawner = Ω.utils.getByKeyValue(entities.objects, "name", "spawner"),
					baddie_spawner = Ω.utils.getByKeyValue(entities.objects, "name", "baddie_spawner"),
					collidables = Ω.utils.getAllByKeyValue(entities.objects, "type", "collidable"),
					self = this;

				this.player = new Player(player.x, player.y - 32, this);
				this.player.setMap(this.map);

				if (door) {
					this.door = new Door(door.x, door.y, function () {

						if (!self.requiresGun || self.player.weapons[1]) {
							Ω.Sound._reset();
							self.door.sound.play(); // TODO: move sound here.
							self.levelOver();
						}

					});
				} else {
					console.log("errm... no door in this level.");
					this.door = new Ω.Entity(0, 0);
				}

				if (spawner) {
					var sp_rate = parseInt((spawner.properties && spawner.properties.rate) || 250, 10),
						sp_delay = parseInt((spawner.properties && spawner.properties.delay) || 200, 10),
						sp_bugspeed = parseInt((spawner.properties && spawner.properties.bugspeed) || 4, 10),
						sp_rate_inc =  parseInt((spawner.properties && spawner.properties.rate_increase) || 0, 10);
					this.spawner = new Spawner(spawner.x, spawner.y, sp_rate, sp_delay, sp_bugspeed, sp_rate_inc, this);
				}

				if (baddie_spawner) {
					this.baddie_spawner = new BaddieSpawner(baddie_spawner.x, baddie_spawner.y, 250, 200, 4, 0, this);
				}

				this.physics = new Ω.Physics();

				this.pickups = pickups.map(function (pickup) {
					var p = null;
					switch (pickup.type) {
						case "laser":
							p = new LaserBrushPickup(pickup.x, pickup.y - 32);
							break;
						case "gun":
							p = new GunPickup(pickup.x, pickup.y - 32);
							break;
						default:
							console.error("unkonwn pickup type", pickup.type)
							break;
					}
					return p;
				});

				this.collidables = collidables.map(function (c) {

					return new Collidable(c.name, c.x, c.y, c.width, c.height);

				});

				this.camera = new Ω.TrackingCamera(this.player, 0, 0, Ω.env.w, Ω.env.h);
				this.painted = new PaintedScreen(this.map);

				this.loaded = true;

				this.sound.play();


			});

			this.bullets = [];

		},

		tick: function () {

			var self = this;

			this.ticks++;

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

			if(this.finalLevel && this.ticks > 1200) {
				this.painted.crazy = true;
			}

			this.spawner && this.spawner.tick();
			this.baddie_spawner && this.baddie_spawner.tick();

			this.physics.checkCollision(this.player, this.pickups, "pickhit");
			this.physics.checkCollision(this.player, [this.door], "doorhit");
			this.physics.checkCollision(this.player, this.collidables, "triggerhit");

			this.camera.tick();

		},

		levelOver: function () {

			game.nextLevel();

		},

		startSpawner: function () {

			if (this.spawner) {
				this.spawner.active = true;
			}

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

		unpaint: function (x, y) {

			this.painted.paint(x, y, 0, true, true);

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

			this.camera.render(gfx, [this.map, this.door, this.painted, this.player, this.bullets, this.pickups, this.spawner, this.baddie_spawner]);

		}

	});

	window.LevelScreen = LevelScreen;

}(Ω));
