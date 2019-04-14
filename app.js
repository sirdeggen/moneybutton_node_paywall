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

app.post('/byali/paid', function(req, res) {
  console.log('Checking status...');
  var status = req.body.status;
  console.log(status);
  var legit = false;
  console.log(req.body.amount);
  console.log(req.body.currency);
  console.log(req.body.to);
  if(parseFloat(req.body.amount) >= 0.09 && req.body.currency == "GBP" && (req.body.to == "1512" || req.body.to == undefined) && req.body.status != "DOUBLE_SPENT"){
    legit = true;
    console.log('payment is good');
  }
  else{
    console.log('Bad payment');
  }
  if (legit){
    res.status(200).send({ imgurl: "https://bico.media/0d919b62a99551c9a9682af1301b4f19e91c34810de16f0eddc72d684be0e66a"});
  } else{
    res.status(200).send({ imgurl: "stop.png"});
  }
});

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
https.createServer(options, app).listen(8443);
