const Pipeline = require("../../Middleware/index");
//get rooms query
const { GetMessages } = require("../../query/message/index");

module.exports = Pipeline(
  // Takes A Filter and Preforms Query from DB
  async (ctx) => {
    let { Filter } = ctx;

    const FilterResolver = {
      ByRoom: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " byRoom > id filter must be a string";
          let msgs = await GetMessages([{ name: "roomID", value: id }]);
          return msgs;
        },
      },
      ByUser: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " ByUser > id filter must be a string";
          let msgs = await GetMessages([{ name: "userID", value: id }]);
          return msgs;
        },
      },
    };

    if (!Filter || Filter == {}) return await GetMessages();
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
