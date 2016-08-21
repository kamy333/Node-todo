var express=require('express');
var app=express()  ;
var PORT= process.env.PORT || 3000;
var todos=[
    {
    id:1,
    description:'Meet Adrian',
    completed:false
    },
    {
        id:2,
        description:'Learn TypeScript',
        completed:false
    },
    {
        id:3,
        description:'Learn Angular2 js',
        completed:false
    }
    ];

app.get('/',function (req,res) {
    res.send('ToDo API Root 2nd commit')
});


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


app.listen(PORT,function () {
    console.log(` Express running on port ${PORT}! `);
});
