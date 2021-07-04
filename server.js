const express = require("express");
const morgan = require("morgan");
const { FaceClient, FaceModels } = require("@azure/cognitiveservices-face");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const { text } = require("express");



app = express();
app.set("view engine","ejs");


app.listen(process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
    var url_pic;
    var text_json = "Give us a picture :)";
    var raw;
    res.render("main",{url_pic,text_json,raw});
    });
    
app.post("/", (req,res) => {
    var url_pic = req.body.requrl;
    var text_json = "";
    var raw; 
    async function main() {
        const faceKey = process.env["faceKey"] || "facekeyhere";
        const faceEndPoint = process.env["faceEndPoint"] || "faceendpoint";
        const cognitiveServiceCredentials = new CognitiveServicesCredentials(faceKey);
        const client = new FaceClient(cognitiveServiceCredentials, faceEndPoint);
        const options = {
          returnFaceAttributes: ["age","gender","facialHair","glasses","emotion","hair"] //things return here
        };
        client.face
          .detectWithUrl(url_pic, options)
          .then(result => {
            text_json = JSON.stringify(result);
            raw = result;
            res.render("main", {url_pic ,text_json,raw});
          })
          .catch(err => {
            console.log("An error occurred:");
            console.error(err);
          });
      }
       
      main();

    
});

app.use((req,res) => {
    res.status(404).send("404");
});




