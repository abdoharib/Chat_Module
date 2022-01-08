const crypto = require('crypto');

//AWS Lib
const { DynamoDBClient, ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

//Config File
const { TableName, region } = require("../config.json")

//Data Model
const Filter = require("../models/Filter")

//init dynamodb client
const dynamodbclient = new DynamoDBClient( { region } );

module.exports = async ( filter = null ) => {
   //  filter = [{name:"", value:""}, ...]
    //conver filter to filter object
    
    let req_filter = new Filter(filter)
   // console.log(req_filter);
    
   console.log(`SELECT * FROM \"${TableName}\"${ filter ? req_filter.statement : '' }`);
    let { Items } = await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`SELECT * FROM \"${TableName}\"${ filter ? req_filter.statement : '' }`,
       // Statement:"SELECT * FROM \"default_chat_messages\" WHERE \"roomID\"='2224'"
        ...( filter && { Parameters: req_filter.values.map( val => convertToAttr(val) ) } )
    })).catch(err => {
        console.log("||||||||||||||||||\n <<<<<<<<<<<<< Error From DynamoDB GET Messages Query >>>>>>>>>>>>> \n|||||||||||||||||||||");
        console.log(err);
        throw err
    })
    console.log(Items.map(item => unmarshall(item)));
    
    return Items.map(item => unmarshall(item))
}