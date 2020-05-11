const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//pagina inicial do administrador
router.get('/', (req, res) => {
    res.render('administracao')
});

//Gerir os Técnicos (adicionar, editar e remover)
router.get('/gerirTecnicos', (req, res) => {
    res.render('gerirTecnicos/listaTecn')
});

router.post('/gerirTecnicos', (req, res) => {
    if (req.body.cod == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    const tecnicos = new Tecnicos();
        gerirTecnicos.cod = req.body.cod;
        gerirTecnicos.name = req.body.name;
        gerirTecnicos.age = req.body.age;
        gerirTecnicos.sex = req.body.sex;
        gerirTecnicos.email = req.body.email;
        gerirTecnicos.mobile = req.body.mobile;
        gerirTecnicos.city = req.body.city;
        gerirTecnicos.save((err, doc) => {
        if (!err)
            res.redirect('/gerirTecnicos/listaTecn');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/gerirTecnicos/addOrEditTecn", {
                    gerirTecnicos: req.body
                });
            }
            else
                console.log('Erro a fazer insert: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Tecnicos.findOneAndUpdate({ cod: req.body.cod }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('/gerirTecnicos/listaTecn'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("/gerirTecnicos/addOrEditTecn", {
                    gerirTecnicos: req.body
                });
            }
            else
                console.log('Erro a fazer update: ' + err);
        }
    });
}

router.get('/listaTecn', (req, res) => {
    Tecnicos.find((err, docs) => {
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
    Tecnicos.findById(req.params.cod, (err, doc) => {
        if (!err) {
            res.render("g/erirTecnicos/addOrEditTecn", {
                gerirTecnicos: doc
            });
        }
    });
});

router.get('/gerirTecnicos/delete/:cod', (req, res) => {
    Tecnicos.findByIdAndRemove(req.params.cod, (err, doc) => {
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
