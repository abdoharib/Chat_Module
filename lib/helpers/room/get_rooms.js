const Pipeline = require("../../Middleware/index");
//get rooms query
const { GetRooms } = require("../../query/room/index");
const { GetUsers } = require("../../query/user/index");

module.exports = Pipeline(
  // Takes A Filter and Preforms Query from DB
  async (ctx) => {
    let { Filter } = ctx;

    const FilterResolver = {
      ByRoom: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " byRoom > id filter must be a string";
          let rooms = await GetRooms([{ name: "id", value: id }]);
          return rooms;
        },
      },
      ByUser: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " ByUser > id filter must be a string";
          let users = await GetUsers([{ name: "id", value: id }]);
          let roomids = [...new Set(users.map(({ roomID }) => roomID))];
		  if (!roomids.length) throw "No Users Exsit with This ID";
	
          let rooms = await GetRooms(
            roomids.map((id) => ({ name: "id", value: id }))
          );
          return rooms;
        },
      },
    };

    if (!Filter || Filter == {}) return await GetRooms();
    // let QuredRooms = [];
    for (let filterBy of Object.keys(Filter)) {
      for (let filterName of Object.keys(Filter[filterBy])) {
       
        let FilerResponse;
        if (FilterResolver[filterBy][filterName]) {

          FilerResponse = await FilterResolver[filterBy][filterName](
            Filter[filterBy][filterName]
          );
        }
        //console.log(FilerResponse);
        if (FilerResponse) return FilerResponse;
      }
    }
  }
);
