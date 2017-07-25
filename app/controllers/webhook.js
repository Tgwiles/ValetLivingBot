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
        fb.sendTextMessage(sender, "Hi there, " + userName.first_name + "! I'm Thomas. Type 'Start' to begin a conversation or 'Help' for tips on how I can talk to you.");
      });
    }

    // Handle receipt of a message
    if (event.message && event.message.text) {
      text = event.message.text;


      // NOTE: BUTTON ANSWERS ARE RECOGNIZED VIA THEIR STRING, NOT BY THEIR PAYLOAD (ie. You cannot have multiple buttons that contanin the same string but point to different responses)
      switch(text) {

        case 'Start':
          fb.sendStartReply(sender);
          continue;

        case 'Help':
          fb.sendTextMessage(sender, "List of commands:\n1. Start - Begin help questions\n");
          continue;

        case 'Search by Department':
          fb.sendDepartmentReply(sender);
          continue;

        // case 'Generic':
        //   fb.sendGenericMessage(sender);
        //   continue;

        //All responses related to Information Technology ===================================================================================
        case 'IT':
          fb.sendITReply(sender);
          continue;

        case 'Login Trouble':
          fb.sendTextMessage(sender, "If you are experiencing login issues related to Workday or Concur, please reach out to (email address)");
          continue;

        case 'Exporting':
          fb.sendTextMessage(sender, "If you have trouble exporting documents, reports, spreadsheets etc, the most common fix is to restart your laptop and change internet browsers (Google Chrome usually works best).");
          continue;

        case 'Laptop issue':
          fb.sendTextMessage(sender, "If your laptop is running slow and/or says it has low disk space, please contact our IT support (itsupport@valetliving.com) to schedule a time where we can help clear space for you.");
          fb.sendTextMessage(sender, "If you believe you have a hardware issue with your computer, send a message to our support email and try to best describe your problem so that we may see how we can assist you.");
          continue;
        
        case 'Printer':
          fb.sendTextMessage(sender, "To set up a new printer, an IT member will need to download and install the latest driver for your specific printer, please contact itsupport@valetliving.com to set up a time.");
          continue;
        //===================================================================================================================================
        
        
        default:
          fb.sendTextMessage(sender, "I'm sorry, I don't understand that input.\nRemember to type 'Help' for a list of commands.");
          continue;
      }
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
