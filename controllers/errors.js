exports.notFoundError = (req, res, next) => {
    res.status(404).render('errors/pageNotFound', { pageTitle: 'Error Code - 404' });
}

exports.userNotFound = (req, res, next) => {
    res.status(404).render('errors/userNotFound', { pageTitle: 'User Not Found' });
}

exports.error500 = (error, req, res, next) => {
    res.status(500).render('errors/500', { pageTitle: 'Error Code - 500' });
}