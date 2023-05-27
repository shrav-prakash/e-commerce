exports.notFoundError = (req, res, next) => {
    res.status(404).render('pageNotFound', { pageTitle: 'Error Code - 404' });
}
