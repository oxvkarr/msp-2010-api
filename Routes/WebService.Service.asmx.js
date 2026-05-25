const service = require("./Service.js");

exports.data = {
	Name: "WebService/Service.asmx",
	Method: "POST"
};

exports.run = service.run;
