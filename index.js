const express = require('express');
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const bodyParser = require("body-parser");
const { urlencoded } = require('body-parser');
const Resposta = require("./database/Resposta");

connection
    .authenticate()
    .then(() => {
        console.log("conectado com o banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

app.use(urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.use(express.static('public'));

app.get("/",(req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ['id','DESC']
    ]}).then(perguntas => {
        res.render('index',{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar",(req,res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta",(req, res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    });
});

app.get("/pergunta/:id",(req,res) => {
    var id = req.params.id;
    
    Pergunta.findOne({
        where: {id: id}
    }).then(perguntas => {
        if(perguntas != undefined) {
            Resposta.findAll({
                where: {perguntaId: perguntas.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    perguntas: perguntas,
                    respostas: respostas
                })
            
            });
        }else{
            res.redirect("/")
        }
    })
})

app.post("/salvaresposta",(req,res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })
})


app.listen(8181, () => {console.log("servidor rodando!");})
