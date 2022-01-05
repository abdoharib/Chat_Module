
//AWS Lib
const { DynamoDBClient,  ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

//Config File
const { TableName, region } = require("../config.json")

//Data Model
const Message = require("../models/Message--Custom")

//init dynamodb client
const dynamodbclient = new DynamoDBClient({ region });

module.exports = async ( props, config ) => {
    //create new msg
    const new_msg = new Message( props, config )
    console.log(new_msg);
    //insert in db
    
    await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`INSERT INTO "${TableName}" value { 'id':?, 'userID':?, 'roomID':?, 'content':?, 'time':?}`,
        Parameters:Object.keys(new_msg).map( key => convertToAttr(new_msg[key]) )
    })).catch( err => {
        console.log("||||||||||||||||||\n<<<<<<<<<<<<< Error From DynamoDB Insert Message Query >>>>>>>>>>>>>\n|||||||||||||||||||||");
        throw err
    })

    return new_msg
    
}