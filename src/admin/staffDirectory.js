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
            "<a class='btn modal-trigger' href='#addStudentModal' id='asd_addStaff'> Add Staff </a> <br/>" +
            "<div class='row'>" +
                "<div class='col s12 m6'>" +
                    "<ul id='asd_staffView' class='collapsible'>" +
                    "</ul>" +
                "</div>" +
                "<div class='col s12 m6'>" +
                    "<ul id='asd_adminView' class='collapsible'>" +
                    "</ul>" +
                "</div>" +
            "</div>" +
            "<a id='asd_tip' class='waves-effect waves-light btn btn-floating'><i class='material-icons'>priority_high</i></a>" +

            "<div class='tap-target' data-target='asd_tip'>" +
                "<div class='tap-target-content'>" +
                    "<h5 class='center'> Tip: </h5> <br/>" +
                    "<h6> Adding a Staff Member will allow them to make an account. </h6>" +
                    "<h6> Removing a Staff Member will make it so that they can still log in, but not be able to access anything. </h6>" +
                    "<h6> Depending on their role ('Admin' or 'Mentor'), these staff members will have access to their respective permissions. </h6> <br/>" +
                "</div>" +
            "</div>" +

            "<div id='addStudentModal' class='modal'>" +
                "<div class='modal-content'>" +
                    "<h4> Add Staff Member </h4> <br/>" +
                    "<div class='input-field col s12'>" +
                        "<input id='asm_f_name' type='text' class='validate'>" +
                        "<label for='asm_f_name'> Name </label>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<label class='col s3'> Role: </label>" +
                        "<a class='dropdown-trigger btn col s9' id='asm_f_role' data-target='asm_f_role_dropdown'> mentor </a>" +
                    "</div>" +
                    "<div class='row' id='asm_f_gradeField'>" +
                        "<label class='col s3'> Grade: </label>" +
                        "<a class='dropdown-trigger btn col s9' id='asm_f_grade' data-target='asm_f_grade_dropdown'> 6B </a>" +
                    "</div>" +
                    "<div class='input-field col s12'>" +
                        "<input id='asm_f_email' type='email' class='validate'>" +
                        "<label for='asm_f_email'> Email Address </label>" +
                    "</div>" +
                    "<div id='asm_f_error' class='submissionError'>" +
                    "</div>" +
                    "<button class='btn green right' id='asm_f_addStaff'> Add Staff </button>" +
                "</div>" +
            "</div>" +


            "<ul id='asm_f_role_dropdown' class='dropdown-content'>" + 
                "<li class='valign-wrapper asm_rd'> mentor </li>" + 
                "<li class='valign-wrapper asm_rd'> admin </li>" + 
            "</ul>" +

            "<ul id='asm_f_grade_dropdown' class='dropdown-content'>" + 
                "<li class='valign-wrapper asm_gd'> 6B </li>" + "<li class='valign-wrapper asm_gd'> 6G </li>" + 
                "<li class='valign-wrapper asm_gd'> 7B </li>" + "<li class='valign-wrapper asm_gd'> 7G </li>" + 
                "<li class='valign-wrapper asm_gd'> 8B </li>" + "<li class='valign-wrapper asm_gd'> 8G </li>" + 
                "<li class='valign-wrapper asm_gd'> 9B </li>" + "<li class='valign-wrapper asm_gd'> 9G </li>" + 
                "<li class='valign-wrapper asm_gd'> 10B </li>" + "<li class='valign-wrapper asm_gd'> 10G </li>" + 
                "<li class='valign-wrapper asm_gd'> 11B </li>" + "<li class='valign-wrapper asm_gd'> 11G </li>" + 
                "<li class='valign-wrapper asm_gd'> 12B </li>" + "<li class='valign-wrapper asm_gd'> 12G </li>" + 
            "</ul>"
        
        );

        staffReference.once('value', function(snapshot) {
            snapshot.forEach(function (childSnapshot){
                if (childSnapshot.val().role === 'mentor') {
                    $("#asd_staffView").append(
                        "<li>" +
                            "<div class='collapsible-header'>" + childSnapshot.val().name + " </div>" +
                            "<div class='collapsible-body' id='asd_f_" + childSnapshot.key + "'>" +
                                "<span>" +
                                    "<h6> <b> Grade: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().grade + "</h6>" +
                                    "<h6> <b> Email: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().email + "</h6>" +
                                    "<h6> <b> Role: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().role + "</h6> <br />" +
                                    "<button class='btn' id='" + childSnapshot.key + "Edit'> Edit </button>" +
                                    "<button class='btn right' id='" + childSnapshot.key + "Delete'> Delete </button>" +
                                "</span>" +
                            "</div>" +
                        "</li>"
                    );
                }
                else if (childSnapshot.val().role === 'admin' && childSnapshot.key !== 'testadmin') {
                    $("#asd_adminView").append(
                        "<li>" +
                            "<div class='collapsible-header'>" + childSnapshot.val().name + " </div>" +
                            "<div class='collapsible-body' id='asd_f_" + childSnapshot.key + "'>" +
                                "<span>" +
                                    "<h6> <b> Email: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().email + "</h6>" +
                                    "<h6> <b> Role: </b> </h6>" +
                                    "<h6>" + childSnapshot.val().role + "</h6> <br />" +
                                    "<button class='btn' id='" + childSnapshot.key + "Edit'> Edit </button>" +
                                    "<button class='btn right' id='" + childSnapshot.key + "Delete'> Delete </button>" +
                                "</span>" +
                            "</div>" +
                        "</li>"
                    );
                }
                
                $("#" + childSnapshot.key + "Edit").on("click", function(){
                    /* Check the Text of the 'Edit' button and work accordingly. */
                    if ($("#" + childSnapshot.key + "Edit").text().trim() === "Edit") {
                        $("#asd_f_" + childSnapshot.key).empty();
                        if (childSnapshot.val().role === 'mentor') {
                            $("#asd_f_" + childSnapshot.key).append(
                                "<span>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='asd_f_name' value='" + childSnapshot.val().name + "' type='text' class='validate'>" +
                                        "<label for='asd_f_name'> Name </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='asd_f_grade' value='" + childSnapshot.val().grade + "' type='text' class='validate'>" +
                                        "<label for='asd_f_grade'> Grade </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input disabled id='asd_f_email' value='" + childSnapshot.val().email + "' type='email' class='validate'>" +
                                        "<label for='asd_f_email'> Email Address </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input disabled id='asd_f_role' value='" + childSnapshot.val().role + "' type='email' class='validate'>" +
                                        "<label for='asd_f_role'> Role </label>" +
                                    "</div>" +
                                    
                                    "<button class='btn' id='" + childSnapshot.key + "Edit'> Edit </button>" +
                                "</span>"
                            );
                        }
                        else if (childSnapshot.val().role === 'admin') {
                            $("#asd_f_" + childSnapshot.key).append(
                                "<span>" +
                                    "<div class='input-field col s12'>" +
                                        "<input id='asd_f_name' value='" + childSnapshot.val().name + "' type='text' class='validate'>" +
                                        "<label for='asd_f_name'> Name </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input disabled id='asd_f_email' value='" + childSnapshot.val().email + "' type='email' class='validate'>" +
                                        "<label for='asd_f_email'> Email Address </label>" +
                                    "</div>" +
                                    "<div class='input-field col s12'>" +
                                        "<input disabled id='asd_f_role' value='" + childSnapshot.val().role + "' type='email' class='validate'>" +
                                        "<label for='asd_f_role'> Role </label>" +
                                    "</div>" +
                                    
                                    "<button class='btn' id='" + childSnapshot.key + "Edit'> Edit </button>" +
                                "</span>"
                            );
                        }
                        M.updateTextFields();
                        $("#" + childSnapshot.key + "Edit").text("Confirm Edit");
                        
                        $("#" + childSnapshot.key + "Edit").on("click", function(){
                            const staffObject = {
                                name: $("#asd_f_name").val(),
                                email: $("#asd_f_email").val(),
                                role: $("#asd_f_role").val()
                            }
                            if (childSnapshot.val().role === 'mentor') {
                                staffObject["grade"] = $("#asd_f_grade").val();
                            }
                            staffReference.child(childSnapshot.key).set(staffObject);
                            $.ajax("/staffEdit", {
                                type: 'POST',
                                data: staffObject,
                                success: window.location.reload()
                            });
                        });
                    }
                });
                $("#" + childSnapshot.key + "Delete").on("click", function(){
                    /* Check the Text of the 'Delete' button and work accordingly. */
                    if ($("#" + childSnapshot.key + "Delete").text().trim() === "Delete") {                   
                        $("#" + childSnapshot.key + "Delete").text("Confirm Delete");
                    }
                    else {
                        staffReference.child(childSnapshot.key).remove();
                        const staffObject = {
                            name: childSnapshot.val().name,
                            email: childSnapshot.val().email,
                            role: childSnapshot.val().role
                        }
                        if (childSnapshot.val().role === 'mentor') {
                            staffObject["grade"] = childSnapshot.val().grade;
                        }
                        console.log(staffObject);
                        $.ajax("/staffDelete", {
                            type: 'POST',
                            data: staffObject,
                            success: window.location.reload()
                        });
                    }
                });
            });
        });

        $(".collapsible").collapsible();
        $('.dropdown-trigger').dropdown();
        $('.modal').modal();
        $('.tap-target').tapTarget();
        $("#asd_tip").on("click", function(){
            $(".tap-target").tapTarget('open');
        });

        $('.asm_rd').on("click", function() {
            $('#asm_f_role').text($(this)[0].innerHTML.trim());
            if ($(this)[0].innerHTML.trim() === 'admin') {
                $("#asm_f_gradeField").css("display", "none");
            }
            else if ($(this)[0].innerHTML.trim() === 'mentor') {
                $("#asm_f_gradeField").css("display", "inherit");
            }
        });

        $('.asm_gd').on("click", function() {
            $('#asm_f_grade').text($(this)[0].innerHTML.trim());
        });

        $('#asm_f_addStaff').on("click", function() {
            const name = $('#asm_f_name').val(),
                role = $('#asm_f_role').text().trim(),
                grade = $('#asm_f_grade').text().trim(),
                email = $('#asm_f_email').val();
            if (name === '' || role === '' || grade === '' || email === '') {
                $("#asm_f_error").empty();
                $("#asm_f_error").append(
                    "<p class='error-noSideMargin'>" +
                        "Please fill in all the fields." +
                    "</p>"
                );
            }
            else {
                const staffObject = {
                    name: name,
                    role: role,
                    email: email
                }
                if (staffObject.role === 'mentor') {
                    staffObject['grade'] = grade;
                }
                $("#asm_f_error").empty();
                $("#asm_f_error").append(
                    "<p class='success-noSideMargin'>" +
                        "Added staff member successfully!" +
                    "</p>"
                );
                $.ajax('/staffAdd', {
                    type: 'POST',
                    data: staffObject
                })
                staffReference.push(staffObject);
                $("#asm_f_name").val("");
                $("#asm_f_email").val("");
            }
        });

    }

    /* Navigate back to Home Screen */
    $("#nb_return").on("click", function(){
        window.location.href = "/home";
    });
    
});