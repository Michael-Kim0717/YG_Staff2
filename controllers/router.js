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
    
    app.get('/feedback', (request, response) => {
        response.render('mentorPages/feedback');
    });

    /* Admin Pages */
    app.get('/addStudent', (request, response) => {
        response.render('adminPages/addStudent');
    });

    app.get('/staffDirectory', (request, response) => {
        response.render('adminPages/staffDirectory');
    });

    app.post('/sendMassEmail', (request, response) => {
        let sendEmailTo = [];
        for (let i = 0; i < Object.keys(request.body).length; i++) {
            sendEmailTo.push(request.body[i]);
        }
        console.log(sendEmailTo);
        
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.sendGridApiKey);
        const msg = {
            to: sendEmailTo,
            from: 'bygstaff@bygstaff.herokuapp.com',
            subject: 'Send In Logs',
            text: 'Hello, if you are receiving this message, please send in your logs by midnight tonight!',
            html: '<p> Hello, if you are receiving this message, please send in your logs by midnight tonight! </p>',
        };
        sgMail.sendMultiple(msg);
    });

    app.post('/sendLogsToPMike', (request, response) => {
        const grades = ["6B", "6G", "7B", "7G", "8B", "8G", "9B", "9G", "10B", "10G", "11B", "11G", "12B", "12G"];
        let logText = "";
        for (let i = 0; i < grades.length; i++) {
            let clt = request.body[grades[i]];
            logText += grades[i] + "\n";
            let reflection = clt.substring(0, clt.indexOf(" "));
            clt = clt.substring(clt.indexOf(" ") + 1);
            logText += "Reflection: \n" + reflection + "\n";
            let relational = clt.substring(0, clt.indexOf(" "));
            clt = clt.substring(clt.indexOf(" ") + 1);
            logText += "Relational: \n" + relational + "\n";
            let prayerRequest = clt.substring(0, clt.indexOf(" "));
            clt = clt.substring(clt.indexOf(" ") + 1);
            logText += "Prayer Request: \n" + prayerRequest + "\n";
            let questionsPMike = clt.substring(0, clt.indexOf(" "));
            clt = clt.substring(clt.indexOf(" ") + 1);
            logText += "Questions for Pastor Mike: \n" + questionsPMike + "\n";
            let missingStudents = clt;
            logText += "Missing Students: \n" + missingStudents + "\n";
        }

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.sendGridApiKey);
        const msg = {
            to: 'michaelkim0717@gmail.com',
            from: 'bygstaff@bygstaff.herokuapp.com',
            subject: 'Logs from this week',
            text: logText,
            html: '<p>' + logText + '</p>',
        };
        sgMail.send(msg);
    });

}