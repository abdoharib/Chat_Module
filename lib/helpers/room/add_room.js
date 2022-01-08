const Pipeline = require('../../Middleware/index');
//get rooms query
const { GetRooms, InsertRoom } = require("../../query/room/index");
const { InsertUser } = require("../../query/user/index");

const Room = require('../../query/room/models/room--Default');

module.exports = Pipeline(
  //add a new room
  async (ctx) => {
    //add a room
    let _added_room = await InsertRoom({});

    ctx.room = _added_room;
  },

  //if user are provider then add them
  async (ctx) => {
      
    let { room, users } = ctx;

    if (users) {
      for (const { id, type = "" } of users) {
        await InsertUser({ roomID: room.id, id, type });
      }
    }
  }
);


