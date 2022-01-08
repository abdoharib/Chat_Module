
//AWS Lib
const { DynamoDBClient,  ExecuteStatementCommand} = require('@aws-sdk/client-dynamodb');
const { convertToAttr, unmarshall } = require("@aws-sdk/util-dynamodb");

//Config File
const { TableName, region } = require("../config.json")

const Connection = require("../models/Connection--Default")

//init dynamodb client
const dynamodbclient = new DynamoDBClient({ region });

module.exports = async ( props /*, config = []*/ ) => {
    
    //create new msg
    const new_connection = new Connection( props )
    //console.log(new_connection);
    //insert in db
    
    
    await dynamodbclient.send(new ExecuteStatementCommand({
        Statement:`INSERT INTO "${TableName}" `+`value { ${ Object.keys(new_connection).map( key => `'${key}':?` ).join() }}`,
        Parameters:Object.keys(new_connection).map( key => convertToAttr(new_connection[key]) )
    })).catch( err => {
        console.log("||||||||||||||||||\n<<<<<<<<<<<<< Error From DynamoDB Insert Message Query >>>>>>>>>>>>>\n|||||||||||||||||||||");
        throw err
    })

    return new_connection
    
}


