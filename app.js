const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Set up express server here
const options = {
    cert: fs.readFileSync('<<<<<<<<<YOURCERTIFICATEFILEHERE.crt>>>>>>>>>>'),
    key: fs.readFileSync('<<<<<<<<<YOURPRIVATEKEYFILEHERE.key>>>>>>>>>>>')
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const PORT = process.env.PORT || 4001;

app.get('/ping', function(req, res) {
  res.send('pong');
});

// object which keeps what stuff has been paid for while server is alive.
var legit = {};

app.post('/byali/paidment', function(req, res) {
  console.log('Moneybutton Webhook hit me...');
  var paymentid = req.body.payment.id;
  if(parseFloat(req.body.payment.amount) >= 0.09 && req.body.payment.currency == "GBP" && (req.body.payment.to == "1512" || req.body.payment.to == undefined) && req.body.payment.status != "DOUBLE_SPENT" && req.body.secret == "<<< YOUR APPS SECRET >>>"){
    legit[paymentid] = true;
    console.log('payment is good');
  } else{
    legit[paymentid] = false;
    console.log('Bad payment');
  }
  res.status(200);
});

app.post('/byali/paid', function(req, res) {
  var paymentid = req.body.id;
  if (legit[paymentid]){
    // secret data being protected by the wallwall:
    res.status(200).send({ imgurl: "https://bico.media/0d919b62a99551c9a9682af1301b4f19e91c34810de16f0eddc72d684be0e66a"});
  } else{
    res.status(200).send({ imgurl: "stop.png"});
  }
});


// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
https.createServer(options, app).listen(8443, () => {
  console.log(`Https server is listening on port 8443`);
});
