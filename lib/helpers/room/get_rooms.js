const Pipeline = require('../../Middleware/index');
//get rooms query
const { GetRooms } = require('../../query/room/index');
const { GetUsers } = require('../../query/user/index');

const Room = require('../../query/room/models/room--Default');

module.exports = Pipeline(
    
	//check if MemberOfRoom rule applies and run
	async (ctx) => {
		const RuleName = 'MemberOfRoom';

		let { userID, roomID, rules, type } = ctx;
		if (rules.indexOf(RuleName) >= 0) {
			console.log('Checking 🤔 ...');

			if (typeof userID !== 'string') throw 'Invalid userID Value, Must be A String';
			let users = await GetUsers([
				{ name: 'id', value: userID },
				...(roomID && { name: 'roomID', value: roomID })
			]);
			ctx.rooms = Array.isArray(users) ? [ ...new Set(users.map((user) => user.roomID)) ] : null;
		} else {
			if ((userID && typeof userID == 'string') ) {
				let users = await GetUsers([
					...(userID && { name: 'userID', value: userID }),
				]);
				ctx.rooms = Array.isArray(users) ? [ ...new Set(users.map((user) => user.roomID)) ] : null;
			} else {
				ctx.rooms = null;
			}
		}
	},

	async (ctx) => {

		let { rooms, roomID } = ctx;
		if (rooms) {

           let RequestedRooms = await GetRooms(rooms.map(id =>({name:"id", value : id }) ))

           return RequestedRooms
		}
        //console.log("asfsafas");
        // return every room
        
		return await GetRooms( roomID && [{ name: 'id', value: roomID }] )
	}
);
