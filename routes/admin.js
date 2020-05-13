const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tecnico = require('../models/users');

//pagina inicial do administrador
router.get('/', (req, res) => {
    res.render('administracao')
});

//Gerir os Técnicos (adicionar, editar e remover)
router.get('/gerirTecnicos', (req, res) => {
    //res.render('gerirTecnicos/listaTecn')
    Tecnico.find((err,tecnicos) => {
        if(err){
            next(err);
        }else{
            //res.json(users);
            //resultArray = users.slice();
            //console.log(users);
            res.render('gerirTecnicos/listaTecn', {
                listaTecn: tecnicos,
                //email:req.user.email
            });
        }
    });
});

router.get('/addTecnico', (req, res) => {
    var gerirTecnicos = {};
    res.render('gerirTecnicos/addOrEditTecn', gerirTecnicos)
});

router.post('/addTecnico', (req, res) => {
    var gerirTecnicos = {};
    console.log(req.body.cod);
    console.log(req.body.name);
    res.render('gerirTecnicos/addOrEditTecn', gerirTecnicos)
});

router.post('/gerirTecnicos', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.cod);
    if (req.body.cod == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    const tecnicos = new Tecnico();
        tecnicos.cod = req.body.cod;
        tecnicos.name = req.body.name;
        tecnicos.age = req.body.age;
        tecnicos.sex = req.body.sex;
        tecnicos.email = req.body.email;
        tecnicos.mobile = req.body.mobile;
        tecnicos.city = req.body.city;
        tecnicos.password = req.body.password;
        var lastid = 0;
        Tecnico.find((err,tecnicos) => {
            console.log(tecnicos);
            lastid = tecnicos[0].cod;
            console.log(lastid);
        }).sort({cod: -1});
        lastid = lastid + 1;
        tecnicos.save((err, doc) => {
            console.log(err);
        if (!err)
            res.redirect('/admin/gerirTecnicos');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("gerirTecnicos/addOrEditTecn", {
                    tecnicos: req.body
                });
            }
            else
                console.log('Erro a fazer insert: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Tecnico.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('gerirTecnicos/listaTecn'); }
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

router.get('/gerirTecnicos/listaTecn', (req, res) => {
    Tecnico.find((err, docs) => {
        if (!err) {
            res.render("/gerirTecnicos/listaTecn", {
                listaTecn: docs
            });
        }
        else {
            console.log('Error in retrieving lista de técnicos :' + err);
        }
    });
});

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

router.get('/gerirTecnicos/:cod', (req, res) => {
    Tecnico.findById(req.params.cod, (err, doc) => {
        if (!err) {
            res.render("/gerirTecnicos/addOrEditTecn", {
                tecnicos: doc
            });
        }
    });
});

router.get('/gerirTecnicos/delete/:cod', (req, res) => {
    Tecnico.findByIdAndRemove(req.params.cod, (err, doc) => {
        if (!err) {
            res.redirect('/gerirTecnicos/listaTecn');
        }
        else { console.log('Erro a apagar técnico :' + err); }
    });
});

/*router.post('/gerirTecnicos', function(req,res,next){
    const tecnicos = {
        cod: req.body.cod,
        name: req.body.name,
        age: req.body.age,
        sex: req.body.sex,
        email: req.body.email,
        mobile: req.body.mobile,
        city: req.body.city
    };
});*/

//ver informações pedidas no enunciado
router.get('/informacoes', (req, res) => {
    res.render('infoGerais')
});

///id 

module.exports = router;
