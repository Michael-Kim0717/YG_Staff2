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

    /* Registration button functionality */
    $("#r_f_register").on("click", function(){
        console.log("clicked");
        const email = $("#r_f_email").val(),
            password = $("#r_f_password").val(),
            confirmPassword = $("#r_f_confirmPassword").val(),
            registrationCode = $("#r_f_registrationCode").val();
        
        /* ERROR CONDITION: Check if any of the fields are empty */
        if (email === "" || password === "" || confirmPassword === "" || registrationCode === "") {
            console.log("At least one field is empty.");
            $("#r_f_registrationError").empty();
            $("#r_f_registrationError").append(
                "<p class='error'>" +
                    "Please fill in all the fields." +
                "</p>"
            );
        }
        else {
            /* ERROR CONDITION: Check if the passwords do not match */
            if (password !== confirmPassword){
                console.log("Passwords don't match");
                $("#r_f_registrationError").empty();
                $("#r_f_registrationError").append(
                    "<p class='error'>" +
                        "Your passwords do not match." +
                    "</p>"
                );
            }
            else {
                /* ERROR CONDITION: Check if the registration code is correct */
                /* TODO: Fill in .env variables. */
                if (registrationCode === '3880') {
                    console.log("registration code properly entered.");
                    /* ERROR CONDITION: Check if the user email exists in the database */
                    staffReference.once('value', function(snapshot){
                        snapshot.forEach(function(childSnapshot){
                            if (email.toLowerCase() === (childSnapshot.val().email).toLowerCase()){
                                console.log("user is found in database");
                                firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                                    $("#r_f_registrationError").empty();
                                    $("#r_f_registrationError").append(
                                        "<p class='error'>" +
                                            error.message + 
                                        "</p>"
                                    );
                                    console.log("error message from registration :", error.message);
                                });
                                firebase.auth().onAuthStateChanged(function(user) {
                                    if (user) {
                                        console.log("im a user");
                                        window.location.href = "/home";
                                    }
                                });
                            }
                        }) 
                        console.log("user not found in database?"); 
                    });
                }
                else {
                    console.log("wrong registration code");
                    $("#r_f_registrationError").empty();
                    $("#r_f_registrationError").append(
                        "<p class='error'>" +
                            "You have either put in the wrong Registration Code or " +
                            "your email may not be in the database." +
                        "</p>"
                    );
                }
            }
        }
    });

    document.getElementById("r_f_registrationCode").addEventListener("keyup", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#r_f_register").click();
        }
    });

    /* Navigate back to Login Screen */
    $(".loginScreen").on("click", function(){
        window.location.href = "/";
    });

});