const express = require('express');
const { route } = require('express/lib/application');
const port = 8080;
const app = express();


// use express router
app.use('/', require('./routes'));






app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
        return;
    }
    console.log(`Server is running fine on port: ${port}`); //by the help of string interpolation, it took the value
})