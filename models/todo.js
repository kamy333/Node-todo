// module.exports = function (sequelize, DataTypes) {
//
//     return sequelize.define('todo', {
//         description: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             validate: {
//                 len: [1, 250]
//             }
//         },
//         completed: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false
//
//         },
//     });
//
// };
//

var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('todo', {
            description: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 250]
                }
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }
        // , {
        //     validate: {
        //         descriptionIsString: function() {
        //             if (!_.isString(this.description)) {
        //                 throw new Error('Description must be string.')
        //             }
        //         },
        //         completedIsBoolean: function() {
        //             if (!_.isBoolean(this.completed)) {
        //                 throw new Error('Completed must be boolean.')
        //             }
        //         }
        //     }
        // }

    );
};


// lecture 72