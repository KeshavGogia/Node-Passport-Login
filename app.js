const express = require('express');
const expressLayouts = require('express-ejs-layouts');



const app = express();

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');


//Route
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
    } else {
        console.log(`Server listening on Port ${PORT}`);
    }
});
