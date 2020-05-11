const express = require('express');
const router = express.Router();
//const Home = require('../models/home');

router.get('/', (req, res) => {
    res.render('login')
});

/*router.post('/', async (req, res) =>{
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
});*/

//pacientes
//fazer_pedido
router.get('/fazer_pedido', (req, res) => res.render('fazerPedido'));

router.post('/receber_pedido', function(req,res,next){
    const paciente = {
        cod: req.body.cod,
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        sintomas: req.body.sintomas
    };
});

//ver_pedido
router.get('/ver_pedido', (req, res) => {
    res.render('verPedido');
});

router.post('/ver_pedido', (req, res) => {
    //receber o código
    //enviar informação
    res.redirect('verPedido');
});

module.exports = router;