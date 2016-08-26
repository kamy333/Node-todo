var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4,100]
            }
        }
    },
        {
            hooks:{
                beforeValidate:function (user,options) {
                    if (!_.isString(user.email)) {
                        user.email=user.email.toLowerCase();
                    }
                }
            }
        },
        {
        validate: {
            emailIsString: function() {
                if (!_.isString(this.email)) {
                    throw new Error('Email must be string.')
                }
            },
            passwordIsString: function() {
                if (!_.isString(this.password)) {
                    throw new Error('Password must be boolean.')
                }
            }
        }
    });
};


// lecture 72