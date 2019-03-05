/* Dependencies */
const 
    express = require('express'),
    path = require('path');
require('dotenv').config();

/* Express */
const app = express();
app.use(express.static(path.join(__dirname, 'app')));

/* PORT */
const PORT = process.env.PORT || 8001;
/* require('./app/app')(app); */

app.listen(PORT, () => {
    console.log("Server started at PORT: " + PORT);
})