const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tecnico = require('../models/users');
const Paciente = require('../models/paciente');

//pagina inicial do administrador
router.get('/', (req, res) => {
    res.render('administracao')
});


//para mudar a password do admin
router.post('/', (req, res) => {
    updateAdminRecord(req, res);
});


//Gerir os Técnicos (adicionar, editar e remover)
router.get('/gerirTecnicos', (req, res) => {
    Tecnico.find({isAdmin: false}, (err,tecnicos) => {
        if(err){
            next(err);
        }else{
            res.render('gerirTecnicos/listaTecn', {
                listaTecn: tecnicos,
            });
        }
    }).sort({cod: 1});
});

//adicionar
router.get('/addTecnico', (req, res) => {
    var tecnicos = {tecnicos: 1};
    res.render('gerirTecnicos/addOrEditTecn', tecnicos)
});

//adicionar ou editar
router.post('/gerirTecnicos', (req, res) => {
    if (req.body.cod == '')
        insertTecnico(req, res);
        else
        updateTecnico(req, res);
});

//função para adicionra tecnicos
async function insertTecnico(req, res) {
    const tecnicos = new Tecnico();
        tecnicos.cod = req.body.cod;
        tecnicos.name = req.body.name;
        tecnicos.age = req.body.age;
        tecnicos.sex = req.body.sex;
        tecnicos.email = req.body.email;
        tecnicos.mobile = req.body.mobile;
        tecnicos.city = req.body.city;
        tecnicos.password = req.body.password;
        var lastid = await createId();
        tecnicos.cod = lastid;
        tecnicos.save((err, doc) => {
            console.log(err);
        if (!err){
            res.redirect('/admin/gerirTecnicos');
        }else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("gerirTecnicos/addOrEditTecn", {
                    tecnicos: req.body
                });
            }else{
                console.log('Erro ao inserir: ' + err);
            }
        }
    });
}

//função para criar o Cod dos tecnicos
async function createId() {
    /*Tecnico.find((err,tecnicos) => {
        console.log(tecnicos);
        lastid = tecnicos[0].cod;
        console.log(lastid);
    }).sort({cod: -1});*/

    return new Promise(function (resolve, reject) {
        Tecnico.find((err, tecnicos) => {
            console.log(tecnicos);
            var lastid = 0;
            if(tecnicos.length>0) {
                lastid = tecnicos[0].cod;
            }
            lastid = lastid+1;
            console.log(lastid);
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

//função para editar tecnicos
function updateTecnico(req, res) {
    Tecnico.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/admin/gerirTecnicos'); }
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

//fazer find de admin --> mudar pass e mandar body todo para update normal
//Editar a password do ADMIN
function updateAdminRecord(req, res) {
    Tecnico.findOneAndUpdate({ cod: req.body.cod }, {password: req.body.password}, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/admin/gerirTecnicos'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("adminEdit", {
                    tecnicos: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

//Mostra a lista de Tecnicos
router.get('/gerirTecnicos/listaTecn', (req, res) => {
    Tecnico.find((err, docs) => {
        if (!err) {
            res.render("gerirTecnicos/listaTecn", {
                listaTecn: docs
            });
        }
        else {
            console.log('Erro ao recuperar lista de técnicos :' + err);
        }
    });
});

//Função para validar erros
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'cod':
                body['codError'] = err.errors[field].message;
                break;
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

//Editar tecnicos pelo código
router.get('/gerirTecnicos/editar/:cod', (req, res) => {
    Tecnico.findOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            console.log(doc);
            res.render("gerirTecnicos/addOrEditTecn", {
                tecnicos: doc
            });
        }
    });
});

//Eliminar tecnicos pelo código
router.get('/gerirTecnicos/delete/:cod', (req, res) => {
    Tecnico.deleteOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            res.redirect('/admin/gerirTecnicos');
        }
        else { console.log('Erro a apagar técnico :' + err); }
    });
});

//ver informações pedidas no enunciado
router.get('/informacoes', (req, res) => {
    Paciente.find((err, docs) => {     
        if (!err) {
            console.log(docs);
            var i;
            var pacientes = 0;
            var d = new Date();
            d.setDate(d.getDate());
            d.setHours(0,0,0,0);
            console.log(d);
            for(i=0; i<docs.length; i++){
                if(docs[i].testes.length > 0){
                    if(docs[i].testes[docs[i].testes.length-1].data >= d && docs[i].testes[docs[i].testes.length-1].testeStatus == "Realizado"){
                        //pacientes.push([docs[i], docs[i].testes[docs[i].testes.length-1].data]);
                        if(docs[i].testes.length >= 2){
                            if(docs[i].testes[docs[i].testes.length-1].resultadoTeste == "Negativo" && docs[i].testes[docs[i].testes.length-2].resultadoTeste == "Negativo"){
                               
                            }else{
                                pacientes++;
                            }
                        }else{
                            pacientes++;
                        }
                    }
                }
            }
            res.render("infoGerais", {
                countInfetados: pacientes
            });
        }
        else {
            console.log('Erro:' + err);
        }
    });
});

///id 

module.exports = router;
