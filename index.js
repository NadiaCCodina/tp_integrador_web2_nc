const express = require("express");
const app = express();
const translate = require('node-google-translate-skidz'); 
var path = require('path');

app.use(express.json());

app.use(express.text());

app.use(express.static(__dirname + "/public/"));

app.get('/', function (request, responce) {
    responce.sendFile(path.join(__dirname, 'index.html'));
})

app.post("/traducir", function (request, responce) {
    
    const texto = request.body
    console.log(texto);
    
    translate({
        text: texto,
        source: 'en',
        target: 'es'
    }, (result) => {
        responce.json({ traduccion: result.translation })
    })
})

app.listen(4000, () => {

    console.log("server ready..")
});

