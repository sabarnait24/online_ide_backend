// var compiler = require("compilex");
// var options = { stats: true };
const express = require("express");
// compiler.init(options);
const router = express.Router();
const fs = require("fs");
const bodyParser = require("body-parser");
var request = require("request");
var jsonParser = bodyParser.json();

router.post("/compile", (req, res) => {
  const code = req.body.code;
  const input = req.body.input;
  const lang = req.body.lang;
  // try {
  //   if (lang === "Cpp" || lang === "C") {
  //     if (!input) {
  //       var envData = { OS: "windows", cmd: "g++", options: { timeout: 1000 } }; // (uses g++ command to compile )

  //       compiler.compileCPP(envData, code, function (data) {
  //         console.log(data);
  //         res.send(data);
  //         //data.error = error message
  //         //data.output = output value
  //       });
  //     } else {
  //       var envData = { OS: "windows", cmd: "g++", options: { timeout: 1000 } }; // (uses g++ command to compile )

  //       compiler.compileCPPWithInput(envData, code, input, function (data) {
  //         console.log(data);
  //         res.send(data);
  //       });
  //     }
  //   } else if (lang === "Java") {
  //     if (!input) {
  //       var envData = { OS: "windows" };

  //       compiler.compileJava(envData, code, function (data) {
  //         res.send(data);
  //       });
  //     } else {
  //       var envData = { OS: "windows" };

  //       compiler.compileJavaWithInput(envData, code, input, function (data) {
  //         res.send(data);
  //       });
  //     }
  //   } else if (lang === "Python") {
  //     if (!input) {
  //       var envData = { OS: "windows" };

  //       compiler.compilePython(envData, code, function (data) {
  //         res.send(data);
  //       });
  //     } else {
  //       var envData = { OS: "windows" };

  //       compiler.compilePythonWithInput(envData, code, input, function (data) {
  //         res.send(data);
  //       });
  //     }
  //   }
  // } catch (error) {
  //   res.status(400).send(error);
  // }
  var result="";
  try {
    var program = {
      script: code,
      language: lang,
      stdin: input,
      versionIndex: "0",
      clientId: "b72f395320d93809d7a9fdb2aceaa547",
      clientSecret:
        "560fa6567307d002d35e84f65f9ba859d37a24274d337cc4206b3fdd83568eae",
    };
    request(
      {
        url: "https://api.jdoodle.com/v1/execute",
        method: "POST",
        json: program,
      },
      function (error, response, body) {
        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        // console.log('body:', body);
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
  // const dir = "C:/Users/user/vs code program/web develpoment/ide/server/temp";

  // fs.rm(dir, { recursive: true, force: true }, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  // });
});

module.exports = router;
