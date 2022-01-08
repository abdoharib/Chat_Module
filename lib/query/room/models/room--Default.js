//Message Data Model
const crypto = require('crypto');

module.exports =  class Room {

    constructor( {id = null, latestUpdate = new Date().getTime().toString(), status = true}){

        //optional
        this.id = id || crypto.randomUUID()
        this.latestUpdate = latestUpdate || `${new Date().getTime()}`
        this.status = status

        //reqired
        // noting is required
    }

    // room uuid
    id;

    // latest update
    latestUpdate;

    // room status
    status;

}