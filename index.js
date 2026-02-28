const express = require("express");
const app = express();
const path = require("path")
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueid = crypto.randomUUID();
    cb(null, file.fieldname + '-' + uniqueid + file.originalname)
  }
})
const upload = multer({ storage: storage });

// Isso diz ao Express: "Tudo o que estiver na pasta src pode ser acessado pelo navegador"
app.use(express.static('src'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//init of handlebars config
const {engine} = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
//app.set('views', './views');
//end of handlebars config

app.get("/", (req, res) => {
res.render(__dirname + "/views/home");
})

app.get("/cadastro", (req, res)=>{
  res.render(__dirname + "/views/newproduct");
})

app.post("/validateupload", upload.array('imagens', 4), (req,res) =>{
  
  res.render(__dirname + "/views/result",{
    
    arquivos: req.files,
    dados: req.body
    
    
  })

});


app.listen(3000, ()=>{
console.log("servidor rodando na porta 3000");
})
