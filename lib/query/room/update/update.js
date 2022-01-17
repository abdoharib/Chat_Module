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

module.exports = async ( filter = null, updated_values=null ) => {
   //  filter = [{name:"", value:""}, ...]
    //conver filter to filter object
    
    let req_filter = new Filter(filter,updated_values)
   // console.log(req_filter);
 //console.log( `UPDATE \"${TableName}\"${ updated_values ? (req_filter.update_statement ? req_filter.update_statement : '') : '' }${ filter ? (req_filter.statement ? req_filter.statement : '') : '' }` );
  //console.log(req_filter.values);  
  let { Items } = await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`UPDATE \"${TableName}\"${ updated_values ? (req_filter.update_statement ? req_filter.update_statement : '') : '' }${ filter ? (req_filter.statement ? req_filter.statement : '') : '' }`,
       // Statement:"SELECT * FROM \"default_chat_rooms\" WHERE \"roomID\"='2224'"
        ...(  (req_filter.values.length) && { Parameters: req_filter.values.map( val => convertToAttr(val) ) } )
    })).catch(err => {
        console.log("||||||||||||||||||\n <<<<<<<<<<<<< Error From DynamoDB GET Rooms Query >>>>>>>>>>>>> \n|||||||||||||||||||||");
        console.log(err);
        throw err
    })
  //  console.log(Items.map(item => unmarshall(item)));
    
    return Items.map(item => unmarshall(item))
}
