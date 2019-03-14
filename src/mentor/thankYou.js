$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');

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
                        moveAccordingly(loggedInUser.role);
                    }
                }); 
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    /* Check if user is logged in and move them accordingly. */
    function moveAccordingly (role) {
        if (role !== "mentor") {
            window.location.href = "/noPermission";
        }
    }

    /* Return the user back to the 'Home Page' */
    $("#mty_backHome").on("click", function(){
        window.location.href = "/home";
    });

});