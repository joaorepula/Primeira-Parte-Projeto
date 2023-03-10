const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const clientes = require('./routes/clientes')
//Requisição , Resposta e Next
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    //res.header('Access-Control-Allow-Origin,"*"');
    res.header('Acces-Control-Allow-Header',
    'Origin,X-Requrested-With,Content-Type,Accept,Authoritation');
    if(req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).send({});
      }
      next();
    })

app.use('/clientes',clientes);

//Sem acesso a outras rota
app.use((req,res,next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem:error.mensagem
        }
    })
})

module.exports = app;