var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            salt: {
                type: DataTypes.STRING
            },
            password_hash: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    len: [4, 100]
                },
                set: function (value) {
                    var salt = bcrypt.genSaltSync(10);
                    var hashedPassword = bcrypt.hashSync(value, salt);
                    this.setDataValue('password', value);
                    this.setDataValue('salt', salt);
                    this.setDataValue('password_hash', hashedPassword);


                }
            }
        },
        {
            hooks: {
                beforeValidate: function (user, options) {
                    if (_.isString(user.email)) {
                        user.email = user.email.toLowerCase();
                    }
                }
            },
            instanceMethods: {
                toPublicJSON: function () {
                    var json = this.toJSON();
                    return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt')
                }
            }


        }

        ,
        {
            validate: {
                emailIsString: function () {
                    if (!_.isString(this.email)) {
                        throw new Error('Email must be string.')
                    }
                },
                passwordIsString: function () {
                    if (!_.isString(this.password)) {
                        throw new Error('Password must be boolean.')
                    }
                }
            }
        });
};


// lecture 72