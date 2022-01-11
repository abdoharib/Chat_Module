const config = require("./config.json");
const Pipeline = require("../../lib/Middleware/index");
const AddRoom = require("../../lib/helpers/room/add_room")
const axios = require("axios").default
// For Testing

const type = "admin"


// don't touch this pls // (︡❛ ͜ʖ❛︠)💨
function AddRoom_config_haneler(){
  if(Object.keys(config).length){
      let { Auth } = config
      if(!Auth) throw "Invalid AddRoom Config file Format !!";
      
      for (const RuleName in Auth) {
          if(Auth[RuleName].type.indexOf(type) >= 0 || Auth[RuleName].type.indexOf("*") >= 0 ){
              return Auth[RuleName].rules;
          }
      }
      throw "You Shall Not Pass  ✋🛑"
  }
}


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//add room pipeline
const { push, execute } = Pipeline(

  
  // 1
  // adding the room to dynamo
  async (ctx) => {

    let room_added = await AddRoom.execute( ctx )

    return room_added;
  },

  

);




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
    const rules = AddRoom_config_haneler();

    let AddRoomResponse = await execute({ ...event, rules, type });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
        statusCode: 200,
        body: AddRoomResponse ? AddRoomResponse : {} ,
        message: "Room Added",
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




//to add a Middleware to the AddRoom Pipeline uncomment the code below & pls read the goddamn comments !!
/*
AddRoom.push(

    //this function gets executed before adding a msg 
    // the ctx paramater is an object that Has accaess to the parameter of AddRoom.execute( { ... } );
    // ctx = { room:{id, lastUpdate, status}  ) }

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

//this function gets executed after adding a room & before adding users to the users table (if users are provided) 

//    AddRoom Pipeline Explaination

//    *|* add room to db (default)

//     *|* >> you are adding your functions here <<

//    *|*  if users are provided add them to db (default)

    // the ctx paramater is an object that Has accaess to the parameter of execute( { ... } );
    // ctx = { room:{id, lastUpdate, status} }

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

