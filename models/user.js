var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
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
            classMethods: {
                authenticate: function (body) {
                    return new Promise(function (resolve, reject) {
                        if (!body.hasOwnProperty('email') && !body.hasOwnProperty('password')) {
                            return reject();

                        }

                        if (!_.isString(body.email) || !_.isString(body.password)) {
                            return reject();
                        }

                        // if (!_.isString(body.email) || !_.isString(body.password) || body.email.trim().length === 0 || body.password.trim().length < 4) {
                        //     return res.status(400).json({error: 'validation'});
                        // }

                        // res.json(body);
                        // body.email=body.email.toLowerCase().trim();

                        user.findOne({
                            where: {
                                email: body.email
                            }
                        }).then(function (user) {
                            // console.log(user.toJSON());
                            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                                return reject();

                            }
                            resolve(user);
                        }, function (e) {
                            return reject();
                        });
                    });
                },
                findByToken: function (token) {
                    return new Promise(function (resolve, reject) {
                        try {
                            var decodedJWT = jwt.verify(token, 'qwerty098');
                            var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
                            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                            user.findById(tokenData.id).then(function (user) {
                                if (user) {
                                    resolve(user);
                                } else {
                                    reject();
                                }
                            }, function (e) {
                                reject();
                            });
                        } catch (e) {
                            reject();
                        }
                    });
                }
            },
            instanceMethods: {
                toPublicJSON: function () {
                    var json = this.toJSON();
                    return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt')
                },
                generateToken: function (type) {
                    if (!_.isString(type)) {
                        return undefined;
                    }

                    try {
                        var stringData = JSON.stringify({id: this.get('id'), type: type});
                        var secretKey = 'abc123!@#!';
                        var encrypData = cryptojs.AES.encrypt(stringData, secretKey).toString();
                        var token = jwt.sign({
                            token: encrypData
                        }, 'qwerty098');

                        return token;
                    } catch (e) {
                        return undefined;
                    }
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
    return user;

};


