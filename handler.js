'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

exports.messages = (event, context, callback) => {
	console.log(event);

	switch (event.httpMethod) {
		case 'GET':
			getMessage(event, callback);
			break;
		case 'POST':
			sendMessage(event, callback);
			break;
		default:
			sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
	}
};

function sendMessage(event, callback) {

	const message = JSON.parse(event.body);

	if(typeof message.from == 'undefined' || typeof message.message == 'undefined' || typeof message.protocol == 'undefined' || typeof message.recipient == 'undefined' )
	{
		sendResponse(400, "Make sure to pass from, recipient, protocol and message paramaters in the body.", callback);
	}else if(message.protocol != "SMS" && message.protocol != "EMAIL")
	{
		sendResponse(400, "Protocol can only be EMAIL or SMS", callback);
	}else
	{
		console.log("Mock EMAIL/SMS.")
		if(message.protocol == "SMS")
		{
			mockSMS(message.message,message.recipient).then(result=>{
				saveMessage(message, callback);
			}).catch(err=>{
				sendResponse(404, err, callback);
			})
		}else
		{
			mockEmail(message.message,message.from,message.recipient).then(result=>{
				saveMessage(message, callback);
			}).catch(err=>{
				sendResponse(404, err, callback);
			})
		}
		
	}
}
function saveMessage(message, callback) {
	
	message.messageId = uuidv1();

	databaseManager.saveMessage(message).then(response => {
		sendResponse(200, {messageId:message.messageId}, callback);
	}).catch(err =>{
		sendResponse(404, err, callback);
	});
	
}

function getMessage(event, callback) {
	
	const recipient = event.pathParameters.recipient;

	if(typeof recipient == 'undefined')
	{
		sendResponse(400, "Please specify recipient", callback);
	}else
	{
		databaseManager.getMessage(recipient).then(response => {
			console.log(response);
			sendResponse(200, (response), callback);
		});
	}
}

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}

function mockSMS(message,recipient)
{
	console.log("Send sms to:" + recipient);
	return new Promise(function (resolve, reject) { 
		resolve();
	} );
}

function mockEmail(message,from,recipient)
{
	console.log("Send email to:" + recipient);
	return new Promise(function (resolve, reject) { 
		resolve();
	} );
}
