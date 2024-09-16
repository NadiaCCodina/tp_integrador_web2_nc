const express = require("express");
const http = require("node:http");
const app = express();
var path = require('path');
app.use(express.static( 'public'));
app.get('/', function(request, responce){
    responce.sendFile(path.join(__dirname, 'public' ,'index.html'));
})

app.listen(4000, () =>{

 console.log("server not found...")
});