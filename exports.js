var env = process.env;

var config = {
    /* TODO: Fill in .env variables. */
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    databaseURL: env.databaseURL,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId
};

var registrationCode = env.registrationCode;