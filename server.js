/* Dependencies */
const 
    router = require('./controllers/router.js'),

    express = require('express'),
    expressHandlebars = require('express-handlebars'),
    path = require('path');
require('dotenv').config();

/* Express */
const app = express();

app.locals.config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
}

router(app);

app.engine('handlebars', expressHandlebars({
    defaultLayout:'main',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine','handlebars');

app.use(express.static(path.join(__dirname, 'src')));

/* PORT */
const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log("Server started at PORT: " + PORT);
})