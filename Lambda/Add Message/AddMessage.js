const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const AddMsg = require("../../lib/helpers/message/add_msg")
const SendMsg = require("../../lib/helpers/message/send_msg")
const Update_Room = require("../../lib/helpers/room/update_room");
const axios = require("axios").default
axios.defaults.baseURL = 'http://6d68-102-221-8-18.ngrok.io';

// For Testing

// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function AddMessage_config_haneler(event){
  let { type } = event
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
//add message pipeline
const { push, execute } = Pipeline(

  // 1
  // adding the message to dynamo
  async (ctx) => {
    
     ctx.author = {
      id:ctx.userID,
      type:ctx.type || ""
  }
  //return ctx
  
    let msg_added = await AddMsg.execute( ctx )
    ctx.msg = msg_added
    // dont forget to comment this
    //return msg_added;
  },

  // 2
  //sending the msg to the connected users
 
  async (ctx) => {
    let response_send = await SendMsg.execute( ctx )
    ctx.response_send = response_send;
    
  },

  async (ctx) => {

    //s

    console.log(ctx)
    const props = {
      Filter: {
        ByRoom: {
          id: ctx.roomID
        },
      },
      Update:[
        {
          name:"latestUpdate",
          value:new Date().getTime().toString()
        }
      ]
    }
 
    await Update_Room.execute(props);

    await axios.post("/chat/notify",{
      "sender":ctx.userID || "admin",
      "reciver":'1',
      "title":"رسالة جديد : "+ctx.roomID,
      "message":ctx.response_send.content,
      "dataID":"9",
      "type":"chat"
  },
  {
    headers:{
      "x-api-key":"abc0135e-d748-452b-8729-2b16b33bd4f4"
    }
  })

    return ctx.response_send;;
  }


);




exports.handler = async (event,ctx) => {
  
  let { body } = event
  let { headers:{ Authorization }} = event
  if(body){  body = {...body, Authorization  }; event = body; }
  
  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  // Running the Authorization
  try {
    let AuthResponse = await _Authorization(event)
  } catch (e) {
    return {
      statusCode: 401,
      body: {} ,
      message: e,
    }
  }

  try {

    // dont touch this pls 
    // (︡❛ ͜ʖ❛︠)💨
    const rules = AddMessage_config_haneler(event);

    let AddMsgResponse = await execute({ ...event, rules, endpoint:"https://ab8wrfl9g7.execute-api.eu-central-1.amazonaws.com/production/" });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
        statusCode: 200,
        body: AddMsgResponse ? AddMsgResponse : {} ,
        message: "Msg Added",
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
  
  let { Authorization } = event

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