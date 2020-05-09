const express = require('express');
const router = express.Router();

router.get('/admin', (req, res) => {
    res.send("We are on admin.");
});

router.get('/admin/tecnicos', (req, res) => {
    res.send("We are on gerir tecnicos.");
});

router.get('/admin/informacoes', (req, res) => {
    res.send("We are on gerir informacoes.");
});

///id 

module.exports = router;
