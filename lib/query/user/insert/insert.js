
//AWS Lib
const { DynamoDBClient,  ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

const { Models } = require('../../../../custom/user/config');

//Config File
const { TableName, region } = require("../config.json")

//Data Model
const User_Custom = require("../models/user--Custom")

//init dynamodb client
const dynamodbclient = new DynamoDBClient({ region });

module.exports = async ( props, config = [] ) => {
    //create new msg
    const new_user = new User_Custom( props, Models )
    //console.log(new_user);
    //insert in db
    
    await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`INSERT INTO "${TableName}" `+`value { ${ Object.keys(new_user).map( key => `'${key}':?` ).join() }}`,
        Parameters:Object.keys(new_user).map( key => convertToAttr(new_user[key]) )
    })).catch( err => {
        console.log("||||||||||||||||||\n<<<<<<<<<<<<< Error From DynamoDB Insert User Query >>>>>>>>>>>>>\n|||||||||||||||||||||");
        throw err
    })

    return new_user
    
}