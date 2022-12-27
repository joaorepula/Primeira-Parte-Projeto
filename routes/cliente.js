const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

db.on("error",console.log.bind(console,'Erro de conexão'))
db.once("open",() => {
    console.log('conexao feita com sucesso')
})

router.get('/',(req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            `SELECT id, 
            nome, 
            email,
            senha,
            data,
            ativo,
            avatar
            FROM cliente`,
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}
                const response = {
                    cliente: result.map(pedidos => {
                        return {
                            id:cliente.id,
                            nome: cliente.nome,
                            base: {
                                cliente:cliente.email,
                                data:cliente.data,
                                preativoco:cliente.ativo
                            },
                            
                            request: {
                                tipo:'GET',
                                descricao:'verificando get',
                                url:'http://localhost:3000/cliente/' 
                            }
                        }
                    })
                }
                return res.status(200).send({response:result})
            }
        )
    })
});

router.post('/', (req,res,next) => {

    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send ({error : error}) }
        conn.query('SELECT * FROM cliente where id =?',
        [req.body.id],
        (error,result,field) =>{
            conn.release();
        if(error) {return res.status(500).send({error:error})}
        if(result.length == 0) {
            return res.status(404).send({
                mensagem:'Cliente não encontrado'
                })
            }
            conn.query(
                'INSERT INTO cliente(nome,email,senha,avatar,data,ativo) VALUES (?,?)',
            [req.body.id, req.body.quantidade],
            (error, result,field) =>{
                conn.release();
                if(error){
                    return res.status(500).send({error:error,});
                }
                const response = {
                    mensagem : "Cliente cadastrado com sucesso",
                    clienteCriado:{
                        nome:req.body.nome,
                        quantidade: req.body.email,
                        senha: req.body.senha,
                        avatar: req.body.avatar,
                        data: req.body.data,
                        ativo: req.body.ativo,
                        request: {
                            tipo:'GET',
                            descricao:'End point',
                            url:'http://localhost:3000/clienteCadastro/'
                        }
                    }
                }
               return res.status(201).send ({response})
            })

        })
    })
})

router.get('/:id',(req,res,next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            'SELECT * FROM cliente WHERE id = ?;',
            [req.params.id],
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}

                if(result.length == 0){
                    return res.status(404).send({
                    mensagem:"Não foi encontrado cliente com esse ID"
                })
            }
                const response = {
                    pedido:{
                        id:result[0].id,
                        nome: result[0].nome,
                        email: result[0].email,
                        senha: result[0].senha,
                        avatar: result[0].avatar,
                        data: result[0].data,
                        ativo: result[0].ativo,
                        request: {
                            tipo:'GET',
                            descricao:'Retorna por id',
                            url:'http://localhost:3000/cliente/:id'
                        }
                    }
                }
               return res.status(200).send ({response})
            }
        )
    })
});

router.patch('/:id',(req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            `UPDATE cliente SET nome =?,
             email = ?,
             senha = ?,
             avatar = ?,
             data = ?,
             ativo = ?,
             where id = ?`,
             [
                req.body.nome,
                req.body.email,
                req.body.senha,
                req.body.avatar,
                req.body.data,
                req.body.ativo,
                req.params.id
             ],
            (error,result,fields) => {
                conn.release();
                if(error) {return res.status(500).send({error:error})}
                const response = {
                    mensagem : "Cliente Atualizado com sucesso",
                    clienteAtualizado:{
                        id:result.id,
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                        avatar: req.body.avatar,
                        data: req.body.data,
                        ativo: req.body.ativo,
                        request: {
                            tipo:'PATCH',
                            descricao:'Altera os dados',
                            url:'http://localhost:3000/cliente/:id' 
                        }
                    }
                }
                
                res.status(202).send({response});
            }
        )
    });
});

router.delete('/',(req,res,next)=>{
    let id;
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            `DELETE FROM cliente 
             where id = ?`,
             [
                id =  req.body.id
             ],
            (error,result,fields) => {
                conn.release();
                if(id != 0) {
                    res.status(400).send({mmensagem:"Cliente com ID ativo !"})
                }
                if(error) {return res.status(500).send({error:error})}
                const response ={
                    mensagem : 'Cliente removido com sucesso',
                    request: {
                        tipo:'Delete',
                        descricao:'Deleta cliente',
                        url:'http://localhost:3000/cliente',
                        body: {
                            id:'Number'
                        }
                    }

                }
                res.status(202).send({
                    mensagem:"Cliente deletado com sucesso"
                });
            }
        )
    });
})
  

module.exports = router;