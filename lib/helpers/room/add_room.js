const Pipeline = require('../../Middleware/index');
//get rooms query
const { GetRooms, InsertRoom } = require("../../query/room/index");
const { InsertUser } = require("../../query/user/index");

const Room = require('../../query/room/models/room--Default');

module.exports = Pipeline(


  //add a new room
  async (ctx) => {
    //add a room
    let _added_room = await InsertRoom(ctx);

    ctx.room = _added_room;
  },


////////////////////////////////////////


  //if users are provided then add them
  async (ctx) => {
      
    let { room, users } = ctx;
    // users = [ { id, type } ... ]

    let _added_users = []
    if (users) {
      for (const { id, type = "" } of users) {
        let _user = await InsertUser({ roomID: room.id, id, type });
        _added_users.push(_user)
      }
    }
    
    return { ...room, users: _added_users }

  }


);


