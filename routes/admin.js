const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Categoria") //requisitando para a pasta models o arquivo Categoria.js
const Categoria = mongoose.model("categorias")

router.get('/', (req,res) => {
    res.render("admin/index")
})

router.get('/posts', (req,res) => {
    res.send("Pagina de posts")
})

router.get('/categorias',(req,res) => {
    //listar as categorias
    Categoria.find().then((categorias) => {
        res.render('admin/categorias', {categoria: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
    })
})

router.get('/categorias/add', (req,res) => {
    res.render("admin/addcategorias")
})

router.get('/categorias/edit/:id', (req,res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render('admin/editarcategoria', {categoria: categoria})
    }).catch((err) => {
        flash("error_msg", "Essa categoria nao existe")
    })
    
})

router.post("/categorias/editada/", (req, res) => {
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'nome invalido'})
    }if(!req.body.slug || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Slug invalido"})
    }if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequeno"})
    }if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug    
            categoria.save().then(() => {
                req.flash("success_msg", "categoria editada com sucesso")
                res.redirect("/admin/categorias")
            })
        }).catch((err) => {
            req.flash("error_msg", "Categoria nao encontrada")
            res.redirect("/admin/categorias")
        })
    }

})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar categoria" + err)
        res.redirect("/admin/categorias")
    })
})

router.get('/postagens', (req, res) => {
    
})

router.post('/categorias/nova', (req,res) => {
    //validando o formulario
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'nome invalido'})
    }if(!req.body.slug || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Slug invalido"})
    }if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequeno"})
    }if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        //adicionando ao banco de dados
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria cadastrada com sucesso")
            console.log("categoria cadastrada com sucesso")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "Erro ao cadastrar categoria")
            console.log("Erro:" + err)
            res.redirect("/admin")
        })
    }

    
})
    module.exports = router