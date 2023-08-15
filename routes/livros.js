const express = require('express')
const router = express.Router()
const Livros = require('../models/livro')
const { default: mongoose } = require('mongoose')

//Getting all
router.get('/', async (req, res) => {
    try {
        const livros = await Livros.find()
        res.json(livros)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Getting one
router.get('/:id', getLivro, (req, res) => {
    res.json(res.livro)
})
//Creating one
router.post('/', async (req, res) => {
    const livro = new Livros({
        id: req.body.id,
        titulo: req.body.titulo,
        num_paginas: req.body.num_paginas,
        isbn: req.body.isbn,
        editora: req.body.editora,
    })

    try {
        const newLivro = await livro.save()
        res.status(201).json(newLivro)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Updating one
router.patch('/:id', getLivro, async (req, res) => {
    if (req.body.id != null) {
        res.livro.id = req.body.id      
    }
    if (req.body.titulo != null) {
        res.livro.titulo = req.body.titulo      
    }
    if (req.body.num_paginas != null) {
        res.livro.num_paginas = req.body.num_paginas      
    }
    if (req.body.isbn != null) {
        res.livro.isbn = req.body.isbn      
    }
    if (req.body.editora != null) {
        res.livro.editora = req.body.editora      
    }
    try {
        const updatedLivro = await res.livro.save()
        res.json(updatedLivro)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Deleting one
router.delete('/:id', getLivro, async (req, res) => {
    try {
        await Livros.deleteOne({id: res.livro.id})
        res.json({message: 'Livro deletado'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

async function getLivro(req, res, next){
    const id = req.params.id
    let livro

    try {
        livro = await Livros.findOne({ id: id })
        if (livro == null){
            return res.status(404).json({message: 'Livro não encontrado.'})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    res.livro = livro
    next()
}

module.exports = router