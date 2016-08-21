var express=require('express');
var bodyParser=require('body-parser');

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
    var todoId= parseInt(req.params.id);
    var matchedTodo;

    todos.forEach(function (todo) {
        if(todo.id===todoId){
            matchedTodo=todo;
        }
    });

    if(matchedTodo){
        res.json(matchedTodo);
    } else {
        res.status(404).send('404 could not found toDo item no ' +req.params.id);

    }

});

app.post('/todos',function (req,res) {
var body=req.body;
    body.id=todoNextId++;
    console.log('body.id '+body.id);

    todos.push({
        id:body.id,
        description:body.description,
        completed:body.completed
    });

    // console.log(`description `,body[0].description);
    console.log('NextId '+ todoNextId, todos);

    res.json(todos);
});

app.listen(PORT,function () {
    console.log(` Express running on port ${PORT}! `);
});
