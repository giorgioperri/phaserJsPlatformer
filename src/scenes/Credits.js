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
	}
}

export default CreditsScene;
