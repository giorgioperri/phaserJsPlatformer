import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import initAnims from '../anims';

class Play extends Phaser.Scene {
	constructor(config) {
		super('PlayScene');
		this.config = config;
	}

	create() {
		const map = this.createMap();
		const layers = this.createLayers(map);
		const playerZones = this.getPlayerZones(layers.playerZones);
		const player = this.createPlayer(playerZones.start);
		const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
		this.createForegroundDressing(map);

		this.createEnemyColliders(enemies, {
			colliders: {
				platformsColliders: layers.platformsColliders,
				player,
			},
		});

		this.createPlayerColliders(player, {
			colliders: {
				platformsColliders: layers.platformsColliders,
			},
		});

		this.createEndOfLevel(playerZones.end, player);
		this.setupFollowupCameraOn(player);

		initAnims(this.anims);
	}

	finishDrawing(pointer, layer) {
		this.line.x2 = pointer.worldX;
		this.line.y2 = pointer.worldY;

		this.graphics.clear();
		this.graphics.strokeLineShape(this.line);

		this.tileHits = layer.getTilesWithinShape(this.line);

		if (this.tileHits.length > 0) {
			this.tileHits.forEach((tile) => {
				tile.index !== -1 && tile.setCollision(true);
			});
		}

		this.drawDebug(layer);

		this.plotting = false;
	}

	createMap() {
		const map = this.make.tilemap({ key: 'map' });
		map.addTilesetImage('main_lev_build_1', 'tiles-1');
		map.addTilesetImage('main_lev_build_2', 'tiles-2');
		return map;
	}

	createLayers(map) {
		const tileset1 = map.getTileset('main_lev_build_1');
		const tileset2 = map.getTileset('main_lev_build_2');
		const platformsColliders = map.createStaticLayer('PlatformColliders', [tileset1, tileset2]);
		const background = map.createStaticLayer('Background', [tileset1, tileset2]);
		const backgroundDetails = map.createStaticLayer('BackgroundDetails', [tileset1, tileset2]);
		const platformsDown = map.createStaticLayer('PlatformsDown', [tileset1, tileset2]);
		const platforms = map.createStaticLayer('Platforms', [tileset1, tileset2]);
		const secondaryPlatforms = map.createStaticLayer('SecondaryPlatforms', [tileset1, tileset2]);
		const playerZones = map.getObjectLayer('PlayerZones');
		const enemySpawns = map.getObjectLayer('EnemySpawnPoints');

		platformsColliders.setCollisionByProperty({ collides: true });

		return {
			platformsColliders,
			background,
			backgroundDetails,
			platforms,
			playerZones,
			secondaryPlatforms,
			platformsDown,
			enemySpawns,
		};
	}

	createForegroundDressing(map) {
		const tileset = map.getTileset('main_lev_build_1');
		map.createLayer('Dressing', tileset);
	}

	createPlayer(start) {
		return new Player(this, start.x, start.y);
	}

	createEnemies(spawnLayer, platformsColliders) {
		const enemies = new Enemies(this);
		const enemyTypes = enemies.getTypes();

		spawnLayer.objects.forEach((spawnPoint) => {
			const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
			enemy.setPlatformColliders(platformsColliders);
			enemies.add(enemy);
		});

		return enemies;
	}

	onPlayerCollision(enemy, player) {
		player.takesHit(enemy);
	}

	onWeaponHit(entity, weapon) {
		entity.takesHit(weapon);
	}

	createEnemyColliders(enemies, { colliders }) {
		enemies
			.addCollider(colliders.platformsColliders)
			.addCollider(colliders.player, this.onPlayerCollision)
			.addCollider(colliders.player.projectiles, this.onWeaponHit);
	}

	createPlayerColliders(player, { colliders }) {
		player.addCollider(colliders.platformsColliders);
	}

	setupFollowupCameraOn(player) {
		const { height, width, mapOffset, zoomFactor } = this.config;
		this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
		this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
		this.cameras.main.startFollow(player);
	}

	getPlayerZones(playerZonesLayer) {
		const playerZones = playerZonesLayer.objects;
		return {
			start: playerZones.find((zone) => zone.name === 'StartZone'),
			end: playerZones.find((zone) => zone.name === 'EndZone'),
		};
	}

	createEndOfLevel(end, player) {
		const endOfLevel = this.physics.add
			.sprite(end.x, end.y, 'end')
			.setAlpha(0)
			.setSize(5, this.config.height * 1.5)
			.setOrigin(0.5, 1);

		const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
			eolOverlap.active = false;
			console.log('Payer has won!');
		});
	}
}

export default Play;
