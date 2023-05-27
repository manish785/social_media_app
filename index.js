const express = require('express');
const port = 8080;
const app = express();









app.listen(port, function(err){
    if(err){
        console.log('Error while running the server');
        return;
    }
    console.log('Server is running fine on port', port);
})