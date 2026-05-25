const { sign, verify } = require("jsonwebtoken");
// const { createHash } = require("crypto");

exports.generateTicket = (ActorId, password, IP) => {
	/*
	let ticketDate = new Date();
	ticketDate.setHours(ticketDate.getHours() + 24);
	ticketDate = ticketDate.getTime();
	*/

	return sign(
		{ ActorId: ActorId, Password: password, IP: IP },
		getTicketSalt(),
		{ expiresIn: "1d" }
	);

	// return `RETRO,${ActorId},${ticketDate},${calculateSha256(ActorId + ticketDate.toString())}`;
};

exports.validateTicket = ticket => {
	/*
	let ticketSeparated = ticket.split(",");
	
	if (ticketSeparated.length != 4) return false;
	
	const actorId = ticketSeparated[1];
	const dateTime = ticketSeparated[2];
	const ticketHash = ticketSeparated[3];

	if (calculateSha256(actorId + dateTime) !== ticketHash) return false;
	
	if (Date.now() > Number(dateTime)) return false;
	
	return true;
	*/

	try {
		// Token is valid
		const decoded = verify(ticket, getTicketSalt());

		return { isValid: true, data: decoded };
	} catch {
		// Token is invalid
		return { isValid: false, data: null };
	}
};

function getTicketSalt() {
	return (
		process.env.CUSTOMCONNSTR_TicketSalt ||
		process.env.CUSTOMCONNSTR_SaltClient ||
		process.env.CUSTOMCONNSTR_SaltDB ||
		"msp2010-ticket-salt"
	);
}

/*
function calculateSha256(data) {
	let hash = createHash("sha256");
	
	hash.update(data + process.env.CUSTOMCONNSTR_TicketSalt);
	return hash.digest("base64");
}
*/
