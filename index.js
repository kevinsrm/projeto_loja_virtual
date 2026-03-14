const express = require("express");
const router = require("./routes");
const app = express();

//init of handlebars config
const {engine} = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
//app.set('views', './views');
//end of handlebars config

app.use("/", router);










app.listen(3000, ()=>{
console.log("servidor rodando na porta 3000");
})
