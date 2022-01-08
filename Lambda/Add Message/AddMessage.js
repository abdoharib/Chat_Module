const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const AddMsg = require("../../lib/helpers/message/add_msg")
const axios = require("axios").default

// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
function AddMessage_config_haneler(){
  if(Object.keys(config).length){
      let { Auth } = config
      if(!Auth) throw "Invalid AddMessage Config file Format !!";
      
      for (const RuleName in Auth) {
          if(Auth[RuleName].type.indexOf(type) >= 0){
              return Auth[RuleName].rules;
          }
      }
      return []
  }
}


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//add message pipeline
const { push, execute } = Pipeline(

  // 1
  // adding the message to dynamo
  async (ctx) => {
    let msg_added = await AddMsg.execute( ctx )
    ctx.msg = msg_added
    // dont forget to comment this
    return msg_added;
  },

  // 2
  //sending the msg to the connected users
  async () => {
    
  }

);


//for testing
const type = "user"

exports.handler = async (event) => {

  // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
  //running the Authorization
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
    const rules = AddMessage_config_haneler();

    let AddMsgResponse = await execute({ ...event, rules, type: "user" });

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
const Authorization = async( event ) =>{

  //returns or throws error
  //throw "safasf"
  //return {
    
  //}
}

