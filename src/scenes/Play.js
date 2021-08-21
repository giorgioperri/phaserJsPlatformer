import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import initAnims from '../anims';
import Collectibles from '../groups/Collectibles';
import Hud from '../hud';

class Play extends Phaser.Scene {
	constructor(config) {
		super('PlayScene');
		this.config = config;
	}

	create() {
		this.score = 0;
		this.hud = new Hud(this, 0, 0).setDepth(9);

		const map = this.createMap();

		initAnims(this.anims);

		const layers = this.createLayers(map);
		const playerZones = this.getPlayerZones(layers.playerZones);
		const player = this.createPlayer(playerZones.start);
		const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
		const collectibles = this.createCollectables(layers.collectibles);

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
				projectiles: enemies.getProjectiles(),
				collectibles,
				traps: layers.traps,
			},
		});

		this.createEndOfLevel(playerZones.end, player);
		this.setupFollowupCameraOn(player);
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
		const platformsColliders = map.createLayer('PlatformColliders', [tileset1, tileset2]);
		const background = map.createLayer('Background', [tileset1, tileset2]);
		const backgroundDetails = map.createLayer('BackgroundDetails', [tileset1, tileset2]);
		const platformsDown = map.createLayer('PlatformsDown', [tileset1, tileset2]);
		const platforms = map.createLayer('Platforms', [tileset1, tileset2]);
		const secondaryPlatforms = map.createLayer('SecondaryPlatforms', [tileset1, tileset2]);
		const playerZones = map.getObjectLayer('PlayerZones');
		const enemySpawns = map.getObjectLayer('EnemySpawnPoints');
		const collectibles = map.getObjectLayer('Collectibles');
		const traps = map.createLayer('Traps', tileset1);

		platformsColliders.setCollisionByProperty({ collides: true });
		traps.setCollisionByExclusion(-1);

		return {
			platformsColliders,
			background,
			backgroundDetails,
			platforms,
			playerZones,
			secondaryPlatforms,
			platformsDown,
			enemySpawns,
			collectibles,
			traps,
		};
	}

	createCollectables(collectiblesLayer) {
		const collectibles = new Collectibles(this).setDepth(3);

		collectibles.addFromLayer(collectiblesLayer);
		collectibles.playAnimation('diamondShine');

		return collectibles;
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

	onHit(entity, weapon) {
		entity.takesHit(weapon);
	}

	onCollect(entity, collectable) {
		this.score += collectable.score;
		this.hud.updateScoreBoard(this.score);
		collectable.disableBody(true, true);
	}

	createEnemyColliders(enemies, { colliders }) {
		enemies
			.addCollider(colliders.platformsColliders)
			.addCollider(colliders.player, this.onPlayerCollision)
			.addCollider(colliders.player.projectiles, this.onHit)
			.addOverlap(colliders.player.meleeWeapon, this.onHit);
	}

	createPlayerColliders(player, { colliders }) {
		player
			.addCollider(colliders.platformsColliders)
			.addCollider(colliders.projectiles, this.onHit)
			.addOverlap(colliders.collectibles, this.onCollect, this)
			.addCollider(colliders.traps, this.onHit);
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
