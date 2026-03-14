const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });
var session = require('express-session')

router.use(session({
  secret: 'sdfx8512',
  resave: false,
  saveUninitialized: true,
  cookie:{
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
  }
}))

const multer = require("multer");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME 
});

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
router.use(express.static('src'));
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", (req, res) => {
  if(req.session.isLoged){
res.render(__dirname + "/views/home", {
  userId: req.session.userId,
  nome: req.session.userName,
  email: req.session.userEmail,
  isLoged: req.session.isLoged
});
}
else{
  res.render(__dirname + "/views/login");
}
})

router.get("/cadastro", (req, res)=>{
  res.render(__dirname + "/views/newproduct");
})

router.post("/cadastrouser", async (req, res)=>{
  try{
  const {nome, email, senha, senhadois} = req.body;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(senha, salt, 64).toString('hex');
  const sql = "INSERT INTO usuarios (nome, email, senha, salt) VALUES (?, ?, ?, ?)";
  
  const [result] = await pool.execute(sql, [nome, email, hash, salt]);
  if(result && result.insertId){
  //const {name, emailUser} = result[0]
  req.session.userId = result.insertId;
  req.session.userName = nome;
  req.session.userEmail = email;
  req.session.isLoged = true;
  }

  if(req.session.isLoged){
    return res.redirect("/")
  }
  res.status(400).send("erro ao processar cadastro")
  }
  catch(err){
    res.status(500).send(err.message);
  }
})

router.post("/loginuser", async (req, res) =>{
  try{
    console.log("Dados recebidos:", req.body);

    if (!req.body || !req.body.email) {
      return res.status(400).send("Dados do formulário não recebidos corretamente.");
    }
  const {email, senha} = req.body;
  
  let sql = await "SELECT user_id, nome, email, senha, salt FROM usuarios WHERE email = ?";
  
  let [result] = await pool.execute(sql, [email]);
  if(result.length === 0){
return res.render(__dirname + "/views/login", { error: "Usuário não encontrado" });
  }
  let {user_id, nome, email: email2, senha: senhaDoBanco, salt} = result[0];
  
  const hashedPassword = crypto.scryptSync(senha, salt, 64).toString('hex');
  if(hashedPassword === senhaDoBanco){
    //logica pra logar o usuario
    req.session.isLoged = true;
    req.session.userId = user_id;
    req.session.userName = nome;
    req.session.userEmail = email2;
    return req.session.save(() => {
        res.redirect("/");
    });
  }
  else{
return res.render(__dirname + "/views/login", { error: "Usuário ou senha incorretos" })
  }
  }
  catch(err){
    res.status(500).send(`erro : ${err.message}`)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Erro ao sair');
    res.redirect('/');
  });
});


router.get("/login", (req,res)=>{
  if(req.session.isLoged){
    res.redirect("/");
  }
  else{
  res.render(__dirname + "/views/login");
  }
})
router.post("/validateupload", upload.array('imagens', 4), (req,res) =>{
  
  res.render(__dirname + "/views/result",{
    
    arquivos: req.files,
    dados: req.body
    
    
  })

});

/*
router.get("/checkuser/:nome", async (req,res)=>{
  try{
  let name = req.params.nome;
  let sql = await `SELECT * FROM usuarios WHERE nome = ?`;
  let [rows] = await pool.execute(sql, [name]);
  res.send(rows[0].id);
  }
  catch(err){
    res.status(500).send(err)
  }
})
*/
router.post("/validacadastro", async (req, res)=>{
  try{
  const {nome, email, senha} = req.body;
  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  const [rows] = await pool.execute(sql, [nome, email, senha]);
  res.status(201).json({
    message: "usario cadastrado",
    id: rows.insertId
  });
  }
  catch(err){
    res.status(500).json({
      "erro": err.message
    });
  }
})

module.exports = router;