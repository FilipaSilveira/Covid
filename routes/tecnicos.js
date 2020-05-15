const express = require('express');
const router = express.Router();
const Paciente = require('../models/paciente');
const Teste = require('../models/teste');

router.get('/', (req, res) => {
    res.render('tecnicos/tecnicos');
});

//PEDIDOS NOVOS
//Ver pedidos novos
router.get('/pedidos_novos', (req, res) => {
    Paciente.find({testes: {$size: 0}}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render("tecnicos/pedidosNovos", {
                listaPaciente: docs
            });
        }
        else {
            console.log('Erro ao recuperar lista de pedidos novos:' + err);
        }
    });
});


/*Editar pedidos novos, neste caso irá ser atribuida uma data
para a realiação do teste*/
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


//Mudar o estado do paciente (suspeito, infetado, não infetado)
router.post('/mudar_estado', (req, res) => {
        updateEstadoPaciente(req, res);
});

//Função para fazer update do estado
function updateEstadoPaciente(req, res) {
    console.log(req.body.cod);
    Paciente.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/tecnicos/pedidos_novos/editar/' + req.body.cod); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("tecnicos/editTeste", {
                    paciente: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

//Adicionar um teste
router.post('/adicionar_teste', (req, res) => {
    updateTeste(req, res);
});

//Fazer o update 
function updateTeste(req, res) {
    console.log(req.body.cod);
    const teste = new Teste();
    teste.testeStatus = req.body.testeStatus;
    teste.data = req.body.data;
    teste.resultadoTeste = req.body.resultadoTeste;
//todo --> add pdf
    Paciente.findOneAndUpdate({ cod: req.body.cod }, {$push: {testes:teste}}, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/tecnicos/pedidos_novos/editar/' + req.body.cod); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("tecnicos/editTeste", {
                    paciente: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}


//AGENDADOS
//Mostrar testes agendados
router.get('/agendados', (req, res) => {
    //Paciente.find({testes: {$elemMatch: {date: {$gte: (new Date()).toISOString()}}}}, (err, docs) => {
    Paciente.find({'testes.date': {$gte: (new Date()).toISOString()}}, (err, docs) => {     
        if (!err) {
            console.log(docs);
            console.log((new Date()).toISOString());
            res.render("tecnicos/agendados", {
                listaPaciente: docs
            });
        }
        else {
            console.log('Erro:' + err);
        }
    });
});


//EM ESPERA
//Mostrar testes a espera do resultado
router.get('/espera', (req, res) => {
    Paciente.find({testes: {$gt: 0}}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render("tecnicos/emEspera", {
                listaPaciente: docs
            });
        }
        else {
            console.log('Erro' + err);
        }
    });
});


//REALIZADOS
//Mostrar testes já realizados e com resultado
router.get('/realizados', (req, res) => {
    Paciente.find({testes: {$gt: 0}}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render("tecnicos/realizados", {
                listaPaciente: docs
            });
        }
        else {
            console.log('Error in retrieving lista de pacientes :' + err);
        }
    });
});

//id

module.exports = router;