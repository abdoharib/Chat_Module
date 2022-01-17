const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const { AddUserConnectionIDs } = require("../../lib/query/connections/index")
const { GetUsers } = require("../../lib/query/user/index")

const axios = require("axios").default
axios.defaults.baseURL = 'http://c1c5-102-221-8-18.ngrok.io';





// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function AddConnection_config_haneler(event){
    let {type} = event
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

      //insert connection into the db
      async (ctx) => {
        let { ConnectionsIDs } = ctx
       // console.log(ctx)
          let Added_Connection = await AddUserConnectionIDs( {...ctx, /*Note Remove this*/ ConnectionsIDs} )
          return Added_Connection;
      }


);


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
exports.handler = async (event) => {
  let { queryStringParameters } = event
  if(queryStringParameters){ queryStringParameters = {...event, ...queryStringParameters }; event=queryStringParameters };
  event["ConnectionsIDs"] = event.requestContext.connectionId
  console.log(event)

  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  // Running the Authorization
  try {
    let AuthResponse = await _Authorization(event)
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
    const rules = AddConnection_config_haneler(event);

    let AddConnectionResponse = await execute({ ...event, rules, /*Dont forget to remove type in prod*/ });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    console.log(AddConnectionResponse)
    return {
        statusCode: 200,
        body: AddConnectionResponse ? JSON.stringify(AddConnectionResponse) : JSON.stringify("Connection Added"),
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
            if(!users.length) throw "You Shall Not Pass || User Not Found in the Room";
    
            ctx.type = users[0].type
        }else{
            //do nothing
            ctx.userID = type || "admin"
        }     
    }
)

const _Authorization = async (event) => {
  
  let { Authorization } = event

  const RoleToTypeMapping = {
    customer: "user",
    "sub_admin": "admin",
    "admin": "admin"
  }

console.log(Buffer.from( Authorization, "base64" ).toString())
    let auth_response = await axios.get("/api/auth/me", {
      headers: {
        "Authorization": "Bearer "+ Buffer.from( Authorization, "base64" ).toString()
      } 
    }).catch(e => {
      //console.log(e);
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

}

