exports.notFoundError = (req, res, next) => {

    res.status(404).render('pageNotFound', { pageTitle: 'Error Code - 404' });
}

exports.userNotFound = (req, res, next) => {

    res.status(404).render('userNotFound', { pageTitle: 'User Not Found' });
}