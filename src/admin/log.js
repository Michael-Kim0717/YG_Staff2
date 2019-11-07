$(document).ready(function(){

    /* Today's date for logging purposes */
    const weekRange = getWeekRange(new Date());

    const staffReference = firebase.database().ref('/Staff');
    const studentReference = firebase.database().ref('/Students');
    const adminLogReference = firebase.database().ref('/Log/' + weekRange);
    const allLogsReference = firebase.database().ref('/Log');

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
                
                appendPage(loggedInUser.role, loggedInUser.grade);
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    function appendPage (role, grade) {
        if (role === 'admin' && grade !== undefined) {
            $("#asl_container").append(
                "<h5 id='ml_title' class='center title'> Log for </h5>" +
                "<h6 class='ml_section'> Please submit logs by the end of the day! </h6>" +
                "<h6 id='ml_error_section' style='color: red'> * Required </h6>" +
                "<div class='ml_section'>" +
                    "<h6> Name: </h6>" +
                    "<input disabled value='' id='ml_f_name' type='text' class='validate'>" +
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Grade: </h6>" +
                    "<input disabled value='' id='ml_f_grade' type='text' class='validate'>" +
                "</div>" +
                "<div class='input-field ml_section row'>" +
                    "<h6> Missing Students and Reason for Absence: </h6>" +
                    "<div id='ml_f_student'> </div>" +
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Small Group Reflection * </h6>" +
                    "<textarea id='ml_f_sgReflection' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Relational Log * </h6>" +
                    "<textarea id='ml_f_relational' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Current Theme * </h6>" +
                    "<textarea id='ml_f_theme' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Prayer Request * </h6>" +   
                    "<textarea id='ml_f_prayerRequest' class='materialize-textarea'></textarea>" + 
                "</div>" +
                "<div class='ml_section'>" +
                    "<h6> Questions / Concerns </h6>" +    
                    "<textarea id='ml_f_questionsPMike' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div id='ml_f_submissionError' class='submissionError'> </div>" +
                "<button class='btn' id='ml_f_submitLog'> Submit </button>"
            );
            $("#ml_title").append(getStartOfWeek(weekRange));
            $("#ml_f_name").val(loggedInUser.name);
            $("#ml_f_grade").val(loggedInUser.grade);
            
            /* Follow-up Firebase database reference */
            const mentorLogReference = firebase.database().ref('/Log/' + weekRange + '/' + loggedInUser.grade);
            mentorLogReference.once('value', function(snapshot){
                if (snapshot.val() === null) {
                    studentReference.once('value', function(student_snapshot){
                        student_snapshot.forEach(function(student_snapshot){
                            if (loggedInUser.grade === (student_snapshot.val().grade)) {
                                const id = "ml_f_" + student_snapshot.key,
                                    absenceReason = "ml_f_" + student_snapshot.key + "Absence";
                                $("#ml_f_student").append(
                                    "<div class='student'>" +
                                        "<div class='col s5'>" +
                                            "<p> <label>" +
                                                "<input id='" + id + "' class='checkbox' type='checkbox' name='" + student_snapshot.val().name + "' />" +
                                                "<span>" + student_snapshot.val().name + "</span>" +
                                            "</label> </p>" +
                                        "</div>" +
                                        "<div class='input-field col s7'>" +
                                            "<input id='" + absenceReason + "' type='text' class='validate'>" +
                                            "<label for='" + absenceReason + "'> Reason for Absence </label>" +
                                        "</div>" +
                                    "</div>"
                                );
                            }
                        })
                    })
                }
                else {
                    $("#ml_container").empty();
                    $("#ml_container").append(
                        "<h5 class='center' style='margin-bottom: 3vh;'> Log has already been completed for this week! </h5>" +
                        "<button id='backHome' class='btn' style='margin: 0 auto; display: block;'> Back to Home </button>"  
                    );

                    $("#backHome").on("click", function(){
                        window.location.href = "/home";
                    })
                }
            });
            
            /* Submitting the Log */
            $("#ml_f_submitLog").on("click", function(){
                /* ERROR CONDITION: Check if 'Small Group Reflection' is filled. */
                if ($("#ml_f_sgReflection").val() === "") {
                    $("#ml_f_submissionError").empty();
                    $("#ml_f_submissionError").append(
                        "<h6 class='error'> Please Fill in the Required Field: 'Small Group Reflection' </h6>"
                    );
                }
                else {
                    if ($("#ml_f_theme").val() === "") {
                        /* ERROR CONDITION: Check if 'Theme' is filled. */
                        if ($("#ml_f_theme").val() === "") {
                            $("#ml_f_submissionError").empty();
                            $("#ml_f_submissionError").append(
                                "<h6 class='error'> Please Fill in the Required Field: 'Relational Log' </h6>"
                            );
                        }
                    }
                    else {
                        /* ERROR CONDITION: Check if 'Prayer Request' is filled. */
                        if ($("#ml_f_relational").val() === "") {
                            $("#ml_f_submissionError").empty();
                            $("#ml_f_submissionError").append(
                                "<h6 class='error'> Please Fill in the Required Field: 'Relational Log' </h6>"
                            );
                        }
                        else {
                            /* ERROR CONDITION: Check if 'Relational Log' is filled. */
                            if ($("#ml_f_prayerRequest").val() === "") {
                                $("#ml_f_submissionError").empty();
                                $("#ml_f_submissionError").append(
                                    "<h6 class='error'> Please Fill in the Required Field: 'Prayer Request' </h6>"
                                );
                            }
                            else {
                                var selected = [],
                                    attendance = [];
                                $('.student input:checked').each(function() {
                                    const id = $(this).attr('id');
                                    selected.push($(this).attr('name') + ": " + $("#" + id + "Absence").val());
                                });
                                
                                $('.checkbox').each(function(){
                                    let name = $(this).attr('name');
                                    if ($(this).is(':checked')){
                                        attendance.push(name + " ABSENT");
                                    }
                                    else {
                                        attendance.push(name + " PRESENT");
                                    }
                                });

                                const logDetails = {
                                    missingStudents: selected,
                                    reflection: $("#ml_f_sgReflection").val(),
                                    relational: $("#ml_f_relational").val(),
                                    prayerRequest: $("#ml_f_prayerRequest").val(),
                                    theme: $("#ml_f_theme").val(),
                                    questionsPMike: $("#ml_f_questionsPMike").val(),
                                    attendance: attendance
                                }
                                mentorLogReference.set(logDetails);
                                window.location.href = "/thankYou";
                            }
                        }
                    }
                }
            });
        }
    }

    /* Retrieves entire week range from Sunday to Saturday */
    function getWeekRange(today) {
        startOfWeekDay = today.getDate() - today.getDay();
        startOfWeekMonth = today.getMonth() + 1;
        endOfWeekMonth = today.getMonth() + 1;
        startOfWeekYear = today.getFullYear();
        endOfWeekYear = today.getFullYear();
        if (startOfWeekDay <= 0) {
            if (startOfWeekMonth == 3 && startOfWeekYear%4 == 0) {
                startOfWeekDay++;
            }
            startOfWeekMonth -= 1;
            if (startOfWeekMonth == 0) {
                startOfWeekMonth = 12;
                startOfWeekYear --;
            }
            let daysInMonth = daysInCurrentMonth(startOfWeekMonth);
            startOfWeekDay += daysInMonth;
        }
        else if (startOfWeekDay < 10) {
            startOfWeekDay = '0' + startOfWeekDay;
        }
        if (startOfWeekMonth < 10) {
            startOfWeekMonth = '0' + startOfWeekMonth;
        }
        today = startOfWeekYear.toString() + startOfWeekMonth.toString() + startOfWeekDay.toString() + "-" + endOfWeek(parseInt(endOfWeekYear), parseInt(endOfWeekMonth), parseInt(today.getDate() + (6 - today.getDay())));
        
        return today;
    }

    /* Returns the day at the end of the week (Saturday) */
    function endOfWeek(year, month, day) {
        let daysInMonth = daysInCurrentMonth(month);
        if (daysInMonth < day) {
            if (month === 2 && year%4 === 0) {
                day--;
            }
            day -= daysInMonth;
            month = parseInt(month) + 1;
        }
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        else if (month === 13) {
            year ++;
            month = "01";
        }
        return year + "" + month + "" + day;
    }

    /* Retrieves the start of the week */
    function getStartOfWeek(weekRange) {
        const year = weekRange.substring(0, 4),
            month = weekRange.substring(4, 6),
            day = weekRange.substring(6, 8);
        weekRange = month + "/" + day + "/" + year;
        return weekRange;
    }

    /* Return Days in Month */
    function daysInCurrentMonth(month) {
        switch(month) {
            case 2:
                return 28;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
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