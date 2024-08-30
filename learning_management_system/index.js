const express = require('express');
const app = express();
const routes = require('./routes.js');
const fileUpload = require('express-fileupload');
const mongo = require('./config/database')


mongo()
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
}));
app.use("/", routes);

app.get("*", (req, res) => {
    res.send("Page not found")
});

app.listen(3002);