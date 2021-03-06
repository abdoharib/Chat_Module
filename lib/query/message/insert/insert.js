
//AWS Lib
const { DynamoDBClient,  ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

//Config File
const { TableName, region } = require("../config.json")

const { Models } = require('../../../../custom/message/config');


//Data Model
const Message = require("../models/Message--Custom")

//init dynamodb client
const dynamodbclient = new DynamoDBClient({ region });

module.exports = async ( props /*, config = []*/ ) => {
    //create new msg
    const new_msg = new Message( props, Models )
    //console.log(new_msg);
    //insert in db
    
    
    await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`INSERT INTO "${TableName}" `+`value { ${ Object.keys(new_msg).map( key => `'${key}':?` ).join() }}`,
        Parameters:Object.keys(new_msg).map( key => convertToAttr(new_msg[key]) )
    })).catch( err => {
        console.log("||||||||||||||||||\n<<<<<<<<<<<<< Error From DynamoDB Insert Message Query >>>>>>>>>>>>>\n|||||||||||||||||||||");
        throw err
    })

    return new_msg
    
}


