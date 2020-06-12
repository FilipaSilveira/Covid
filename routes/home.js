const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');

router.get('/', (req, res) => {
    res.render('dashboard')
});

//PACIENTES
//fazer_pedido
router.get('/fazer_pedido', (req, res) => res.render('fazerPedido'));

//função Cod automático
async function createId() {
    return new Promise(function (resolve, reject) {
        Paciente.find((err, paciente) => {
            var lastid = 0;
            if(paciente.length>0) {
                lastid = paciente[0].cod;
            }
            lastid = lastid+1;
            if (lastid == undefined) {
                resolve(false);
            } else {
                if (lastid != undefined && lastid != null) {
                    resolve(lastid);
                } else {
                    resolve(false);
                }
            }
        }).sort({cod: -1});
    })
}

async function insertPaciente(req, res) {
    const paciente = new Paciente();
    var lastid = await createId();
    paciente.cod = lastid;
    paciente.name = req.body.name;
    paciente.age = req.body.age;
    paciente.sex = req.body.sex;
    if ( typeof req.body.info !== 'undefined' && req.body.info )
    {
        paciente.prioritario = true;
    }else{
        paciente.prioritario = false;
    }
    paciente.sintomas = req.body.sintomas;
    paciente.estado = "suspeito";
    paciente.save((err, doc) => {
    console.log(err);
    if (!err){
        res.redirect('/ver_pedido/' + lastid);
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
}

router.post('/receber_pedido', function(req,res,next){
    insertPaciente(req, res);
});

//ver_pedido
router.post('/ver_pedidos', (req, res) => {
    //receber o código
    //enviar informação
    Paciente.findOne({cod: req.body.cod}, (err, doc) => {
        if (!err) {
            res.render("verPedido", {paciente: doc});
        }
    });
});

router.get('/ver_pedido/:cod', (req, res) => {
    //receber o código
    //enviar informação
    Paciente.findOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            res.render("verPedido", {paciente: doc});
        }
    });
});

module.exports = router;