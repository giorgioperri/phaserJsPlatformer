import BaseScene from './BaseScene';

class CreditsScene extends BaseScene {
	constructor(config) {
		super('CreditsScene', { ...config, canGoBack: true });

		this.menu = [
			{ scene: null, text: 'Thank you for playing!' },
			{ scene: null, text: 'Made with <3 by @giorgioperri' },
		];
	}

	create() {
		super.create();
		this.createMenu(this.menu, () => {});
	}
}

export default CreditsScene;
