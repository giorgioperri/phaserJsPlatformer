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
	}

	setupMenuEvents(menuItem) {
		const textGO = menuItem.textGO;
		textGO.setInteractive();

		textGO.on('pointerover', () => {
			textGO.setStyle({ fill: '#fff' });
		});
		textGO.on('pointerout', () => {
			textGO.setStyle({ fill: '#000' });
		});
		textGO.on('pointerup', () => {
			menuItem.scene && this.scene.start(menuItem.scene);
			menuItem.text === 'Exit' ? this.game.destroy(true) : null;
		});
	}
}

export default MenuScene;
