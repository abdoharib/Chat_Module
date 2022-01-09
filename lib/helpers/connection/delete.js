const Pipeline = require('../../Middleware');

const { GetUserConnectionIDs, RemoveUserConnectionIDs } = require("../../query/connections")

module.exports = Pipeline( 
  // 1
  //get the room id for this ConnectionsIDs
  async (ctx) => {
    
    let { ConnectionsIDs } = ctx;

    let selectedConnection = await GetUserConnectionIDs([{ name: "ConnectionsIDs", value: ConnectionsIDs }])
    
    if (!selectedConnection || !selectedConnection.length) throw "This Request Shouldn't Happen 🤔 (The Connection Dosn't Even Exsit )";

    if (selectedConnection.length !== 1) throw "Multiple Connections with The Same ID Detected 🤌, \n Pls Go into DynamoDB & Fix Your Mess, Here's a Panda 🐼 He Can Help you out"

    ctx.roomID = selectedConnection[0].roomID

  },
  
  // 2
  // delete the connection
  async (ctx) => {
    let { roomID, ConnectionsIDs } = ctx
    if (!roomID) throw "For F**k Sake 🤌, SomeHow there is A Connection in the connection table With no roomID, \n Pls Go into DynamoDB & Fix Your Mess 😡, No Panda This Time"
    let RemoveConnectionIDsResponse = await RemoveUserConnectionIDs([{ name: "ConnectionsIDs", value: ConnectionsIDs }, { name: "roomID", value: roomID }])
    return RemoveConnectionIDsResponse;
  },
)


