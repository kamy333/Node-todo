var express=require('express');
var bodyParser=require('body-parser');
var _=require('underscore');

var app=express()  ;
var PORT= process.env.PORT || 3000;
var todoNextId=1;
var todos=[];

app.get('/',function (req,res) {
    res.send( `ToDo API Root 2nd commit
    <p><a href="/todos">ToDos</a></p>`);

});

app.use(bodyParser.json());

app.get('/todos',function (req,res) {
    res.json(todos)
});

app.get('/todos/:id',function (req,res) {
    var todoId= parseInt(req.params.id,10);
    var matchedTodo=_.findWhere(todos, {id: todoId});


    if(matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send('404 could not found toDo item no ' +req.params.id);

    }

});

app.post('/todos',function (req,res) {

// var body=req.body;
    var body=_.pick(req.body, 'description', 'completed');

    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length===0){
        return res.status(400).send();
    }

    body.id=todoNextId++;
    body.description=body.description.trim();
    console.log('body.id '+body.id);

    todos.push(body);

    res.json(body);
});



app.delete('/todos/:id',function (req,res) {
var todoId= parseInt(req.params.id,10);
var matchedTodo=_.findWhere(todos, {id: todoId});

    if(!matchedTodo){
        res.status(404).json({"error":"no todo found with id: " +req.params.id})
    } else {
        todos=_.without(todos, matchedTodo);
        console.log("id " + matchedTodo.id +' deleted !');
        res.json(matchedTodo);
    }



});

app.put('/todos/:id',function (req,res) {
    var todoId= parseInt(req.params.id,10);
    var matchedTodo=_.findWhere(todos, {id: todoId});
    var body=_.pick(req.body, 'description', 'completed');
    var validAttributes={};

    if(!matchedTodo){
        return  res.status(404).json({"error":"no todo found with id: " +req.params.id})
    }


    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed=body.completed;
    } else if(body.hasOwnProperty('completed')) {
        return res.status(400).send()
    }

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length>0){
        validAttributes.description=body.description;
    } else if(body.hasOwnProperty('description')) {
        return res.status(400).send()
    }

    _.extend(matchedTodo,validAttributes);

    res.json(matchedTodo);

});


app.listen(PORT,function () {
    console.log(` Express running on port ${PORT}!`);
});
