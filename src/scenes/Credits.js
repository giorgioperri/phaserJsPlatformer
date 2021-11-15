import BaseScene from './BaseScene';

class CreditsScene extends BaseScene {
	constructor(config) {
		super('CreditsScene', { ...config, canGoBack: true });

		this.menu = [
			{ scene: null, text: 'Thank     you     for     playing     this     demo'.toUpperCase() },
			{ scene: null, text: 'Made     with     Tons     of     fun'.toUpperCase() },
			{ scene: null, text: 'by     Giorgio     Perri'.toUpperCase() },
		];
	}

	create() {
		super.create();
		this.createMenu(this.menu, () => {});
		this.add.image(this.config.width / 2, this.config.height / 3, 'logo').setScale(0.6);
	}
}

export default CreditsScene;
