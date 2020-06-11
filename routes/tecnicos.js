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

//editar testes agendados 
router.get('/editar_teste/:cod_user/:pos_teste', (req, res) => {
    Paciente.findOne({cod: req.params.cod_user}, (err, doc) => {
        if (!err) {
            //console.log(doc.testes[req.params.pos_teste]);
            console.log("cscnncv");
            console.log( doc.testes[req.params.pos_teste].data);
            res.render("tecnicos/edit_Testes", {
                teste: doc.testes[req.params.pos_teste],
                paciente_cod: req.params.cod_user, 
                pos_teste: req.params.pos_teste,
            });
        }
        else {
            console.log("nkcbewubv");
        }
    });
});

function updateTestes(req, res){
    //console.log("-------------");
    //console.log(req.params.cod_user);
    //console.log(req.body.data);
    //console.log(new Date(req.body.data));
    const teste = new Teste();
    teste.testeStatus = req.body.testeStatus;
    teste.data = req.body.data;
    teste.resultadoTeste = req.body.resultadoTeste;
//todo --> add pdf
    Paciente.findOneAndUpdate({ cod: req.params.cod_user, "testes.data": new Date(req.body.data)}, {$set: {"testes.$.testeStatus":teste.testeStatus, "testes.$.resultadoTeste":teste.resultadoTeste}}, (err, doc) => {
        if (!err) { 
            console.log("funcionou");
            res.redirect('/tecnicos/pedidos_novos/editar/' + req.params.cod_user); 
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/tecnicos/pedidos_novos/editar/", {
                    paciente: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

router.post('/editar_testes/:cod_user/:pos_teste', (req, res) => {
    console.log("iebefb");
    updateTestes(req, res);
    console.log("iebefb");
})


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
    Paciente.find((err, docs) => {     
        if (!err) {
            console.log(docs);
            var i;
            var pacientes = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            console.log(d);
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
              console.log(pacientes);
              
            console.log((new Date()).toISOString());
            res.render("tecnicos/agendados", {
                listaPaciente: pacientes
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
    Paciente.find((err, docs) => {     
        if (!err) {
            console.log(docs);
            var i;
            var pacientes = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            console.log(d);
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
              console.log(pacientes);
              
            console.log((new Date()).toISOString());
            res.render("tecnicos/agendados", {
                listaPaciente: pacientes
            });
        }
        else {
            console.log('Erro:' + err);
        }
    });
});


//REALIZADOS
//Mostrar testes já realizados e com resultado
router.get('/realizados', (req, res) => {
    Paciente.find((err, docs) => {     
        if (!err) {
            console.log(docs);
            var i;
            var pacientes = [];
            var nao_infetados = [];
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            console.log(d);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == "Realizado"){
                        pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                        if(docs[i].testes.length >= 2){
                            if(docs[i].testes[docs[i].testes.length-1].resultadoTeste == "Negativo" && docs[i].testes[docs[i].testes.length-2].resultadoTeste == "Negativo"){
                                nao_infetados.push(docs[i]);
                            }else{
                                pacientes.push(docs[i]);
                            }
                        }else{
                            pacientes.push(docs[i]);
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
              console.log(pacientes);
              
            console.log((new Date()).toISOString());
            res.render("tecnicos/agendados", {
                listaPaciente: pacientes
            });
        }
        else {
            console.log('Erro:' + err);
        }
    });
});

//id

module.exports = router;