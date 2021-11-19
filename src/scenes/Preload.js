import Phaser from 'phaser';

class Preload extends Phaser.Scene {
	constructor() {
		super('PreloadScene');
	}

	preload() {
		this.load.tilemapTiledJSON('level-1', 'assets/v2/lv_1.json');
		this.load.tilemapTiledJSON('level-2', 'assets/v2/lv_2.json');
		this.load.tilemapTiledJSON('level-3', 'assets/v2/lv_3.json');
		this.load.tilemapTiledJSON('level-4', 'assets/v2/lv_4.json');

		this.load.image('tiles-1', 'assets/v2/nhu_tileset.png');

		this.load.image('logo', 'assets/v2/logo.png');
		this.load.image('menuBg', 'assets/v2/bgMenu.png');

		this.load.image('sky', 'assets/sky_play.png');
		this.load.image('bg-spikes-dark', 'assets/bg_spikes_dark.png');
		this.load.image('gameplay-bg-0', 'assets/v2/bg/bg_layer 1.png');
		this.load.image('gameplay-bg-1', 'assets/v2/bg/bg_layer 2.png');
		this.load.image('gameplay-bg-2', 'assets/v2/bg/bg_layer 3.png');
		this.load.image('gameplay-bg-3', 'assets/v2/bg/bg_layer 4.png');
		this.load.image('gameplay-bg-4', 'assets/v2/bg/bg_layer 5.png');

		this.load.image('menu-bg', 'assets/background01.png');
		this.load.image('back', 'assets/back.png');

		this.load.image('iceball-1', 'assets/weapons/iceball_001.png');
		this.load.image('iceball-2', 'assets/weapons/iceball_002.png');

		this.load.image('fireball-1', 'assets/weapons/improved_fireball_001.png');
		this.load.image('fireball-2', 'assets/weapons/improved_fireball_002.png');
		this.load.image('fireball-3', 'assets/weapons/improved_fireball_003.png');

		this.load.image('key', 'assets/v2/nhu_key.png');

		this.load.spritesheet('battery', 'assets/v2/battery.png', {
			frameWidth: 13,
			frameHeight: 24,
		});

		this.load.spritesheet('nhuIdle', 'assets/v2/Nhu_idle.png', {
			frameWidth: 32,
			frameHeight: 29,
		});

		this.load.spritesheet('nhuJump', 'assets/v2/Nhu_jump.png', {
			frameWidth: 32,
			frameHeight: 29,
		});

		this.load.spritesheet('nhuThrow', 'assets/v2/Nhu_attack_ranged.png', {
			frameWidth: 32,
			frameHeight: 29,
		});

		this.load.spritesheet('nhuWalk', 'assets/v2/Nhu_walk.png', {
			frameWidth: 32,
			frameHeight: 29,
		});

		this.load.spritesheet('greenProjectile', 'assets/v2/nhu_projectile.png', {
			frameWidth: 16,
			frameHeight: 16,
			spacing: 4,
		});

		this.load.spritesheet('playerSlide', 'assets/player/slide_sheet_2.png', {
			frameWidth: 32,
			frameHeight: 38,
			spacing: 32,
		});

		this.load.spritesheet('birdman', 'assets/v2/bad_guy_1_walk.png', {
			frameWidth: 15,
			frameHeight: 32,
		});

		this.load.spritesheet('gunner', 'assets/v2/bad_guy_2_walk.png', {
			frameWidth: 24,
			frameHeight: 25,
		});

		this.load.spritesheet('blaster', 'assets/v2/bad_guy_2_shoot.png', {
			frameWidth: 57,
			frameHeight: 25,
		});

		this.load.spritesheet('hitSheet', 'assets/weapons/hit_effect_sheet.png', {
			frameWidth: 32,
			frameHeight: 32,
		});

		this.load.spritesheet('swordDefault', 'assets/v2/Nhu_attack_close.png', {
			frameWidth: 76,
			frameHeight: 31,
		});

		this.load.audio('theme', 'assets/music/theme_music.wav');
		this.load.audio('projectile-launch', 'assets/music/projectile_launch.wav');
		this.load.audio('step', 'assets/music/step_mud.wav');
		this.load.audio('jump', 'assets/music/jump.wav');
		this.load.audio('swipe', 'assets/music/swipe.wav');
		this.load.audio('collectiblePickup', 'assets/music/coin_pickup.wav');

		const prod = process.env.FB_ENV || process.env.NODE_ENV === 'production';

		this.load.on('progress', (value) => {
			prod && FBInstant.setLoadingProgress(value * 100);
		});

		this.load.once('complete', () => {
			if (prod) {
				FBInstant.startGameAsync().then(() => {
					this.startGame();
				});
			} else {
				this.startGame();
			}
		});
	}

	startGame() {
		this.registry.set('level', 1);
		this.registry.set('unlocked-levels', 1);

		this.scene.start('PlayScene');
	}
}

export default Preload;
