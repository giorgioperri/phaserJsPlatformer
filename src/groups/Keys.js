import 'phaser';
import Key from '../collectibles/key';

export default class Keys extends Phaser.Physics.Arcade.StaticGroup {
	constructor(scene) {
		super(scene.physics.world, scene);

		this.createFromConfig({
			classType: Key,
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
		const { type } = this.mapProperties(layer.properties);

		layer.objects.forEach((collectibleObject) => {
			const key = this.get(collectibleObject.x, collectibleObject.y, type);
		});
	}
}
