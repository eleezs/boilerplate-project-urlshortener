const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();
const dns =  require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//connect to mongodb and creating a db
let url_db ="mongodb://localhost:27017/freeCodeCamp-urlshortner";

mongoose.connect(url_db, function(err, db){
  if(err) throw err;
  console.log('Mongodb Connected and Database created')
  db.close
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//create schema
const urlSchema = new mongoose.Schema({
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  }
  // date: {
  //   type: String,
  //   default: Date.now,
  // }
});

let Url = mongoose.model('Url', urlSchema);

function validateUrl(value) {
  let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  
  return regex.test(value);
};

//empty object for display
let resObj = {};

//short url generator
app.post('/api/shorturl/', async(req, res) =>{
  // console.log(req.body.url);
  let origUrl   = req.body.url;
  console.log(origUrl);
  
  // let urlId = shortId.generate();
  let urlId = Math.floor(Math.random() * 501);
  const addressRegex = /(http(s)?:\/\/.)?(www\.)/gi;
  let dnsInput = origUrl.replace(addressRegex, "www.");
  console.log(dnsInput);
  dns.lookup(dnsInput, (err, address, family) =>{
    console.log(err, address, family)
    if(err) {
      return res.json({"error": "invalid URL"})
    }
  });

  // if(validateUrl(origUrl)){
    
  //   try {
  //     let newUrl = await Url.findOne({ origUrl})
  //     if (newUrl) {
  //       res.json("exist");   
  //     }
  //     else{
  //       let shortUrl = urlId;

  //       url_1 = new Url({
  //         origUrl,
  //         shortUrl,
  //         date: new Date()
  //       });

  //       url_1.save();
  //       resObj['origUrl'] = origUrl;
  //       resObj['shortUrl'] = shortUrl;
  //       res.json(resObj);
  //     }
  //   }
  //   catch (err) {
  //     console.log(err)
  //     res.status(500).json('Sever Error');
  //   }
  // }
  // else {
  //   res.status(400).json("Invalid Original Url");
  // }
});
  
