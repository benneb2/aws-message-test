'use strict';

const AWS = require('aws-sdk');
// let dynamo = new AWS.DynamoDB.DocumentClient({endpoint:"http://127.0.0.1:4569/"});
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'messagesTables';

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveMessage = message => {
	
	const params = {
		TableName: TABLE_NAME,
		Item: message
	};

	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return message.messageId;
		});
};

module.exports.getMessage = recipient => {
	
	return new Promise(function (resolve, reject) { 
		var params = {
			TableName:TABLE_NAME,
			FilterExpression: "#recipient = :recipient",
			ExpressionAttributeNames: {
				"#recipient": "recipient",
			},
			ExpressionAttributeValues: {
				 ":recipient": recipient
			}
		};

		dynamo.scan(params, (err, data) => {
			if(err)
				reject(err);
			else
				resolve(data.Items);
		});

	} );
};
