const request = require('request-promise-native');
const util = require('./utils');

exports.handler = async (event, callback) => {
    const TWILIO_ACCOUNT = process.env.TWILIO_ACCOUNT;
    const TWILIO_API_KEY = process.env.TWILIO_API_KEY;
    const SEND_SMS_FROM = process.env.SEND_SMS_FROM;
    const SEND_SMS_TO = process.env.SEND_SMS_TO;
    const SEND_SMS_NUMBER = event.pathParameters;

    console.log('inbound number:', SEND_SMS_NUMBER);

    try{
        await request({
            url: `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT}/Messages.json`,
            method: 'POST',
            json: true,
            auth: {
                user: TWILIO_ACCOUNT,
                pass: TWILIO_API_KEY
            },
            form: {
                From: SEND_SMS_FROM,
                To: SEND_SMS_TO,
                Body: `Please reply YES to receive updates from BuyOnTrust. Reply STOP to cancel application.`
            }
        }).then(() => {console.log(`Optin successfully sent through SMS to ${SEND_SMS_TO}`);})
        
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(`Optin successfully sent through SMS to ${SEND_SMS_TO}`)
        };
      
    } catch(err) {
        console.log('Error sending SMS: Check response body for more detail.');
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : 'Optin Verification Exception:',
                message: err.message ? err.message : 'Error occured during SMS serverless handler execution. Check Lambda logs for more details.'
            })
        };
    }
};