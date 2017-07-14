var config = require('../../config/config'),
    request = require('request'),
    rp = require('request-promise');

module.exports = {

  getUserName: function getUserName(sender) {
    return rp({
      url: 'https://graph.facebook.com/v2.6/' + sender,
      qs: {
        access_token: config.page_access_token,
        fields: "first_name,last_name"
      },
      method: 'GET'
    })
    .then (function(data) {
      return JSON.parse(data);
    });
  },

  sendTextMessage: function sendTextMessage(sender, text) {
    messageData = {
      text:text
    };
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:config.page_access_token},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending messages: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  },

  sendGenericMessage: function sendGenericMessage(sender) {
    messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Check out our website!",
            "subtitle": "Option #1",
            "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
            "buttons": [{
              "type": "web_url",
              "url": "http://www.valetliving.com",
              "title": "ValetLiving"
            }, {
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for first element in a generic bubble",
            }],
          }]
        }
      }
    };
    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:config.page_access_token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  },

 sendStartReply: function sendStartReply(sender){
  messageData = {
    text: ('What would you like help with, ' + fb.getUserName + '?'),
    quick_replies: [
      { content_type: 'text', title: 'Payment Help', payload: 'PAYLOAD_FOR_OPTION_1' },  // Work out how to use payload!!!!
      { content_type: 'text', title: 'Available Resources', payload: 'PAYLOAD_FOR_OPTION_2' },
      { content_type: 'text', title: 'Search by Department', payload: 'PAYLOAD_FOR_OPTION_5' }
    ],
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:config.page_access_token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  },


  // Sends small button prompts that disappear after the user enters an answer (Up to 10 button choices)
  sendDepartmentReply: function sendDepartmentReply(sender){
  messageData = {
    text: 'Please choose a department: ',
    quick_replies: [
      { content_type: 'text', title: 'HR', payload: 'PAYLOAD_FOR_OPTION_1' },  // Work out how to use payload!!!!
      { content_type: 'text', title: 'IT', payload: 'PAYLOAD_FOR_OPTION_2' },
      { content_type: 'text', title: 'Marketing', payload: 'PAYLOAD_FOR_OPTION_3' }, 
      { content_type: 'text', title: 'Sales', payload: 'PAYLOAD_FOR_OPTION_4' },
      { content_type: 'text', title: 'Business Development', payload: 'PAYLOAD_FOR_OPTION_5' },
      { content_type: 'text', title: 'ValetLiving Turns', payload: 'PAYLOAD_FOR_OPTION_5' },
      { content_type: 'text', title: 'Support', payload: 'PAYLOAD_FOR_OPTION_5' },
      { content_type: 'text', title: 'Finance', payload: 'PAYLOAD_FOR_OPTION_5' }
    ],
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:config.page_access_token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  },

// Sends small button prompts that disappear after the user enters an answer (Up to 10 button choices) - 20 char limit per button
  sendITReply: function sendITReply(sender){
  messageData = { 
    text: 'What topic is your question related to?: ',
    quick_replies: [
      { content_type: 'text', title: 'Login Trouble', payload: 'PAYLOAD_FOR_OPTION_1' },  // Work out how to use payload!!!!
      { content_type: 'text', title: 'Exporting', payload: 'PAYLOAD_FOR_OPTION_2' },
      { content_type: 'text', title: 'Laptop issue', payload: 'PAYLOAD_FOR_OPTION_3' }, 
      { content_type: 'text', title: 'iPhone/iPad', payload: 'PAYLOAD_FOR_OPTION_4' },
      { content_type: 'text', title: 'Printer', payload: 'PAYLOAD_FOR_OPTION_5' },
      { content_type: 'text', title: 'Other', payload: 'PAYLOAD_FOR_OPTION_6' }
    ],
  };
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:config.page_access_token},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: messageData,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }
}



