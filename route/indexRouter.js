const express = require('express');
const app = express();
const router = express.Router();
const ctrl = require('../controllers/ctrl.js');
//home page
router.get('/', (req, res) => {
    res.render('index');
});
//user search
router.get('/search', ctrl.search);

//to fetch forecast and historical data
router.get('/forecast', ctrl.forecast);
router.get('/historical', ctrl.historical);

module.exports = router;