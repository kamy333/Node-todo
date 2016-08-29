module.exports = function (db) {

    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth');

            if (typeof token === 'undefined') {
                res.status(401).send();
            }

            db.user.findByToken(token).then(function (user) {
                req.user = user;
                // console.log('success middleware', token);

                next();
            }, function () {
                // console.log('failed middleware ', token);
                res.status(401).send();
            });
        }
    };
};