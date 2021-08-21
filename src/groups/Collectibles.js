import 'phaser';
import Collectible from '../collectibles/collectible';

export default class Collectibles extends Phaser.Physics.Arcade.StaticGroup {
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createFromConfig({
			classType: Collectible,
		});
	}

	mapProperties(propertiesList) {
		if (!propertiesList || propertiesList.length === 0) {
			return {};
		}

		return propertiesList.reduce((map, obj) => {
			map[obj.name] = obj.value;
			return map;
		}, {});
	}

	addFromLayer(layer) {
		const { score: defaultScore, type } = this.mapProperties(layer.properties);

		layer.objects.forEach((collectibleObject) => {
			const collectible = this.get(collectibleObject.x, collectibleObject.y, type);

			const objectProperties = this.mapProperties(collectibleObject.properties);

			collectible.score = objectProperties.score || defaultScore;
		});
	}
}
