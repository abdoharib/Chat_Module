const Pipeline = require("../../lib/Middleware/index");
const DeleteConnection = require("../../lib/helpers/connection/delete")

const axios = require("axios").default





// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
//remove connection pipeline
const { push, execute } = Pipeline(

  //DeleteConnection
  async (ctx) => {
    let DeleteConnectionResponse = await DeleteConnection.execute(ctx)
    return DeleteConnectionResponse;
  }

);


// dont touch this pls // (︡❛ ͜ʖ❛︠)💨
exports.handler = async (event) => {


  try {

    let CloseConnectionResponse = await execute({ ...event, /*Dont forget to remove type in prod*/ });

    // dont touch this pls // (︡❛ ͜ʖ❛︠)💨
    return {
      statusCode: 200,
      body: CloseConnectionResponse ? CloseConnectionResponse : {},
      message: "Connection Deleted",
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



