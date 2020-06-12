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
            var prioritarios = [];
            var naoPrioritarios = [];
            var i;
            for(i=0; i<docs.length; i++){
                if(docs[i].prioritario){
                    prioritarios.push(docs[i]);
                }else{
                    naoPrioritarios.push(docs[i]);
                }
            }
            res.render("tecnicos/pedidosNovos", {
                listaPaciente: prioritarios,
                listaP: naoPrioritarios
            });
        }
        else {
            console.log('Erro ao recuperar lista de pedidos novos:' + err);
        }
    });
});

router.get('/pedidos_novos/editarMin/:cod', (req, res) => {
    Paciente.findOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            res.render("tecnicos/editTesteMin", {
                paciente: doc
            });
        }
    });
});

router.get('/pedidos_novos/editarMinMin/:cod', (req, res) => {
    Paciente.findOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            res.render("tecnicos/editTesteMinMin", {
                paciente: doc
            });
        }
    });
});

//editar testes agendados 
router.get('/editar_teste/:cod_user/:pos_teste', (req, res) => {
    Paciente.findOne({cod: req.params.cod_user}, (err, doc) => {
        if (!err) {
            res.render("tecnicos/edit_Testes", {
                teste: doc.testes[req.params.pos_teste],
                paciente_cod: req.params.cod_user, 
                pos_teste: req.params.pos_teste,
            });
        }
    });
});

function updateTestes(req, res){
    const teste = new Teste();
    teste.testeStatus = req.body.testeStatus;
    teste.data = req.body.data;
    teste.resultadoTeste = req.body.resultadoTeste;
    //todo --> add pdf
    Paciente.findOneAndUpdate({ cod: req.params.cod_user, "testes.data": new Date(req.body.data)}, {$set: {"testes.$.testeStatus":teste.testeStatus, "testes.$.resultadoTeste":teste.resultadoTeste}}, (err, doc) => {
        if (!err) { 
            if(req.body.render == "Min"){
                res.redirect('/tecnicos/pedidos_novos/editarMin/' + req.params.cod_user);
            }else{
                res.redirect('/tecnicos/pedidos_novos/editarMinMin/' + req.params.cod_user);
            }
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/tecnicos/pedidos_novos/editar/", {
                    paciente: req.body
                });
            }else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

router.post('/editar_testes/:cod_user/:pos_teste', (req, res) => {
    updateTestes(req, res);
});


//Mudar o estado do paciente (suspeito, infetado, não infetado)
router.post('/mudar_estado', (req, res) => {
        updateEstadoPaciente(req, res);
});

//Função para fazer update do estado
function updateEstadoPaciente(req, res) {
    Paciente.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/tecnicos/pedidos_novos/editarMinMin/' + req.body.cod); 
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("tecnicos/editTesteMax", {
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
    const teste = new Teste();
    teste.testeStatus = req.body.testeStatus;
    teste.data = req.body.data;
    teste.resultadoTeste = req.body.resultadoTeste;
    //todo --> add pdf
    Paciente.findOneAndUpdate({ cod: req.body.cod }, {$push: {testes:teste}}, { new: true }, (err, doc) => {
        if (!err) { 
            if(req.body.render == "Min"){
                res.redirect('/tecnicos/pedidos_novos/editarMin/' + req.body.cod);
            }else{
                res.redirect('/tecnicos/pedidos_novos/editarMinMin/' + req.body.cod);
            }
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("tecnicos/editTesteMax", {
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
    Paciente.find((err, docs) => {     
        if (!err) {
            var i;
            var pacientes = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == ""){
                        pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                    }
                }
            }
            function Comparator(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            }
            pacientes = pacientes.sort(Comparator);
            res.render("tecnicos/agendados", {
                listaPaciente: pacientes
            });
        }else {
            console.log('Erro:' + err);
        }
    });
});

//EM ESPERA
//Mostrar testes a espera do resultado
router.get('/espera', (req, res) => {
    Paciente.find((err, docs) => {     
        if (!err) {
            var i;
            var pacientes = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == "Em espera"){
                        pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                    }
                }
            }
            function Comparator(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            }
            pacientes = pacientes.sort(Comparator);
            res.render("tecnicos/emEspera", {
                listaPaciente: pacientes
            });
        }else {
            console.log('Erro:' + err);
        }
    });
});

//REALIZADOS
//Mostrar testes já realizados e com resultado
router.get('/realizados', (req, res) => {
    Paciente.find((err, docs) => {     
        if (!err) {
            var i;
            var pacientes = [];
            var nao_infetados = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == "Realizado"){
                        if(docs[i].testes.length >= 2){
                            if(docs[i].testes[docs[i].testes.length-1].resultadoTeste == "Negativo" && docs[i].testes[docs[i].testes.length-2].resultadoTeste == "Negativo"){
                                nao_infetados.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                            }else{
                                pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                            }
                        }else{
                            pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                        }
                    }
                }
            }
            function Comparator(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            }
            pacientes = pacientes.sort(Comparator);
            nao_infetados = nao_infetados.sort(Comparator);
            res.render("tecnicos/realizados", {
                listaPaciente: pacientes,
                listaNaoInfetados: nao_infetados
            });
        }else {
            console.log('Erro:' + err);
        }
    });
});

//REMARCAÇÕES
router.get('/remarcacoes', (req, res) => {
    Paciente.find((err, docs) => {     
        if (!err) {
            var i;
            var pacientes = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == "Realizado"){
                        if(docs[i].testes.length >= 2){
                            if(docs[i].testes[docs[i].testes.length-1].resultadoTeste == "Negativo" && docs[i].testes[docs[i].testes.length-2].resultadoTeste == "Positivo"){
                                pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                            }
                        }else{
                            if(docs[i].testes.length == 1){
                                if(docs[i].testes[docs[i].testes.length-1].resultadoTeste == "Negativo"){
                                    pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                                }
                            }   
                        }
                    }
                }
            }
            function Comparator(a, b) {
                if (a[1] < b[1]) return -1;
                if (a[1] > b[1]) return 1;
                return 0;
            }
            pacientes = pacientes.sort(Comparator);
            res.render("tecnicos/remarcacoes", {
                listaPaciente: pacientes
            });
        }
        else {
            console.log('Erro:' + err);
        }
    });
});

module.exports = router;