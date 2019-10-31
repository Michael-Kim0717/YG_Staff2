$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');
    const studentReference = firebase.database().ref('/Students');

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
                    }
                });
                
                appendPage(loggedInUser.role);
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    function appendPage (role) {
        if (role === 'mentor') {
            /* Mentor Directory Page:
                Append blueprint to container.
                Show ONLY that mentor's grade.
            */
            $("#d_container").append(
                "<h5 id='md_title' class='center title'> </h5>" +
                "<ul id='md_studentView' class='collapsible'>" +
                "</ul>"
            );
            
            /* Activate all collapsible list views */
            $('.collapsible').collapsible();

            /* Retrieve list of students from the database and show ONLY that mentor's grade. */
            $("#md_title").append(loggedInUser.grade + " Directory");
            studentReference.once('value', function(student_snapshot){
                student_snapshot.forEach(function(childSnapshot){
                    if (loggedInUser.grade === (childSnapshot.val().grade)) {
                        $("#md_studentView").append(
                            "<li>" +
                                "<div class='collapsible-header'>" + childSnapshot.val().name + "</div>" +
                                "<div class='collapsible-body'>" +
                                    "<span>" +
                                        "<h6> <b> Email Address: </b> </h6>" +
                                        "<h6>" + childSnapshot.val().email + "</h6> <br/>" + 
                                        "<h6> <b> Phone Number: </b> </h6>" +
                                        "<h6>" + childSnapshot.val().phone + "</h6> <br/>" + 
                                        "<h6> <b> Birthday: </b> </h6>" +
                                        "<h6>" + childSnapshot.val().birthday + "</h6> <br/>" + 
                                        "<h6> <b> Address: </b> </h6>" +
                                        "<h6>" + childSnapshot.val().address + "</h6> <br/>" + 
                                    "</span>" + 
                                "</div>" +
                            "</li>"
                        );
                    }
                })
            })
        }
        else if (role === 'admin') {
            /* Admin Directory Page:
                Append blueprint to container.
                Get the prompted grade's directory.
                Implementation for a button to move everyone up one grade.
            */
            $("#d_container").append(
            "<h6 style='float: left;'> Grade Selection: </h6>" +
            "<button id='ad_dropdownButton' class='dropdown-trigger btn' href='#' data-target='ad_grades'> - </button>" +
            
            "<ul id='ad_grades' class='dropdown-content'>" +
                "<li class='ad_gradeSelection'> 6B </li> <li class='ad_gradeSelection'> 6G </li>" +
                "<li class='ad_gradeSelection'> 7B </li> <li class='ad_gradeSelection'> 7G </li>" +
                "<li class='ad_gradeSelection'> 8B </li> <li class='ad_gradeSelection'> 8G </li>" +
                "<li class='ad_gradeSelection'> 9B </li> <li class='ad_gradeSelection'> 9G </li>" +
                "<li class='ad_gradeSelection'> 10B </li> <li class='ad_gradeSelection'> 10G </li>" +
                "<li class='ad_gradeSelection'> 11B </li> <li class='ad_gradeSelection'> 11G </li>" +
                "<li class='ad_gradeSelection'> 12B </li> <li class='ad_gradeSelection'> 12G </li>" +
            "</ul>" +
            
            "<ul id='ad_studentView' class='collapsible'>" +
            "</ul>" +
            
            "<button data-target='ad_confirmationModal' id='ad_graduate' class='btn modal-trigger'> Move Everyone One Grade Up </button>" +

            "<div id='ad_confirmationModal' class='modal'>" +
                "<div class='modal-content'>" +
                    "<h4> CONFIRM </h4>" +
                    "<p> This button is used to increase everyone's grade by 1. This action is irreversible and should only be done at the end of each school year. </p>" +
                "</div>" +
                "<div class='modal-footer'>" +
                    "<button class='modal-close waves-effect waves-green btn red' id='ad_confirmGraduate'>Confirm</button>" +
                "</div>" +
            "</div>"
        );
        
        /* Activate all collapsible list views */
        $('.collapsible').collapsible();
        
        /* Activate all dropdown menus */
        $('.dropdown-trigger').dropdown();

        /* When a dropdown menu item is pressed, change the value in the button and update the table accordingly. */
        $(".ad_gradeSelection").on("click", function(){
            const gradeSelection = $(this)[0].innerHTML.trim();
            $("#ad_dropdownButton").text(gradeSelection);
            $("#ad_studentView").empty();
            studentReference.once('value', function(student_snapshot){
                student_snapshot.forEach(function(student_childSnapshot){
                    if (student_childSnapshot.val().grade === gradeSelection) {
                        $("#ad_studentView").append(
                            "<li>" +
                                "<div class='collapsible-header'>" + 
                                student_childSnapshot.val().name +
                                "</div>" +
                                "<div class='collapsible-body' id='ad_f_" + student_childSnapshot.key + "'>" +
                                    "<span>" +
                                        "<h6> <b> Email Address: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().email + "</h6> <br/>" + 
                                        "<h6> <b> Phone Number: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().phone_number + "</h6> <br/>" + 
                                        "<h6> <b> Birthday: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().birthday + "</h6> <br/>" + 
                                        "<h6> <b> Address: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().address + "</h6> <br/>" + 
                                        
                                        "<button class='btn' id='" + student_childSnapshot.key + "Edit'> Edit </button>" +
                                        "<button class='btn right' id='" + student_childSnapshot.key + "Delete'> Delete </button>" +
                                    "</span>" + 
                                "</div>" +
                            "</li>"
                        );
                    }
                    $("#" + student_childSnapshot.key + "Edit").on("click", function(){
                        /* Check the Text of the 'Edit' button and work accordingly. */
                        if ($("#" + student_childSnapshot.key + "Edit").text().trim() === "Edit") {
                            $("#ad_f_" + student_childSnapshot.key).empty();
                            $("#ad_f_" + student_childSnapshot.key).append(
                                "<span>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_name' value='" + student_childSnapshot.val().name + "' type='text' class='validate'>" +
                                        "<label for='ad_f_name'> Name </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_grade' value='" + student_childSnapshot.val().grade + "' type='text' class='validate'>" +
                                        "<label for='ad_f_grade'> Grade </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_email' value='" + student_childSnapshot.val().email + "' type='email' class='validate'>" +
                                        "<label for='ad_f_email'> Email Address </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_phoneNumber' value='" + student_childSnapshot.val().phone + "' type='number' class='validate'>" +
                                        "<label for='ad_f_phoneNumber'> Phone Number </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_birthday' value='" + student_childSnapshot.val().birthday + "' type='date' class='validate'>" +
                                        "<label for='ad_f_birthday'> Birthday </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_address' value='" + student_childSnapshot.val().address + "' type='text' class='validate'>" +
                                        "<label for='ad_f_address'> Address </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_city' value='" + student_childSnapshot.val().city + "' type='text' class='validate'>" +
                                        "<label for='ad_f_city'> City </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='ad_f_state' value='" + student_childSnapshot.val().state + "' type='text' class='validate'>" +
                                        "<label for='ad_f_state'> State </label>" +
                                    "</div>" +
                                    
                                    "<button class='btn' id='" + student_childSnapshot.key + "Edit'> Edit </button>" +
                                "</span>"
                            );
                            M.updateTextFields();
                            $("#" + student_childSnapshot.key + "Edit").text("Confirm Edit");
                            
                            $("#" + student_childSnapshot.key + "Edit").on("click", function(){
                                const studentObject = {
                                    name: $("#ad_f_name").val(),
                                    grade: $("#ad_f_grade").val(),
                                    address: $("#ad_f_address").val(),
                                    city: $("#ad_f_city").val(),
                                    state: $("#ad_f_state").val(),
                                    birthday: $("#ad_f_birthday").val(),
                                    email: $("#ad_f_email").val(),
                                    phone: $("#ad_f_phoneNumber").val()
                                }
                                studentReference.child(student_childSnapshot.key).set(studentObject);
                                window.location.reload();
                            });
                        }
                    });
                    $("#" + student_childSnapshot.key + "Delete").on("click", function(){
                        /* Check the Text of the 'Delete' button and work accordingly. */
                        if ($("#" + student_childSnapshot.key + "Delete").text().trim() === "Delete") {                   
                            $("#" + student_childSnapshot.key + "Delete").text("Confirm Delete");
                        }
                        else {
                            studentReference.child(student_childSnapshot.key).remove();
                            window.location.reload(); 
                        }
                    });
                })
            })
        });

        /* Activate the Confirmation modal */
        $('.modal').modal();

        /* Increase ALL grades by 1 */
        $("#ad_confirmGraduate").on("click", function(){
            alert("ALL Staff and Students will now be updated.");
            staffReference.once('value', function(snapshot){
                console.log("List of Staff and Grade: ");
                snapshot.forEach(function(childSnapshot){
                    if (undefined !== childSnapshot.val().grade) {
                        console.log(childSnapshot.val().name, childSnapshot.val().grade, getNextGrade(childSnapshot.val().grade));
                        if (getNextGrade(childSnapshot.val().grade) === 'grad') {
                            firebase.database().ref('/Staff/' + childSnapshot.key).remove();
                        }
                        else {
                            firebase.database().ref('/Staff/' + childSnapshot.key).update({grade: getNextGrade(childSnapshot.val().grade)});
                        }
                    }
                });
            });
            studentReference.once('value', function(snapshot){
                console.log("-----------------------------");
                console.log("List of Students and Grade: ");
                snapshot.forEach(function(childSnapshot){
                    console.log(childSnapshot.val().name, childSnapshot.val().grade, getNextGrade(childSnapshot.val().grade));
                    if (getNextGrade(childSnapshot.val().grade) === 'grad') {
                        firebase.database().ref('/Students/' + childSnapshot.key).remove();
                    }
                    else {
                        firebase.database().ref('/Students/' + childSnapshot.key).update({grade: getNextGrade(childSnapshot.val().grade)});
                    }
                });
            });
        });
        }
    }

    function moveAccordingly(role) {
        /* Check if user is logged in and move them accordingly. */
        if (role === "none") {
            window.location.href = "/noPermission";
        }
    }

    /* Navigate back to Home Screen */
    $("#nb_return").on("click", function(){
        window.location.href = "/home";
    });

});