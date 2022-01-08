//Message Data Model
const crypto = require('crypto');

module.exports =  class User {

    constructor( {id = null, type = "", roomID = null}){

        if( !( roomID) ) throw " roomID is Required";
        

        //optional
        this.type = type || "";

        //reqired
        this.id = id || crypto.randomUUID()
        this.roomID = roomID
    }

    // room uuid
    id;

    // latest update
    roomID;

    // room status
    type;

}