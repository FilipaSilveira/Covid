const express = require('express');
const router = express.Router();
const Home = require('../modules/home');

router.get('/', (req, res) => {
    res.send("We are on home.");
});

router.post('/', async (req, res) =>{
    const post = new Home({
        user: req.body.user,
        pass: req.body.pass
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;