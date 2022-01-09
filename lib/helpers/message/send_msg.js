const Pipeline = require('../../Middleware/index');
const axios = require("axios").default
const { GetUserConnectionIDs } = require("../../query/connections/index")

module.exports = Pipeline( 

    //get ids 
    async ( ctx ) => {
        let { msg :{roomID}} = ctx

        // to : [ { userID : "" || type : "" } ]

        // get the connection ids from dynamodb
        let ids = await GetUserConnectionIDs( [ {name:"roomID", value:roomID}, /*for connections that are subscribed to everyroom*/ {name:"roomID", value:"*"} ] )
        ctx.to = ids
    },
    //send msg to ids
    async (ctx ) => {

        let { msg, to } = ctx

        //from [ { userID : " ", roomID:"", ConnectionsIDs : "" } ] //to [ "id1", "id2", ... ]
        let IDs = to.map( ({ ConnectionsIDs }) => ConnectionsIDs  )
        // remove replca
        IDs = [...new Set(IDs)];

       /* //loop over Ids an send msg to each one
        for  (const _Id of IDs) {
           let Response = await axios.put(`https://${api-id}.execute-api.us-east-1.amazonaws.com/${stage}/@connections/${connection_id}`
            , msg)
        }*/
        return msg;
    }

)