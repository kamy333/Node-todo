var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');
var bcrypt = require('bcryptjs');

var app = express();
var PORT = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [];

app.get('/', function (req, res) {
    res.send(`ToDo API Root 2nd commit
    <p><a href="/todos">ToDos</a></p>`);

});

app.use(bodyParser.json());

app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === "true") {
        where.completed = true;

    } else if (query.hasOwnProperty('completed') && query.completed === "false") {
        where.completed = false;
    }


    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {$like: '%' + query.q + '%'};
    }

    // console.log({where: where});


    //noinspection JSUnresolvedFunction
    db.todo.findAll({where: where}).then(function (todos) {

        res.json(todos);
    }).catch(function (e) {
        return res.status(500).json(e);
    });


});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {

        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).json({notFound: '404 could not found toDo item no ' + req.params.id});

        }

    }).catch(function (e) {
        return res.status(500).json(e)

    });


});

app.post('/todos', function (req, res) {

    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).json({error: 'validation'});
    }

    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON())
    }).catch(function (e) {
        res.status(400).send(e);
    });


});

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);


    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({error: 'No todo item with id: ' + todoId});
        } else {
            res.status(204).send();
        }

    }).catch(function (e) {
        res.status(500).send();
    });


});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};


    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }


    db.todo.findById(todoId).then(function (todo) {
        if (todo) {
            todo.update(attributes).then(function (todo) {
                res.json(todo.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    });


});


app.get('/users', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.email = {$like: '%' + query.q + '%'};
    }

    // console.log({where: where});


    //noinspection JSUnresolvedFunction
    db.user.findAll({where: where}).then(function (users) {

        users.forEach(function (user) {
            res.json(user.toPublicJSON());

        });
        // res.json(users.toPublicJSON());

        // res.json(users);
    }).catch(function (e) {
        return res.status(500).json(e);
    });


});

app.post('/users', function (req, res) {

    var body = _.pick(req.body, 'email', 'password');

    if (!_.isString(body.email) || !_.isString(body.password) || body.email.trim().length === 0 || body.password.trim().length < 4) {
        return res.status(400).json({error: 'validation'});
    }

    // body.email=body.email.toLowerCase().trim();

    db.user.create(body).then(function (user) {
        res.json(user.toPublicJSON())
    }).catch(function (e) {
        res.status(400).send(e);
    });


});

app.post('/users/login', function (req, res) {

    var body = _.pick(req.body, 'email', 'password');

    if (!body.hasOwnProperty('email') && !body.hasOwnProperty('password')) {
        return res.status(400).json({error: 'Missing information email missing'});

    }

    if (!_.isString(body.email) || !_.isString(body.password)) {
        return res.status(400).json({error: 'validation'});
    }

    // if (!_.isString(body.email) || !_.isString(body.password) || body.email.trim().length === 0 || body.password.trim().length < 4) {
    //     return res.status(400).json({error: 'validation'});
    // }

    // res.json(body);
    // body.email=body.email.toLowerCase().trim();

    db.user.findOne({
        where: {
            email: body.email
        }
    }).then(function (user) {
        console.log('hi', user);
        if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
            return res.status(401).send();

        }
        res.json(user.toPublicJSON());
    }, function (e) {
        res.status(500).send();
    });


});

// to recreate force db.sequelize.sync({force:true})

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(` Express running on port ${PORT}!`);
    });
});


