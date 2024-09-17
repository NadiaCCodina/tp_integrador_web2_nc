const express = require("express");
const http = require("node:http");
const app = express();
var path = require('path');

app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/img/"));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'public' ,'index.html'));
})

app.listen(4000, () =>{

 console.log("server not found...")
});