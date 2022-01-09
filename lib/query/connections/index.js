module.exports = {
    // inserts a new msg in the database
    AddUserConnectionIDs : require("./add/add"),
    // gets Messages from database
    GetUserConnectionIDs : require("./get/get"),
    // Delete ConnectionsbyID
    RemoveUserConnectionIDs : require("./remove/remove"),

}