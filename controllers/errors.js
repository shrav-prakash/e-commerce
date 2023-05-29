exports.notFoundError = (req, res, next) => {
    const isLoggedIn = req.get('Cookie') ? req.get('Cookie').split('=')[1] : false;
    res.status(404).render('pageNotFound', { pageTitle: 'Error Code - 404', isLoggedIn: isLoggedIn });
}
