var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');
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
    var queryParams = req.query;
    var todos = [];
    // var filterTodos =[];

    db.todo.findAll().then(function (todosAll) {
        if (todosAll) {
            todosAll.forEach(function (tds) {
                if (tds.hasOwnProperty('dataValues')) {
                    todos.push(tds.dataValues);
                }
            });

            var filterTodos = todos;
            // console.log(filterTodos);

            if (queryParams.hasOwnProperty('completed') && queryParams.completed === "true") {
                filterTodos = _.where(todos, {completed: true});
            } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === "false") {
                filterTodos = _.where(todos, {completed: false});
            }

            // todo loop through to do class and
            if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
                filterTodos = _.filter(filterTodos, function (todo) {
                    return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
                });
            }


            res.json(filterTodos);


        } else {
            res.status(404).json({notFound: '404 could not found toDos '});

        }

    }).catch(function (e) {
        res.status(400).json('e');

    });


});

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);


    db.todo.findById(todoId).then(function (foundTodoId) {

        if (foundTodoId.dataValues) {
            matchedTodo = foundTodoId.dataValues;
            // console.log(matchedTodo);
            res.json(matchedTodo);
        } else {
            res.status(404).json({notFound: '404 could not found toDo item no ' + req.params.id});

        }

    }).catch(function (e) {
        return res.status(400).json(e)

    });

    // if(todosAll){
    //     todosAll.forEach(function (tds) {
    //         if(tds.hasOwnProperty('dataValues')){
    //             todos.push(tds.dataValues);
    //         }
    //     }}

    // var matchedTodo = _.findWhere(todos, {id: todoId});
    //
    //
    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send('404 could not found toDo item no ' + req.params.id);
    //
    // }

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
    // var matchedTodo = _.findWhere(todos, {id: todoId});

    db.todo.findById(todoId).then(function (matchedTodo) {
        if (matchedTodo) {
            db.todo.destroy({
                where: {
                    id: todoId
                }
            });

            res.json(matchedTodo);
        } else {
            res.status(404).json({"error": "no todo found with id: " + req.params.id})

        }

    }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
        if (rowDeleted === 1) {

            console.log('Deleted successfully');
        }
    }).catch(function (e) {
        res.status(400).json({"error": e})

    });


    //
    // if (!matchedTodo) {
    //     res.status(404).json({"error": "no todo found with id: " + req.params.id})
    // } else {
    //     todos = _.without(todos, matchedTodo);
    //     console.log("id " + matchedTodo.id + ' deleted !');
    //     res.json(matchedTodo);
    // }


});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    var matchedTodo = [];
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};


    if (!matchedTodo) {
        return res.status(404).json({"error": "no todo found with id: " + req.params.id})
    }


    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).json({error: 'The completed did not pass validation'})
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).json({error: 'The description did not pass validation'})
    }
    console.log(validAttributes);


    db.todo.update(
        validAttributes
        , {
            where: {
                id: todoId
            },
            limit: 1
        }).then(function (i) {

        if (parseInt(i, 10) === 1) {

            db.todo.findById(todoId).then(function (foundTodoId) {

                if (foundTodoId.dataValues) {
                    matchedTodo = foundTodoId.dataValues;
                    // console.log(matchedTodo);
                    res.json(matchedTodo);
                } else {
                    // res.status(404).send('404 could not found toDo item no ' + req.params.id);

                }
            });

        }


    }).catch(function (e) {
        return res.status(400).json(e)

    });


    // _.extend(matchedTodo, validAttributes);

    // res.json(matchedTodo);

});


db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(` Express running on port ${PORT}!`);
    });
});


