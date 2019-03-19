$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');

    $("#nb_return").text("HOME");

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
                
                appendPage();
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    function moveAccordingly(role) {
        /* Check if user is logged in and move them accordingly. */
        if (role !== "admin") {
            window.location.href = "/noPermission";
        }
    }

    function appendPage() {
        $("#asd_container").append(
            "<h6> Staff Members will eventually be able to be added/edited/deleted on this page. </h6>" +
            "<h6> Adding a Staff Member will allow them to make an account. </h6>" +
            "<h6> Removing a Staff Member will make it so that they can still log in, but not be able to access anything. </h6>" +
            "<h6> Depending on their role ('Admin' or 'Mentor'), these staff members will have access to their respective permissions. </h6> <br/>" +
            "<h6> * This page only shows a list of MENTORS at the moment. </h6> <br/> " +
            "<ul id='asd_staffView' class='collapsible'>" +
            "</ul>"
        );

        staffReference.once('value', function(snapshot) {
            snapshot.forEach(function (childSnapshot){
                if (childSnapshot.val().role === 'mentor') {
                    $("#asd_staffView").append(
                        "<li>" +
                            "<div class='collapsible-header'>" + childSnapshot.val().name + " </div>" +
                            "<div class='collapsible-body'>" +
                                "<span>" +
                                    "<h6> <b> Grade: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().grade + "</h6>" +
                                    "<h6> <b> Email: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().email + "</h6>" +
                                    "<h6> <b> Role: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().role + "</h6>" +
                                "</span>" +
                            "</div>" +
                        "</li>"
                    );
                }
            });
        });

        $(".collapsible").collapsible();
    }

    /* Navigate back to Home Screen */
    $("#nb_return").on("click", function(){
        window.location.href = "/home";
    });
    
});