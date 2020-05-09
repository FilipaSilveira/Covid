const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("We are on admin.");
});

router.get('/tecnicos', (req, res) => {
    res.send("We are on gerir tecnicos.");
});

router.get('/informacoes', (req, res) => {
    res.send("We are on gerir informacoes.");
});

///id 

module.exports = router;
