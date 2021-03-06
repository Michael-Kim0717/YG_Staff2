$(document).ready(function(){

    const studentReference = firebase.database().ref('/Students');
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

                const grades = ["6B", "6G", "7B", "7G", "8B", "8G", "9B", "9G", "10B", "10G", "11B", "11G", "12B", "12G"];
                
                /* When the 'Add Student' button is pressed */
                $("#ad_f_addNewStudent").on("click", function(){
                    /* ERROR CONDITION: Name is not filled */
                    if ($("#ad_f_name").val() === "") {
                        $("#ad_f_submissionError").empty();
                        $("#ad_f_submissionError").append(
                            "<h6 class='error'> Please Fill in the Required Field: 'Name' </h6>"
                        );
                    }
                    else {
                        /* ERROR CONDITION: Grade is not filled */
                        if ($("#ad_f_grade").val() === "" || !grades.includes($("#ad_f_grade").val())) {
                            $("#ad_f_submissionError").empty();
                            $("#ad_f_submissionError").append(
                                "<h6 class='error'> Please Fill in the Required Field: 'Grade' </h6>" +
                                "<h6 class='error'> Make sure Grade is in the format '[Grade Number][First Letter of Gender]' like '10B' </h6>"
                            );
                        }
                        else {
                            $("#ad_f_submissionError").empty();
                            const studentObject = {
                                name: $("#ad_f_name").val(),
                                grade: $("#ad_f_grade").val(),
                                address: $("#ad_f_address").val() + ", " + $("#ad_f_city").val() + ", " + $("#ad_f_state").val(),
                                birthday: $("#ad_f_birthday").val(),
                                email: $("#ad_f_email").val(),
                                phone_number: $("#ad_f_phoneNumber").val(),
                                parents_number: $("#ad_f_parentsPhoneNumber").val(),
                                classes_taken: $("#ad_f_classesTaken").val()
                            }
                            $("#ad_f_name").val("");
                            $("#ad_f_grade").val("");
                            $("#ad_f_address").val("");
                            $("#ad_f_city").val("");
                            $("#ad_f_state").val("");
                            $("#ad_f_birthday").val("");
                            $("#ad_f_email").val("");
                            $("#ad_f_phoneNumber").val("");
                            $("#ad_f_parentsPhoneNumber").val("");
                            $("#ad_f_classesTaken").val("");
                            studentReference.push().set(studentObject);
                            $("#ad_f_submissionError").append(
                                "<h6 class='success'> Student Added Successfully! </h6>"
                            );
                            setTimeout(function() {
                                $("#ad_f_submissionError").empty();
                            }, 2000)
                        }
                    }
                });

                /* Autocomplete functionality for Grade field */
                $('input.ad_f_grade').autocomplete({
                    data: {
                        "6B": null, "6G": null,
                        "7B": null, "7G": null,
                        "8B": null, "8G": null,
                        "9B": null, "9G": null,
                        "10B": null, "10G": null,
                        "11B": null, "11G": null,
                        "12B": null, "12G": null,
                    },
                });
                
                let studentCities = {};
                studentReference.once('value', function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                        studentCities[retrieveCity(childSnapshot.val().address)] = null;
                        console.log(childSnapshot.val().address);
                    });
                    $('input.ad_f_city').autocomplete({data: studentCities});
                });
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    function appendPage() {
        let gradeField = 
            "<div class='input-field col s12'>" +
                "<input id='ad_f_grade' type='text' class='validate ad_f_grade'>" +
                "<label for='ad_f_grade'> Grade * </label>" +
            "</div>";
        if (loggedInUser.role === "mentor") {
            gradeField = 
            "<div class='input-field col s12'>" +
                "<input id='ad_f_grade' type='text' disabled class='validate ad_f_grade' value='" + loggedInUser.grade + "'>" +
                "<label for='ad_f_grade'> </label>" +
            "</div>";
        }

        $("#aas_container").append(
            "<h6 id='ad_error_section' class='error'> * Required </h6>" +
            "<h6 class='ad_f_title'> Add a Student </h6>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_name' type='text' class='validate'>" +
                "<label for='ad_f_name'> Name * </label>" +
            "</div>" +
            gradeField +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_address' type='text' class='validate'>" +
                "<label for='ad_f_address'> Address </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_city' type='text' class='validate ad_f_city'>" +
                "<label for='ad_f_city'> City </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_state' type='text' class='validate'>" +
                "<label for='ad_f_state'> State </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_birthday' type='date' class='validate'>" +
                "<label for='ad_f_birthday'> Birthday </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_email' type='email' class='validate'>" +
                "<label for='ad_f_email'> Email Address </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_phoneNumber' type='text' class='validate'>" +
                "<label for='ad_f_phoneNumber'> Phone Number </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_parentsPhoneNumber' type='text' class='validate'>" +
                "<label for='ad_f_parentsPhoneNumber'> Parent's Phone Number </label>" +
            "</div>" +
            "<div class='input-field col s12'>" +
                "<input id='ad_f_classesTaken' type='text' class='validate'>" +
                "<label for='ad_f_classesTaken'> Classes Taken </label>" +
            "</div>" +
            "<div id='ad_f_submissionError' class='submissionError'>" +
    
            "</div>" +
            "<button class='btn' id='ad_f_addNewStudent'> Add Student </button>"
        );
    }

    /* Retrieve city from the address */
    function retrieveCity (address) {
        address = address.substring(address.indexOf(", ") + 1);
        address = address.substring(0, address.indexOf(", "));
        return address.trim();
    }

    function moveAccordingly(role) {
        /* Check if user is logged in and move them accordingly. */
        console.log(role);
        if (role !== "admin" && role !== "mentor") {
            window.location.href = "/noPermission";
        }
    }

    /* Navigate back to Home Screen */
    $("#nb_return").on("click", function(){
        window.location.href = "/home";
    });

});