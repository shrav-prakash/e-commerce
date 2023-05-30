exports.notFoundError = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.status(404).render('pageNotFound', { pageTitle: 'Error Code - 404', isLoggedIn: isLoggedIn });
}

exports.userNotFound = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.status(404).render('userNotFound', { pageTitle: 'User Not Found', isLoggedIn: isLoggedIn });
}