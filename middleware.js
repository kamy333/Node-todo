var cryptojs = require('crypto-js');

module.exports = function (db) {

    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth') || '';

            // if (typeof token === 'undefined') {
            //     res.status(401).send();
            // }

            db.token.findOne({
                where: {
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function (tokenInstance) {
                if (!tokenInstance) {
                    throw new Error();
                }

                req.token=tokenInstance;
                return db.user.findByToken(token);

                // db.create({token})
            }).then(function (user) {
                req.user = user;
                next();
            })
                .catch(function (e) {
                res.status(401).send();
            })
            ;

            // db.user.findByToken(token).then(function (user) {
            //     req.user = user;
            //     // console.log('success middleware', token);
            //
            //     next();
            // }, function () {
            //     // console.log('failed middleware ', token);
            //     res.status(401).send();
            // });
        }
    };
};