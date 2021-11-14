import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/Enemies';
import initAnims from '../anims';
import Collectibles from '../groups/Collectibles';
import Keys from '../groups/Keys';
import Hud from '../hud';
import EventEmitter from '../events/Emitter';
import { setOrigin } from 'phaser/src/gameobjects/components/Origin';

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
		const enemies = this.createEnemies(layers.enemySpawns, layers.colliders);
		const collectibles = this.createCollectables(layers.collectibles);
		const key = layers.key != null ? this.createKey(layers.key) : null;

		this.createBG();

		this.createEnemyColliders(enemies, {
			colliders: {
				platformsColliders: layers.colliders,
				player,
			},
		});

		this.createPlayerColliders(player, {
			colliders: {
				platformsColliders: layers.colliders,
				obstacleCollider: layers.obstacleCollider,
				projectiles: enemies.getProjectiles(),
				collectibles,
				key,
				traps: layers.traps,
				meleeWeapons: enemies.getMeleeWeapons(),
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
	}

	createMap() {
		const map = this.make.tilemap({ key: `level-${this.getCurrentLevel()}` });
		map.addTilesetImage('nhu_tileset', 'tiles-1');
		return map;
	}

	createLayers(map) {
		const tileset1 = map.getTileset('nhu_tileset');
		const ropes = map.createLayer('Bg_Ropes', tileset1);
		const traps = map.createLayer('Traps', tileset1);
		const pipes = map.createLayer('Bg_Pipes', tileset1);
		const plants = map.createLayer('Bg_Plants', tileset1);
		const doorBackgrounds = map.createLayer('Bg_Doors', tileset1);
		const doors = map.createLayer('Doors', tileset1);
		const colliders = map.createLayer('Colliders', tileset1);
		const playerZones = map.getObjectLayer('PlayerZones');
		const enemySpawns = map.getObjectLayer('EnemySpawnPoints');
		const platforms = map.createLayer('Platforms', tileset1);
		const collectibles = map.getObjectLayer('Collectibles');

		const obstacleSprite = map.createLayer('ObstacleSprite', tileset1) || null;
		const obstacleCollider = map.createLayer('ObstacleCollider', tileset1) || null;

		const key = map.getObjectLayer('Key') || null;

		colliders.setCollisionByProperty({ collides: true });
		obstacleCollider && obstacleCollider.setCollisionByProperty({ collides: true });
		traps.setCollisionByExclusion(-1);

		return {
			ropes,
			pipes,
			plants,
			doorBackgrounds,
			doors,
			colliders,
			playerZones,
			enemySpawns,
			platforms,
			traps,
			collectibles,
			obstacleCollider,
			obstacleSprite,
			key,
		};
	}

	createBG() {
		this.bg0 = this.add
			.tileSprite(0, 0, this.config.width, this.config.height, 'gameplay-bg-0')
			.setDepth(-30)
			.setOrigin(0)
			.setScale(1.5)
			.setScrollFactor(0, 1);

		this.bg1 = this.add
			.tileSprite(0, 0, this.config.width, this.config.height, 'gameplay-bg-1')
			.setDepth(-29)
			.setOrigin(0, 0)
			.setScale(1.8)
			.setScrollFactor(0, 1);

		this.bg2 = this.add
			.tileSprite(0, 0, this.config.width, this.config.height, 'gameplay-bg-2')
			.setDepth(-28)
			.setOrigin(0, 0)
			.setScale(1.8)
			.setScrollFactor(0, 1);

		this.bg3 = this.add
			.tileSprite(0, 0, this.config.width, this.config.height, 'gameplay-bg-3')
			.setDepth(-27)
			.setOrigin(0, 0)
			.setScale(1.8)
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
		collectibles.playAnimation('batterySpark');
		collectibles.rotate(0.5);

		return collectibles;
	}

	createKey(keyLayer) {
		const key = new Keys(this).setDepth(3);

		key.addFromLayer(keyLayer);

		return key;
	}

	createForegroundDressing(map) {
		const tileset = map.getTileset('main_lev_build_1');
		map.createLayer('Dressing', tileset);
	}

	createPlayer(start) {
		return new Player(this, start.x, start.y);
	}

	createEnemies(spawnLayer, colliders) {
		const enemies = new Enemies(this);
		const enemyTypes = enemies.getTypes();

		spawnLayer.objects.forEach((spawnPoint) => {
			const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
			enemy.setPlatformColliders(colliders);
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

	onKeyPickedUp() {
		console.log('key was Picked up');
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
			.addCollider(colliders.obstacleCollider)
			.addCollider(colliders.projectiles, this.onHit)
			.addOverlap(colliders.collectibles, this.onCollect, this)
			.addOverlap(colliders.key, this.onKeyPickedUp, this)
			.addCollider(colliders.traps, this.onHit)
			.addOverlap(colliders.meleeWeapons, this.onHit);
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
			.setSize(5, 25)
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
		//this.spikesImage.tilePositionX = this.cameras.main.scrollX * 0.3;
		this.bg1.tilePositionX = this.cameras.main.scrollX * 0.05;
		this.bg2.tilePositionX = this.cameras.main.scrollX * 0.2;
		this.bg3.tilePositionX = this.cameras.main.scrollX * 0.3;
		//this.bg4.tilePositionX = this.cameras.main.scrollX * 0.05;
	}
}

export default Play;
