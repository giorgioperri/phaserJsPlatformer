import BaseScene from './BaseScene';

class LevelScene extends BaseScene {
	constructor(config) {
		super('LevelScene', { ...config, canGoBack: true });
	}

	create() {
		super.create();

		this.menu = [];
		const levels = this.registry.get('unlocked-levels');

		for (let i = 1; i <= levels; i++) {
			this.menu.push({ scene: 'PlayScene', text: `Level ${i}`, level: i });
		}

		this.createMenu(this.menu, this.setupMenuEvents.bind(this));
		this.add.image(this.config.width / 2, this.config.height / 3, 'logo').setScale(0.6);
	}

	setupMenuEvents(menuItem) {
		const textGO = menuItem.textGO;
		textGO.setInteractive();

		textGO.on('pointerover', () => {
			textGO.setStyle({ fill: '#ff003b' });
		});
		textGO.on('pointerout', () => {
			textGO.setStyle({ fill: '#ffffff' });
		});
		textGO.on('pointerup', () => {
			if (menuItem.scene) {
				this.registry.set('level', menuItem.level);
				this.scene.start(menuItem.scene);
			}

			menuItem.text === 'Exit' ? this.game.destroy(true) : null;
		});
	}
}

export default LevelScene;
