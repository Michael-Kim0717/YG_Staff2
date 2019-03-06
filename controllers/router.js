module.exports = app => {

    /* PreLogin Pages */
    app.get('/', (request, response) => {
        response.render('preLoginPages/index');
    });

    app.get('/register', (request, response) => {
        response.render('preLoginPages/register');
    });

    /* General Pages */
    app.get('/home', (request, response) => {
        response.render('generalPages/home');
    });

    app.get('/noPermission', (request, response) => {
        response.render('generalPages/noPermission');
    });

    app.get('/log', (request, response) => {
        response.render('generalPages/log');
    });

    app.get('/breakfast', (request, response) => {
        response.render('generalPages/breakfast');
    });
    
    app.get('/directory', (request, response) => {
        response.render('generalPages/directory');
    });

    /* Mentor Pages */
    app.get('/thankYou', (request, response) => {
        response.render('mentorPages/thankYou');
    });

    /* Admin Pages */
    app.get('/addStudent', (request, response) => {
        response.render('adminPages/addStudent');
    });

}