import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
	constructor(config) {
		super('MenuScene', config);

		this.menu = [
			{ scene: 'PlayScene', text: 'PLAY' },
			{ scene: 'LevelScene', text: 'LEVELS' },
			{ scene: null, text: 'EXIT' },
		];
	}

	create() {
		super.create();

		this.createMenu(this.menu, this.setupMenuEvents.bind(this));
		this.add.image(this.config.width / 2, this.config.height / 3, 'logo').setScale(0.6);
	}

	setupMenuEvents(menuItem) {
		const textGO = menuItem.textGO;
		textGO.setInteractive();

		textGO.on('pointerover', () => {
			textGO.setStyle({ fill: '#a1ffa5' });
		});
		textGO.on('pointerout', () => {
			textGO.setStyle({ fill: '#ffffff' });
		});
		textGO.on('pointerup', () => {
			menuItem.scene && this.scene.start(menuItem.scene);
			menuItem.text === 'Exit' ? this.game.destroy(true) : null;
		});
	}
}

export default MenuScene;
