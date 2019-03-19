$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');

    $("#nb_return").text("HOME");

    /* Get Current Logged in User */
    let loggedInUser = {};
    firebase.auth().onAuthStateChanged(function (user){
        if (user) {
            staffReference.once('value', function(snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.val().email.toLowerCase() === user.email.toLowerCase()) {
                        loggedInUser = {
                            email: childSnapshot.val().email,
                            grade: childSnapshot.val().grade,
                            name: childSnapshot.val().name,
                            role: childSnapshot.val().role
                        };
                    }
                }); 
                
                /* Return the user back to the 'Home Page' */
                $("#nb_return").on("click", function(){
                    window.location.href = "/home";
                });

                $("#mty_backHome").on("click", function(){
                    window.location.href = "/home";
                });
            });
        }
        else {
            /* Return the user back to the 'Home Page' */
            $("#nb_return").on("click", function(){
                window.location.href = "/";
            });

            $("#mty_backHome").on("click", function(){
                window.location.href = "/";
            });
        }
    });

});