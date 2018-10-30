let express = require('express');
let logger = require('morgan');
let port = process.env.PORT || 3000;
let secret = process.env.SECRET || 'SECRET_KEY';
let bodyParser = require('body-parser');
let router = express.Router();
let app = express();
let jwt = require('jsonwebtoken');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.post('/authenticate', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if(username === 'admin' && password === 'admin') {
        const payload = {
            username: 'admin'
        };
        let token = jwt.sign(payload, secret, {
            expiresIn: "300s"
        });
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    }
});

router.use(function (req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                return res.status(403).send(err);
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({message: "Not authorized"});
    }
});

router.get('/data', function(req, res, next) {
    res.send({message: "Some useful data"});
});

router.get('/', function(req, res, next) {
    res.send({message: "Hello world!"});
});

app.use('/api', router);

app.listen(port);

module.exports = app;
