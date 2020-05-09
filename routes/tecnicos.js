const express = require('express');
const router = express.Router();

router.get('/tecnicos', (req, res) => {
    res.send("We are on tecnicos.");
});

router.get('/tecnicos/pedidos_novos', (req, res) => {
    res.send("We are on tecnicos pedidos novos.");
});

router.get('/tecnicos/agendados', (req, res) => {
    res.send("We are on tecnicos agendados.");
});

router.get('/tecnicos/espera', (req, res) => {
    res.send("We are on tecnicos espera.");
});

router.get('/tecnicos/realizados', (req, res) => {
    res.send("We are on  tecnicos realizados.");
});

//id

module.exports = router;