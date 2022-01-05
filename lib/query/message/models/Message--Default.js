//Message Data Model
const crypto = require('crypto');

module.exports =  class Messages {

    constructor( {id = null, time = null, seen = null ,content = "", userID, roomID }){
        //Extra check 
        if( !(userID && roomID) ) throw "userID & roomID are Required";

        //optional
        this.id = id || crypto.randomUUID()
        this.time = time || `${new Date().getTime()}`
        //this.seen = seen || []

        //reqired
        this.content = content
        this.userID = userID
        this.roomID = roomID

        
    }

    // msg uuid
    id;

    // Author ID refernce to the id in the users table
    userID;

    //roomid in which the messages belongs to
    roomID;

    // the content of the message
    content;

    // Unix Time message creation
    time;

    //Array of userIDs who have seen the message 
    //optional
    //seen;

}