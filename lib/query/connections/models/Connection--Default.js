//Message Data Model
const crypto = require('crypto');
const { isArray } = require('util');

module.exports =  class UserConnections {

    constructor( {userID, ConnectionsIDs, roomID }){

        //Extra check 
        if( !(userID && ConnectionsIDs && roomID) ) throw "userID & ConnectionsIDs & roomID are Required";
        if( typeof ConnectionsIDs !== "string"  ) throw "ConnectionsIDs Must be A String";
    
        //reqired
        this.userID = userID
        this.roomID = roomID
        this.ConnectionsIDs = ConnectionsIDs

        
    }

    // connections ids Array
    ConnectionsIDs;

    // Author ID refernce to the id in the users table
    userID;

    roomID;


}