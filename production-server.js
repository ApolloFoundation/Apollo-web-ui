var express = require('express');
var app = express();
const path = require('path');

//setting middleware
app.use(express.static(__dirname + '/build')); //Serves resources from public folder

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});


var server = app.listen(3030);