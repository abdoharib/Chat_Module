const config = require("./config.json");
const Pipeline = require("/opt/nodejs/node14/lib/Middleware/index");
const AddMsg = require("/opt/nodejs/node14/lib/helpers/message/add_msg")
const SendMsg = require("/opt/nodejs/node14/lib/helpers/message/send_msg")
const Update_Room = require("/opt/nodejs/node14/lib/helpers/room/update_room");
const crypto = require("crypto")
const S3_URL = "https://alm-chat-assets.s3.eu-central-1.amazonaws.com"

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); // ES Modules import
let s3client = new S3Client();

const axios = require("axios").default
axios.defaults.baseURL = 'https://api.almithaly.ly/';

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
  
  //1
  // Checking if its A File Or Text & Saving to S3
  async (ctx) => {
    if(ctx["file_type"] || ctx["file_type"]!=="text" ){


      //Extracting the format from the content & Validating it 
      ///////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////
     
      ///////////////////// Extract Start /////////////
      const ValidFormats = ["pdf","docx", "png", "jpg", "jpeg","txt"]

      // result would be [ "data:text/html", "%3Ch1%3EHello%2C%20World%21%3C%2Fh1%"]
      let [ format, content ] = ctx.content.split(";base64,")

      // result would be [ "data:text", "html"]
      let type = format.split('/')[1]
      ///////////////////// Extract END /////////////


      ///////////////////// Validation Start /////////////
      // if empty string throw error
      if(!type) throw "Unkown Format";
      if(ValidFormats.indexOf(type)<0) throw "Not A Valid Format"
      if(ctx.content === null || !ctx.content) throw "No Content to Save"
      ///////////////////// Validation END /////////////


      ///////////////////////////////////////////////////////////////////////////////
      //////////////////////////////////////////////////////////////////////////////


      //Saving to S3 & Updating the ctx.content to the S3 Path
      /////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////

      /////////// Saving to S3 START ///////////
      let _File_ID =  crypto.randomUUID()
      await s3client.send(new PutObjectCommand({
        Bucket:'alm-chat-assets',
        Body:Buffer.from(content, "base64"),
        Key:`${_File_ID}.${type}`,
        ContentType: format.split("data:")[1],
        ACL:"public-read"
      }))
      /////////// Saving to S3 END ///////////



      /////////// Updating Content Start ///////////
      ctx.content = `${S3_URL}/${_File_ID}.${type}`
      /////////// Updating Content END ///////////
      

      /////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////
      


    }else{
      //default type if no type was givin 
      ctx["file_type"] = "text"
    }

  },


  // 2
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

  // 3
  //sending the msg to the connected users
  async (ctx) => {
    let response_send = await SendMsg.execute( ctx )
    ctx.response_send = response_send;
    
  },
  
  //4
  //updating the room lattest update & sending notification
  async (ctx) => {
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
    console.log(ctx)
    
    if(ctx.type == "admin"){
          await axios.post("/chat/notify",{
      "sender":ctx.userID || "admin",
      "reciver": ctx.type !== "admin"?"admins": "admins",//ctx.RoomUsers[0].id,
      "title":"رسالة جديد : "+ctx.roomID,
      "message":ctx.response_send.content,
      "dataID":"ctx.roomID",
      "type":"chat"
  },
  {
    headers:{
      "x-api-key":"abc0135e-d748-452b-8729-2b16b33bd4f4"
    }
  })
    }

  
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