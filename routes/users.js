var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    let isAuthenticated = req.isAuthenticated();
    let user = req.user;
    console.log('user: ', user);
    console.log('isAuthenticated: ', isAuthenticated);
    if (!isAuthenticated) {
        return res.redirect('login')
    }
    res.send('respond with a resource');
});

module.exports = router;
