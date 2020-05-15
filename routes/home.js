const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

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

//PACIENTES
//fazer_pedido
router.get('/fazer_pedido', (req, res) => res.render('fazerPedido'));

//todo --> tratar cenas de info relevante
router.post('/receber_pedido', function(req,res,next){
    const paciente = new Paciente();
    paciente.cod = req.body.cod;
    paciente.name = req.body.name;
    paciente.age = req.body.age;
    paciente.sex = req.body.sex;
    paciente.sintomas = req.body.sintomas;
    paciente.estado = "suspeito";
    paciente.save((err, doc) => {
    console.log(err);
    if (!err){
        res.redirect('/');
    }else {
        if (err.name == 'ValidationError') {
             handleValidationError(err, req.body);
            res.render("/fazer_pedido", {
                paciente: req.body
            });
        }else{
            console.log('Erro a fazer insert: ' + err);
        }
    }
    });
});

//ver_pedido
router.post('/ver_pedidos', (req, res) => {
    //receber o código
    //enviar informação
    Paciente.findOne({cod: req.body.cod}, (err, doc) => {
        if (!err) {
            console.log(doc);
            res.render("verPedido", {
                paciente: doc
            });
        }
    });
});

module.exports = router;