const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tecnico = require('../models/users');

//pagina inicial do administrador
router.get('/', (req, res) => {
    res.render('administracao')
});

router.post('/', (req, res) => {
    updateAdminRecord(req, res);
});

//Gerir os Técnicos (adicionar, editar e remover)
router.get('/gerirTecnicos', (req, res) => {
    //res.render('gerirTecnicos/listaTecn')
    Tecnico.find({isAdmin: false}, (err,tecnicos) => {
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
    }).sort({cod: 1});
});

router.get('/addTecnico', (req, res) => {
    var tecnicos = {tecnicos: 1};
    res.render('gerirTecnicos/addOrEditTecn', tecnicos)
});

/*router.post('/addTecnico', (req, res) => {
    var tecnicos = {};
    console.log(req.body.cod);
    console.log(req.body.name);
    res.render('gerirTecnicos/addOrEditTecn', tecnicos)
});*/

router.post('/gerirTecnicos', (req, res) => {
    if (req.body.cod == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

async function insertRecord(req, res) {
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
                console.log('Erro a fazer insert: ' + err);
            }
        }
    });
}

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

function updateRecord(req, res) {
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

router.get('/gerirTecnicos/listaTecn', (req, res) => {
    Tecnico.find((err, docs) => {
        if (!err) {
            res.render("gerirTecnicos/listaTecn", {
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

router.get('/gerirTecnicos/delete/:cod', (req, res) => {
    Tecnico.deleteOne({cod: req.params.cod}, (err, doc) => {
        if (!err) {
            res.redirect('/admin/gerirTecnicos');
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
