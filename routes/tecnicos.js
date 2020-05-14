const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');
const Teste = require('../models/teste');

router.get('/', (req, res) => {
    res.render('tecnicos/tecnicos');
});

router.get('/pedidos_novos', (req, res) => {
    Paciente.find({testes: {$size: 0}}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render("tecnicos/pedidosNovos", {
                listaPaciente: docs
            });
        }
        else {
            console.log('Error in retrieving lista de pacientes :' + err);
        }
    });
});

router.get('/pedidos_novos/editar/:cod', (req, res) => {
    Paciente.findOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            console.log(doc);
            res.render("tecnicos/editTeste", {
                paciente: doc
            });
        }
    });
});

router.post('/mudar_estado', (req, res) => {
        updateEstadoPaciente(req, res);
});

function updateEstadoPaciente(req, res) {
    console.log(req.body.cod);
    Paciente.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/tecnicos/pedidos_novos/editar/' + req.body.cod); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("gerirTecnicos/addOrEditTecn", {
                    tecnicos: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

router.get('/agendados', (req, res) => {
    res.send("We are on tecnicos agendados.");
});

router.get('/espera', (req, res) => {
    res.send("We are on tecnicos espera.");
});

router.get('/realizados', (req, res) => {
    res.send("We are on  tecnicos realizados.");
});

//id

module.exports = router;