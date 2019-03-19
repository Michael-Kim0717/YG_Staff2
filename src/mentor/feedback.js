$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');
    const feedbackReference = firebase.database().ref('/Feedback');

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
                
                appendPage();
                    
                $("#mf_f_submitFeedback").on("click", function(){
                    feedbackReference.push().set({name: loggedInUser.name, feedback: $("#mf_f_feedbackField").val()});
                    window.location.href = "/thankYou";
                });

                /* Navigate back to Home Screen */
                $("#nb_return").on("click", function(){
                    window.location.href = "/home";
                });

            });
        }
        else {
            appendPage();
                
            $("#mf_f_submitFeedback").on("click", function(){
                feedbackReference.push().set({name: "Anonymous", feedback: $("#mf_f_feedbackField").val()});
                window.location.href = "/thankYou";
            });
            
            /* Navigate back to Home Screen */
            $("#nb_return").on("click", function(){
                window.location.href = "/";
            });
        }
    });

    function appendPage() {
        $("#mf_container").append(
            "<h5 id='mf_f_title' class='center'> If you have any issues or improvements you want to see made, please write them below. Thanks! </h5>" +
            "<div class='input-field col s12'>" +
                "<textarea id='mf_f_feedbackField' class='materialize-textarea'></textarea>" +
            "</div>" +
            "<button class='btn right' id='mf_f_submitFeedback'> Submit </button>"
        );
    }
});