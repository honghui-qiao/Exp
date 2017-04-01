exports.show = function (req, res, next) {
    if (!req.params.slug) {
        return next(new Error('No article slug'));

    }
};
