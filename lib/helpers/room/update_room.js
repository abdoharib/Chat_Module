const Pipeline = require("../../Middleware/index");
//get rooms query
const { UpdateRoom , GetRooms} = require("../../query/room/index");

module.exports = Pipeline(
  // Takes A Filter and Preforms Query from DB
  async (ctx) => {
    let { Filter, Update } = ctx;
   // console.log(Update);

    const FilterResolver = {
      ByRoom: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " byRoom > id filter must be a string";
            
          let rooms = await GetRooms([{ name: "id", value: id }]);
          if(rooms.length){
            await UpdateRoom([{ name: "id", value: rooms[0].id }, { name: "latestUpdate", value: rooms[0].latestUpdate }],
            Update)
          }else{ throw "No Room  Was Found to Update" }
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
