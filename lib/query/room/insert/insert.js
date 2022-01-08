
//AWS Lib
const { DynamoDBClient,  ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

const { Models } = require('../../../../custom/room/config');

//Config File
const { TableName, region } = require("../config.json")

//Data Model
const Room = require("../models/room--Custom")

//init dynamodb client
const dynamodbclient = new DynamoDBClient({ region });

module.exports = async ( props, config = [] ) => {
    //create new msg
    const new_room = new Room( props, Models )
    //console.log(new_room);
    //insert in db
    
    await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`INSERT INTO "${TableName}" `+`value { ${ Object.keys(new_room).map( key => `'${key}':?` ).join() }}`,
        Parameters:Object.keys(new_room).map( key => convertToAttr(new_room[key]) )
    })).catch( err => {
        console.log("||||||||||||||||||\n<<<<<<<<<<<<< Error From DynamoDB Insert Message Query >>>>>>>>>>>>>\n|||||||||||||||||||||");
        throw err
    })

    return new_room
    
}