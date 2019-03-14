$(document).ready(function(){

    /* Get Current Logged in User */
    firebase.auth().onAuthStateChanged(function (user){
        let loggedIn = false;
        if (user) {
            loggedIn = true;
        }
        /* Return the user back to the corresponding page */
        $("#np_backHome").on("click", function(){
            window.location.href = loggedIn === true ? "/home" : "/";
        });
    });

});