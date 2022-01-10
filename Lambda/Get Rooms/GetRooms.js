const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const Get_Rooms = require("../../lib/helpers/room/get_rooms");
const { GetUsers } = require("../../lib/query/user/index");
const { GetRooms } = require("../../lib/query/room/index");

// For Testing
const type = "admin";

// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function GetRooms_config_haneler() {
  if (Object.keys(config).length) {
    let { Auth } = config;
    if (!Auth) throw "Invalid GetRooms Config file Format !!";

    for (const RuleName in Auth) {
      if (Auth[RuleName].type.indexOf(type) >= 0) {
        return Auth[RuleName].rules;
      }
    }
    throw "You Shall Not Pass  ✋🛑";
  }
}

// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//get Room pipeline
const { push, execute } = Pipeline(
  //check if MemberOfRoom rule applies and run
  async (ctx) => {
    return await Get_Rooms.execute(ctx);
  }
);

exports.handler = async (event) => {
  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  // Running the Authorization
  try {
    let AuthResponse = await Authorization(event);
  } catch (e) {
    return {
      statusCode: 401,
      body: {},
      message: "Unauthorized",
    };
  }

  try {
    // dont touch this pls
    // (︡❛ ͜ʖ❛︠)💨
    const rules = GetRooms_config_haneler();

    let GetRoomsResponse = await execute({ ...event, rules, type });
    console.log(GetRoomsResponse);

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
      statusCode: 200,
      body: GetRoomsResponse ? GetRoomsResponse : {},
      message: "Here is Your Rooms  👌",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: {},
      message: error,
    };
  }
};

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//                        ( ͡❛ ͜ʖ ͡❛)   // SAFE REGION //   ( ͡❛ ͜ʖ ͡❛)                     //
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//to add a Middleware to the AddMsg Pipeline uncomment the code below & pls read the goddamn comments !!
/*
AddMsg.push(

    //this function gets executed before adding a msg 
    // the ctx paramater is an object that Has accaess to the parameter of Addmsg.execute( { ... } );
    // ctx = { userID:"", roomID:"", content:"", type:"" ...  }

    async (ctx) => {
        
        What Ever you Want, What Ever you Need

        ¯\_( ͡❛ ͜ʖ ͡❛)_/¯

    },
    ... 
    
    //notes
    // - all the functions above get executed in the same order as you put them in.
)
*/

//to add a Middleware to the this lambda Pipeline uncomment the code below & pls read the goddamn comments !!
/*
push(

    //this function gets executed after adding a msg to db & before sending the msg to the users 
    // the ctx paramater is an object that Has accaess to the parameter of execute( { ... } );
    // ctx = { userID:"", roomID:"", content:"", type:"" ...  }

    async (ctx) => {
        
        What Ever you Want, What Ever you Need

        ¯\_( ͡❛ ͜ʖ ͡❛)_/¯

    },
    ... 
    
    //notes
    // - all the functions above get executed in the same order as you put them in.
)
*/

// In this Function you Write your way of Verfing Tokens // if you have one
// if user is verfied return any truty variable
// if user is unAuthorized then just throw an error
const Authorization = async (event) => {
  //returns or throws error
  //throw "safasf"
  //return {
  //}
};

push(
	
  //check if MemberOfRoom rule applies and run
  async (ctx) => {
    const RuleName = "MemberOfRoom";
    let { Filter, rules, type, userID } = ctx;

    const FilterRule = {
      ByRoom: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " byRoom > id filter must be a string";
          let users = await GetUsers([{ name: "roomID", value: id }]);
          if (users.map(({ id }) => id).indexOf(userID) < 0)
            throw "You Shall Not Pass  ✋🛑";
        },
      },
      ByUser: {
        id: async (id) => {
          if (!id && typeof id !== "string")
            throw " ByUser > id filter must be a string";
          if (id !== userID) throw "You Shall Not Pass  ✋🛑";
        },
      },
    };

    if (rules.indexOf(RuleName) >= 0) {
      console.log("Checking 🤔 ...");

      Object.keys(Filter).map((filterBy) => {
        Object.keys(filterBy).map((filteName) => {
          FilterRule[filterBy][filteName] && FilterRule[filterBy][filteName](Filter[filterBy][filteName]);
        });
      });
    }
  },

);
