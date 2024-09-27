const express = require("express");
const tasksRoute = require("./routes/tasks");
const errorHandler = require("./middleware/error_handler");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/tasks', tasksRoute);
app.use(errorHandler);
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;