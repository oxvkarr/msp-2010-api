const {
	eyeModel,
	noseModel,
	mouthModel,
	clothModel
} = require("../Utils/Schemas.js");
const { buildXML } = require("../Utils/XML.js");
const seedEyes = require("../seed/msp2010/eyes.json");
const seedNoses = require("../seed/msp2010/noses.json");
const seedMouths = require("../seed/msp2010/mouths.json");
const seedClothes = require("../seed/msp2010/clothes.json");
const { connection } = require("mongoose");
const { basename } = require("path");

const swfFileName = clothe =>
	basename(String(clothe.Filename || clothe.SWF || ""), ".swf").replace(
		/\s*\([^)]*\)\s*$/,
		""
	);

const swfClassName = clothe => {
	const base = swfFileName(clothe);
	const aliases = {
		top_2_Honey: "top2_Honey",
		top_3_Honey: "top3_Honey",
		top_4_Honey: "Top4",
		Honey_bottoms_10: "Honey_Female_bottoms_10",
		Honey_bottoms_9: "Honey_Female_bottoms_9"
	};
	return aliases[base] || base;
};

const rel = (id, colors = "", cloth = null) => ({
	ActorClothesRelId: id,
	_ActorClothesRelId: id,
	ClothesId: id,
	_ClothesId: id,
	Color: colors,
	_Color: colors,
	IsWearing: true,
	_IsWearing: true,
	x: 0,
	_x: 0,
	y: 0,
	_y: 0,
	...(cloth ? { Cloth: cloth, _Cloth: cloth } : {})
});

const actor = (gender, skinSwf, skinColor, eyeId, noseId, mouthId, eyeColors, mouthColors, rels) => ({
	ActorId: 0,
	_ActorId: 0,
	Name: "",
	_Name: "",
	Gender: gender,
	_Gender: gender,
	SkinSWF: skinSwf,
	_SkinSWF: skinSwf,
	SkinColor: skinColor,
	_SkinColor: skinColor,
	EyeId: eyeId,
	_EyeId: eyeId,
	NoseId: noseId,
	_NoseId: noseId,
	MouthId: mouthId,
	_MouthId: mouthId,
	EyeColors: eyeColors,
	_EyeColors: eyeColors,
	MouthColors: mouthColors,
	_MouthColors: mouthColors,
	ActorClothesRels: { ActorClothesRel: rels },
	_ActorClothesRels: { ActorClothesRel: rels }
});

exports.data = {
	SOAPAction: "LoadDataForRegisterNewUser",
	needTicket: false,
	levelModerator: 0
};

exports.run = async () => {
	// SkinId 0 > Girl & Boy
	// SkinId 1 > Girl
	// SkinId 2 > Boy

	let eyes = [];
	let noses = [];
	let mouths = [];
	let clothes = [];

	if (connection.readyState === 1) try {
		eyes = await eyeModel.aggregate([
			{
				$facet: {
					eyesGirl: [{ $match: { SkinId: 1 } }, { $sample: { size: 3 } }],
					eyesBoy: [{ $match: { SkinId: 2 } }, { $sample: { size: 3 } }]
				}
			},
			{
				$project: {
					combined: { $concatArrays: ["$eyesGirl", "$eyesBoy"] }
				}
			},
			{ $unwind: "$combined" },
			{ $replaceRoot: { newRoot: "$combined" } }
		]);

		noses = await noseModel.aggregate([
			{
				$facet: {
					nosesGirl: [
						{ $match: { SkinId: 1 } },
						{ $sample: { size: 3 } }
					],
					nosesBoy: [{ $match: { SkinId: 2 } }, { $sample: { size: 3 } }]
				}
			},
			{
				$project: {
					combined: { $concatArrays: ["$nosesGirl", "$nosesBoy"] }
				}
			},
			{ $unwind: "$combined" },
			{ $replaceRoot: { newRoot: "$combined" } }
		]);

		mouths = await mouthModel.aggregate([
			{
				$facet: {
					mouthsGirl: [
						{ $match: { SkinId: 1 } },
						{ $sample: { size: 3 } }
					],
					mouthsBoy: [{ $match: { SkinId: 2 } }, { $sample: { size: 3 } }]
				}
			},
			{
				$project: {
					combined: { $concatArrays: ["$mouthsGirl", "$mouthsBoy"] }
				}
			},
			{ $unwind: "$combined" },
			{ $replaceRoot: { newRoot: "$combined" } }
		]);

		clothes = await clothModel.find({ RegNewUser: 1 });
	} catch (error) {
		console.error("[LoadDataForRegisterNewUser] Mongo lookup failed, using seed data");
		console.error(error);
	}

	if (!eyes.length) eyes = seedEyes;
	if (!noses.length) noses = seedNoses;
	if (!mouths.length) mouths = seedMouths;
	if (!clothes.length) clothes = seedClothes;

	const eyesArr = eyes.map(eye => ({
		EyeId: eye.EyeId,
		Name: eye.Name,
		SWF: eye.SWF,
		SkinId: eye.SkinId
	}));
	const nosesArr = noses.map(nose => ({
		NoseId: nose.NoseId,
		Name: nose.Name,
		SWF: nose.SWF,
		SkinId: nose.SkinId
	}));
	const mouthsArr = mouths.map(mouth => ({
		MouthId: mouth.MouthId,
		Name: mouth.Name,
		SWF: mouth.SWF,
		SkinId: mouth.SkinId
	}));
	const clothesArr = clothes.map(clothe => {
		const className = swfClassName(clothe);
		const fileName = swfFileName(clothe);
		const filename = clothe.Filename || `${fileName}.swf`;
		const fullPath = `${clothe.SWF}/${filename}`;
		return ({
			ClothesId: clothe.ClothesId,
			ClothId: clothe.ClothesId,
			Id: clothe.ClothesId,
			Name: clothe.Name,
			SWF: clothe.SWF,
			_SWF: clothe.SWF,
			ClassName: className,
			_ClassName: className,
			ClothesCategoryId: clothe.ClothesCategoryId,
			_ClothesCategoryId: clothe.ClothesCategoryId,
			Price: clothe.Price,
			ShopId: clothe.ShopId,
			SkinId: clothe.SkinId,
			_SkinId: clothe.SkinId,
			Filename: filename,
			_Filename: filename,
			FileBase: fileName,
			_FileBase: fileName,
			Path: fullPath,
			_Path: fullPath,
			Url: fullPath,
			_Url: fullPath,
			Scale: clothe.Scale,
			Vip: clothe.Vip,
			RegNewUser: clothe.RegNewUser,
			_RegNewUser: clothe.RegNewUser,
			sortorder: clothe.Sortorder,
			Sortorder: clothe.Sortorder,
			New: clothe.New,
			Discount: clothe.Discount,
			Color: clothe.ColorScheme || "",
			_Color: clothe.ColorScheme || "",
			ColorScheme: clothe.ColorScheme || "",
			_ColorScheme: clothe.ColorScheme || "",
			DefaultColors: clothe.ColorScheme || "",
			ClothesCategory: {
				ClothesCategoryId: clothe.ClothesCategoryId,
				Name: clothe.ClothesCategoryName,
				SlotTypeId: clothe.SlotTypeId,
				SlotType: {
					SlotTypeId: clothe.SlotTypeId,
					Name: clothe.ClothesCategoryName
				}
			}
		});
	});
	return buildXML("LoadDataForRegisterNewUser", {
		eyes: {
			Eye: eyesArr
		},
		noses: {
			Nose: nosesArr
		},
		mouths: {
			Mouth: mouthsArr
		},
		clothes: {
			Cloth: clothesArr
		}
	});
};
