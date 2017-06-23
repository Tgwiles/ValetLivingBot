var express = require('express'),
    router = express.Router(),
    config = require('../../config/config'),
    db = require('../models'),
    fb = require('../helpers/facebookGraphAPI'),
    bodyParser = require('body-parser'),
    request = require('request');

module.exports = function (app) {
  app.use('/', router);
};

// Facebook verification
router.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === config.verify_token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong token');
});

router.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;

  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;

    // Handle opt-in via the Send-to-Messenger Plugin, store user data and greet the user by name
    if (event.optin) {
      userNamePromise = fb.getUserName(sender);

      userNamePromise.then(function(userName) {
        fb.sendTextMessage(sender, "Hi there, " + userName.first_name + "! I'm Thomas. I'll repeat things to you or display panels if you type 'Generic'.");
      });
    }

    // Handle receipt of a message
    if (event.message && event.message.text) {
      text = event.message.text;

      // Handle special keyword 'Help'
      if (text === 'Start') {
        fb.sendStartMessage(sender);
        continue;
      }

      if (text === 'Help') {
        fb.sendTextMessage(sender, "List of commands: \n 1. Start - Initiate Conversation Flow \n 2. Name - States your name")
        continue;
      }

      // Failsafe + reminder for anything else
      fb.sendTextMessage(sender, "I'm sorry, I don't understand that input. Remember to type 'Help' for a list of commands or 'Start' to begin the conversation again.");
      continue;
    }

    // Handle receipt of a postback
    if (event.postback) {
      text = JSON.stringify(event.postback);
      fb.sendTextMessage(sender, "Postback received: "+text.substring(0, 200));
      continue;
    }

  }
  res.sendStatus(200);

});
