require("dotenv").config();

const path = require("path");
const fs = require("fs");
const { connect, disconnect } = require("mongoose");
const {
	clothModel,
	eyeModel,
	noseModel,
	mouthModel,
	collectionIdModel
} = require("../Utils/Schemas.js");

const seedDir = path.join(__dirname, "..", "seed", "msp2010");

const readJson = name => {
	const file = path.join(seedDir, `${name}.json`);
	return JSON.parse(fs.readFileSync(file, "utf8"));
};

const run = async () => {
	const uri = process.env.CUSTOMCONNSTR_URIMongoDB;
	if (!uri) {
		console.error("Missing CUSTOMCONNSTR_URIMongoDB.");
		process.exit(1);
	}

	await connect(uri);

	const collections = [
		[clothModel, "clothes"],
		[eyeModel, "eyes"],
		[noseModel, "noses"],
		[mouthModel, "mouths"]
	];

	for (const [model, name] of collections) {
		const docs = readJson(name);
		await model.deleteMany({});
		if (docs.length) await model.insertMany(docs);
		console.log(`[seed:msp2010] ${name}: ${docs.length}`);
	}

	const ids = readJson("ids");
	for (const item of ids) {
		await collectionIdModel.updateOne(
			{ _id: item._id },
			{ $set: { sequence_value: item.sequence_value } },
			{ upsert: true }
		);
	}
	console.log(`[seed:msp2010] ids: ${ids.length}`);

	await disconnect();
};

run().catch(async err => {
	console.error(err.stack || err.message);
	await disconnect().catch(() => {});
	process.exitCode = 1;
});
