const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
app.use(express.static('app/upload'));


require('dotenv').config();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookie());

app.use('/', require('./app/routes/authRoute'));
app.use('/',require('./app/routes/categoryRoute'));
app.use('/',require('./app/routes/testimonialRoute'));
app.use('/', require('./app/routes/contactRoute'));
app.use('/', require('./app/routes/portfolioRoute'))

app.listen('3000', () => {
    console.log('server started on port 3000');
});