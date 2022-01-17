const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const Update_Room = require("../../lib/helpers/room/update_room");
const { GetUsers } = require("../../lib/query/user/index");
const { GetRooms } = require("../../lib/query/room/index");
const axios = require("axios").default
axios.defaults.baseURL = 'http://c1c5-102-221-8-18.ngrok.io';




// For Testing

// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function UpdateRooms_config_haneler(event) {
  let { type } = event
  if (Object.keys(config).length) {
    let { Auth } = config;
    if (!Auth) throw "Invalid UpdateRooms Config file Format !!";

    for (const RuleName in Auth) {
      if (Auth[RuleName].type.indexOf(type) >= 0) {
        return Auth[RuleName].rules;
      }
    }
    throw "You Shall Not Pass  ✋🛑";
  }
}

// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//Update Room pipeline
const { push, execute } = Pipeline(
  //check if MemberOfRoom rule applies and run
  async (ctx) => {
    ctx.rooms = await Update_Room.execute(ctx);
  }

);

exports.handler = async (event) => {
  
  let { body } = event
  let { headers:{ Authorization }} = event
  if(body){  body = {...body, Authorization  }; event = body; }
  
  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  // Running the Authorization
  try {
    let AuthResponse = await _Authorization(event);
  } catch (e) {
    console.log(e);
    return {
      statusCode: 401,
      body: {},
      message: e,
    };
  }

  try {
    // dont touch this pls
    // (︡❛ ͜ʖ❛︠)💨
    const rules = UpdateRooms_config_haneler(event);

    let UpdateRoomsResponse = await execute({ ...event, rules });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
      statusCode: 200,
      body: UpdateRoomsResponse ? UpdateRoomsResponse : {},
      message: "Room Updated 👌",
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
const _Authorization = async (event) => {
  /*
let {Authorization}= event
console.log(Authorization);
  const RoleToTypeMapping = {
    customer: "user",
    "sub_admin": "admin",
    "admin": "admin"
  }


    let auth_response = await axios.get("/api/auth/me", {
      headers: {
        "Authorization": Authorization
      }
    }).catch(e => {
      console.log(e);
      throw "UnAuthorized 💩"
    })


  try {
    let _user_info = auth_response.data
    let { id, roles } = _user_info

    //if (!_user_info || !id || !roles || !roles.length || !roles.length < 1 || !roles[0].name || typeof !roles[0].name !== "string") throw "Error in Authorization  💩"
    let _role_name = roles[0].name

    let _type = RoleToTypeMapping[_role_name];
    // if (!_type) throw "Error in Authorization  💩"

    event.userID = id
    event.type = _type

  } catch (e) {
   // console.log(e);
  throw "Error in Authorization  💩" 
  }




  //returns or throws error
  //throw "safasf"
  //return {

  //}*/
  event.type = "admin"
}


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
