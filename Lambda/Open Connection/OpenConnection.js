const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const { AddUserConnectionIDs } = require("../../lib/query/connections/index")
const axios = require("axios").default

const type = "admin"

// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function AddConnection_config_haneler(){
    if(Object.keys(config).length){
        let { Auth } = config
        if(!Auth) throw "Invalid AddMessage Config file Format !!";
        
        for (const RuleName in Auth) {
            if(Auth[RuleName].type.indexOf(type) >= 0){
                return Auth[RuleName].rules;
            }
        }
        throw "You Shall Not Pass  ✋🛑"
    }
  }


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//add connection pipeline
const { push, execute } = Pipeline(

  
  // 1
  // adding the room to dynamo
  async (ctx) => {

    let room_added = await AddRoom.execute( ctx )

    return room_added;
  },

  

);


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
exports.handler = async (event) => {

  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  // Running the Authorization
  try {
    let AuthResponse = await Authorization(event)
  } catch (e) {
    return {
      statusCode: 401,
      body: {} ,
      message: "Unauthorized",
    }
  }

  try {

    // dont touch this pls 
    // (︡❛ ͜ʖ❛︠)💨
    const rules = AddConnection_config_haneler();

    let AddConnectionResponse = await execute({ ...event, rules, /*Dont forget to remove type in prod*/type });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
        statusCode: 200,
        body: AddConnectionResponse ? AddConnectionResponse : {} ,
        message: "Connection Added",
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


//adding function
push(
    
    // check if you are a Member of the room
    async (ctx) => {
        const RuleName = "MemberOfRoom"

        let { userID, roomID, type, rules } = ctx;

       // console.log(rules);

        if(rules.indexOf(RuleName) >= 0 ){
            console.log("MemberOfRoom Rule is Applied");

         //   console.log("checking");
            if(typeof userID !== "string") throw "Invalid userID Value, Must be A String";

            let users = await GetUsers([ { name:"id", value:userID }, {name:"roomID", value:roomID} ])
          //  console.log(users);
            if(!users.length) throw "User Not Found in the Room";
    
            ctx.type = users[0].type
        }else{
            //do nothing
            ctx.userID = type || "admin"
        }     
    },

    //insert connection into the db
    async (ctx) => {
        let Added_Connection = await AddUserConnectionIDs( {...ctx, /*Note Remove this*/ ConnectionsIDs:"sfafsafdsafdasfasfafa464684864"} )
        return Added_Connection;
    }
)

const Authorization = async( event ) =>{

  //returns or throws error
  //throw "safasf"
  //event = {
 //   ...event,
  //}
}

