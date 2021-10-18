export default (anims) => {
	anims.create({
		key: 'hitEffect',
		frames: anims.generateFrameNumbers('hitSheet', { start: 0, end: 4 }),
		frameRate: 10,
		repeat: 0,
	});

	anims.create({
		key: 'swordDefaultSwing',
		frames: anims.generateFrameNumbers('swordDefault', { start: 0, end: 2 }),
		frameRate: 10,
		repeat: 0,
	});

	anims.create({
		key: 'blasterSwing',
		frames: anims.generateFrameNumbers('blaster', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: 0,
	});

	anims.create({
		key: 'greenProjectile',
		frames: anims.generateFrameNumbers('greenProjectile', { start: 0, end: 4 }),
		frameRate: 8,
		repeat: -1,
	});

	anims.create({
		key: 'fireball',
		frames: [{ key: 'fireball-1' }, { key: 'fireball-2' }, { key: 'fireball-3' }],
		frameRate: 5,
		repeat: -1,
	});

	anims.create({
		key: 'iceball',
		frames: [{ key: 'iceball-1' }, { key: 'iceball-2' }],
		frameRate: 5,
		repeat: -1,
	});

	anims.create({
		key: 'batterySpark',
		frames: anims.generateFrameNumbers('battery', { start: 0, end: 4 }),
		frameRate: 8,
		repeat: -1,
	});
};
