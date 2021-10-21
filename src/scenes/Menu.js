import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
	constructor(config) {
		super('MenuScene', config);

		this.menu = [
			{ scene: 'PlayScene', text: 'Play' },
			{ scene: 'LevelScene', text: 'Levels' },
			{ scene: null, text: 'Exit' },
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
			textGO.setStyle({ fill: '#ff003b' });
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
