var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('repdb');
var reputation = 0;

var app = express();
var port = process.env.PORT || 1337;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!'); });

app.listen(port, function () {
  console.log('Listening on port ' + port);
});

app.post('/hello', function (req, res, next) {
  var userName = req.body.user_name;

db.serialize(function() {
  db.run("CREATE TABLE if not exists slack (info TEXT)");

  var stmt = db.prepare("INSERT INTO slack VALUES (?)");
  //for (var i = 0; i < 10; i++) {
      stmt.run("Hello");
      console.log(reputation);
  //}
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM slack", function(err, row) {
      //console.log(row.id + ": " + row.info);
      reputation = row.info;
      console.log(reputation);
  });
});

db.close();

  var botPayload = {
    text : 'Your reputation ' + reputation
  };
  // Loop otherwise..
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});
