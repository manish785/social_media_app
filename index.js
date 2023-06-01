const express = require('express');
const cookieParser = require('cookie-parser');
//const { route } = require('express/lib/application');
const port = 8080;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();

app.use(express.urlencoded());
app.use(cookieParser());


app.use(express.static('./assets'))
app.use(expressLayouts);

dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection Succesful")).catch((err)=>{
    console.log(err);
});


// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');



app.listen(port, function(err){
    if(err){
        console.log(`Error while running the server: ${err}`);
        return;
    }
    console.log(`Server is running fine on port: ${port}`); //by the help of string interpolation, it took the value
})