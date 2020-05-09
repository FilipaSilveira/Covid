const express = require('express');
const router = express.Router();
const Home = require('../models/home');

router.get('/', (req, res) => {
    res.send("We are on home.");
});

router.get('/fazer_pedido', (req, res) => res.render('fazerPedido'));

router.post('/', async (req, res) =>{
    const post = new Home({
        user: req.body.user,
        pass: req.body.pass
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err });
    }
});

//fazer_pedido e /ver_pedido

//fazer_pedido
router.post('/receber_pedido', function(req,res,next){
    const paciente = {
        cod: req.body.cod,
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        sintomas: req.body.sintomas
    };
});

module.exports = router;