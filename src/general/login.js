$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');

    firebase.auth().onAuthStateChanged(function (user){
        if (user) {
            moveAccordingly("loggedIn");            
        }
    });

    function moveAccordingly(role) {
        /* Check if user is logged in and move them accordingly. */
        if (role !== "none") {
            window.location.href = "/home";
        }
    }

    /* Login button functionality */
    $("#i_f_login").on("click", function(){
        const email = $("#i_f_email").val(),
            password = $("#i_f_password").val();

        if (email === "" || password === "") {
            $("#i_f_loginError").empty();
            $("#i_f_loginError").append(
                "<p class='error'>" +
                    "Please fill in all the fields." +
                "</p>"
            );
        }
        else {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                $("#i_f_loginError").empty();
                $("#i_f_loginError").append(
                    "<p class='error'>" +
                        error.message +
                    "</p>"
                );            
            });
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    staffReference.once('value', function(snapshot){
                        snapshot.forEach(function(childSnapshot){
                            if (email.toLowerCase() === (childSnapshot.val().email).toLowerCase()){
                                window.location.href = "/home";
                            }
                        })  
                    });
                }
            });
        }
    });
    
    document.getElementById("i_f_password").addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#i_f_login").click();
        }
    });

});