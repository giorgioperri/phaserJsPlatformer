import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import initAnims from '../anims';
import Collectibles from '../groups/Collectibles';
import Hud from '../hud';
import EventEmitter from '../events/Emitter';

class Play extends Phaser.Scene {
	constructor(config) {
		super('PlayScene');
		this.config = config;
	}

	create({ gameStatus }) {
		this.score = 0;
		this.hud = new Hud(this, 0, 0).setDepth(9);

		this.playBGMusic();
		this.collectSound = this.sound.add('collectiblePickup', { volume: 0.2 });

		const map = this.createMap();

		initAnims(this.anims);

		const layers = this.createLayers(map);
		const playerZones = this.getPlayerZones(layers.playerZones);
		const player = this.createPlayer(playerZones.start);
		const enemies = this.createEnemies(layers.enemySpawns, layers.platformsColliders);
		const collectibles = this.createCollectables(layers.collectibles);

		this.createBG(map);

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

		this.createBackButton();
		this.createEndOfLevel(playerZones.end, player);
		this.setupFollowupCameraOn(player);

		if (gameStatus === 'PLAYER_LOST') {
			return;
		}

		this.createGameEvents();
	}

	playBGMusic() {
		if (this.sound.get('theme')) return;
		this.sound.add('theme', { loop: true, volume: 0.1 }).play();
	}

	createMap() {
		const map = this.make.tilemap({ key: `level-${this.getCurrentLevel()}` });
		map.addTilesetImage('main_lev_build_1', 'tiles-1');
		map.addTilesetImage('main_lev_build_2', 'tiles-2');
		map.addTilesetImage('bg_spikes_tileset', 'tiles-bg');
		return map;
	}

	createLayers(map) {
		const tileset1 = map.getTileset('main_lev_build_1');
		const tileset2 = map.getTileset('main_lev_build_2');
		const tilesetBG = map.getTileset('bg_spikes_tileset');
		map.createLayer('BGcolor', tilesetBG);
		const platformsColliders = map.createLayer('PlatformColliders', [tileset1, tileset2]);
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

	createBG(map) {
		const bgObject = map.getObjectLayer('DistanceBg').objects[0];
		this.spikesImage = this.add
			.tileSprite(bgObject.x, bgObject.y, this.config.width, bgObject.height, 'bg-spikes-dark')
			.setDepth(-10)
			.setOrigin(0, 1)
			.setScrollFactor(0, 1);

		this.skyImage = this.add
			.tileSprite(0, 0, this.config.width, 180, 'sky')
			.setDepth(-15)
			.setOrigin(0)
			.setScale(1.1)
			.setScrollFactor(0, 1);
	}

	createGameEvents() {
		EventEmitter.on('PLAYER_LOST', () => {
			this.scene.restart({ gameStatus: 'PLAYER_LOST' });
		});
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
		this.collectSound.play();
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

	getCurrentLevel() {
		return this.registry.get('level') || 1;
	}

	createBackButton() {
		this.add
			.image(this.config.rightBottomCorner.x, this.config.rightBottomCorner.y, 'back')
			.setOrigin(1)
			.setScrollFactor(0)
			.setScale(1.5)
			.setInteractive()
			.on('pointerup', () => {
				this.scene.start('MenuScene');
			});
	}

	createEndOfLevel(end, player) {
		const endOfLevel = this.physics.add
			.sprite(end.x, end.y, 'end')
			.setAlpha(0)
			.setSize(5, this.config.height * 1.5)
			.setOrigin(0.5, 1);

		const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
			eolOverlap.active = false;

			if (this.registry.get('level') === this.config.lastLevel) {
				this.scene.start('CreditsScene');
				return;
			}

			this.registry.inc('level', 1);
			this.registry.inc('unlocked-levels', 1);
			this.scene.restart({ gameStatus: 'LEVEL_COMPLETED' });
		});
	}

	update() {
		this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3;
		this.skyImage.tilePositionX = this.cameras.main.scrollX * 0.2;
	}
}

export default Play;
