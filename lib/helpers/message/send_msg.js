const Pipeline = require('../../Middleware/index');
const axios = require('axios').default;
const { GetUserConnectionIDs } = require('../../query/connections/index');

const { ApiGatewayManagementApiClient, PostToConnectionCommand } = require('@aws-sdk/client-apigatewaymanagementapi');

module.exports = Pipeline(
	//get ids
	async (ctx) => {
		let { msg: { roomID } } = ctx;

		// to : [ { userID : "" || type : "" } ]

		// get the connection ids from dynamodb
		let ids = await GetUserConnectionIDs([
			{ name: 'roomID', value: roomID },
			/*for connections that are subscribed to everyroom*/ { name: 'roomID', value: '*' }
		]);
		ctx.to = ids;
	},
	//send msg to ids
	async (ctx) => {
		let { msg, to, endpoint } = ctx;

		if (!endpoint) throw 'No Socket EndPoint Provided';

		const ApiGatewaClient = new ApiGatewayManagementApiClient({ endpoint: endpoint });

		//from [ { userID : " ", roomID:"", ConnectionsIDs : "" } ] //to [ "id1", "id2", ... ]
		let IDs = to.map(({ ConnectionsIDs }) => ConnectionsIDs);
		// remove replca
		IDs = [ ...new Set(IDs) ];

		//loop over Ids an send msg to each one
		for (const _Id of IDs) {
			try {
				await ApiGatewaClient.send(
					new PostToConnectionCommand({
						ConnectionId: _Id,
						Data: JSON.stringify(msg)
					})
				);
			} catch (error) {
                console.log(error);
                
				if (JSON.stringify(error).indexOf('GoneException') >= 0) {
					console.log('UserID Disconnected');
					let selectedConnection = await GetUserConnectionIDs([ { name: 'ConnectionsIDs', value: _Id } ]);

					//Something is Wrong we are sending to an ID that Dosent Exsit
					if (selectedConnection && selectedConnection.length) {
						roomID = selectedConnection[0].roomID;
						await RemoveUserConnectionIDs([
							{ name: 'ConnectionsIDs', value: _Id },
							{ name: 'roomID', value: roomID }
						]);
					}

				}
			}
		}
		return msg;
	}
);
