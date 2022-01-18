const Pipeline = require('../../Middleware/index');
//get rooms query
const { GetRooms, InsertRoom } = require("../../query/room/index");
const { InsertMessage, GetMessages } = require("../../query/message/index");

const { GetUsers } = require("../../query/user/index");
const Room = require('../../query/room/models/room--Default');

module.exports = Pipeline( 

    //check if a room with 
    async ( ctx ) => {
        let { roomID, userID } = ctx

        //check if roomID exsit and is a string
        if(!roomID && !userID) throw "roomID & userID is Required";
        if(typeof roomID !== "string") throw "Invalid roomID Value, Must be A String";

        let Rooms = await GetRooms([{ name:"id", value:roomID }])
        if(!Rooms.length) throw "Room Not Found";
        
        
    },
    
    // check if user exsit
    async (ctx) => {
        const RuleName = "MemberOfRoom"

        let { userID, roomID, type, rules } = ctx;

       // console.log(rules);

        if(rules.indexOf(RuleName) >= 0 ){
            console.log("MemberOfRoom Rule is Applied");

         //   console.log("checking");
            if(typeof userID !== "string") throw "Invalid userID Value, Must be A String";

            let users = await GetUsers([  {name:"roomID", value:roomID} ])
          //  console.log(users);
            if(!users.length) throw "User Not Found in the Room";
            
            ctx.RoomUsers = users
            ctx.type = users[0].type
        }else{
            //do nothing
            let users = await GetUsers([  {name:"roomID", value:roomID} ])
            ctx.RoomUsers = users

        }       
    },
    
    
    //Add the message to db
    async (ctx ) => {
        let new_msg = await InsertMessage(ctx)
        let {content, id, userID, roomID,time} = new_msg;


        return ({
            author:{
                id:userID,
                type:ctx.type
            },
            content:content,
            time:time,
            id:id,
            roomID: roomID
        })

    }
)


