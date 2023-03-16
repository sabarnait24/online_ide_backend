const express = require("express");
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
var request = require("request");
var jsonParser = bodyParser.json();
require('dotenv').config().

router.post("/compile", (req, res) => {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;
  
  var result="";
  try {
    var program = {
      script: code,
      language: lang,
      stdin: input,
      versionIndex: "0",
      clientId: process.env.CLIENT_Id,
      clientSecret:process.env.CLIENT_SECRET,
    };
    request(
      {
        url: "https://api.jdoodle.com/v1/execute",
        method: "POST",
        json: program,
      },
      function (error, response, body) {
        result = body;
        console.log(body);
        if (error) {
          console.log(error);
        }
        if(result===""){
          res.send("error");
        }
        console.log(result);
        res.json(result);
      }
    );
    
  } catch (error) {
    console.log("error is" , error);
  }

});

module.exports = router;
