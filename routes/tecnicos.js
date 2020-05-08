const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("We are on tecnicos.");
});

router.get('/pedidos_novos', (req, res) => {
    res.send("We are on tecnicos pedidos novos.");
});

router.get('/agendados', (req, res) => {
    res.send("We are on tecnicos agendados.");
});

router.get('/espera', (req, res) => {
    res.send("We are on tecnicos espera.");
});

router.get('/realizados', (req, res) => {
    res.send("We are on  tecnicos realizados.");
});

module.exports = router;