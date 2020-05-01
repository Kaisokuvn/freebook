"use strict"

require('dotenv').config();
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");

const app = express();
const port = process.env.PORT || 5000;
app.set("view engine", "ejs");
app.set("views", __dirname+"/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static("public"));

const uri = process.env.DB_URI;
mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open",() => {
    console.log("connect to database")
});

app.use("/", indexRouter);

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`);
})