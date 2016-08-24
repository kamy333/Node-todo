var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-db.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false

    },
});

sequelize.sync().then(function () {  //{force:true}
    console.log('everything is synced!');

    Todo.findById(3).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());

        } else {
            console.log('No todo found');

        }
    });


    // Todo.create({
    //     description:'Learning Node',
    //     // completed:false
    // }).then(function (todo) {
    //     return Todo.create({
    //         description:'Learning Angular',
    //
    //     });
    //
    //     // console.log('Finished');
    //     // console.log(todo);
    //
    // }).then(function () {
    //     // return Todo.findById(1);
    //     return Todo.findAll({
    //         where:{
    //             description:{
    //                 $like:'%angular%'
    //             }
    //         }
    //     })
    // }).then(function (todos) {
    //     if(todos){
    //         todos.forEach(function (todo) {
    //             console.log(todo.toJSON());
    //         });
    //
    //     } else {
    //         console.log('No to do found');
    //
    //     }
    // }).catch(function (e) {
    //     console.log(e);
    //
    // })
    //


});