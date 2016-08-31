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

var User=sequelize.define(('user'),{
    email:Sequelize.STRING,

});
Todo.belongsTo(User);
User.hasMany(Todo);



sequelize.sync().then(function () {  //{force:true}
    console.log('everything is synced!');

   // User.create({
   //     email:'me@me.com'
   // }).then(function () {
   //   return  Todo.create({
   //         description:'have fun'
   //     })
   // }).then(function (todo) {
   //     User.findById(1).then(function (user) {
   //          user.addTodo(todo);
   //     });
   // });


  User.findById(1).then(function (user) {
      user.getTodos({
          where:{
              completed:true,
          }
      }).then(function (todos) {
          todos.forEach(function (todo) {
              console.log(todo.toJSON());

          })
          
      })
  });



    // Todo.findById(3).then(function (todo) {
    //     if (todo) {
    //         console.log(todo.toJSON());
    //
    //     } else {
    //         console.log('No todo found');
    //
    //     }
    // });


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