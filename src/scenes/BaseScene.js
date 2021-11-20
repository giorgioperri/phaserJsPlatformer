import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
	constructor(key, config) {
		super(key);
		this.config = config;
	}

	create() {
		this.add.image(0, 0, 'menuBg').setOrigin(0).setScale(3.8);

		const backButton = this.config.canGoBack
			? this.add
					.image(this.config.width - 10, this.config.height - 10, 'back')
					.setOrigin(1)
					.setScale(2)
					.setInteractive()
			: null;

		backButton &&
			backButton.on('pointerup', () => {
				this.scene.start('MenuScene');
			});
	}

	createMenu(menu, setupMenuEvents) {
		let lastMenuPositionOffset = 0;

		menu.forEach((menuItem) => {
			const menuPosition = [
				this.config.width / 2,
				this.config.height / 1.4 + lastMenuPositionOffset,
			];
			menuItem.textGO = this.add
				.text(...menuPosition, menuItem.text, {
					fontFamily: 'NHU',
					fontSize: '10px',
					fill: '#ffffff',
				})
				.setStroke('#1d1d1b', 6)
				.setOrigin(0.5, 1);

			lastMenuPositionOffset += 50;

			setupMenuEvents(menuItem);
		});
	}
}

export default BaseScene;
