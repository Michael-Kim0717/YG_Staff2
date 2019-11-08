$(document).ready(function(){

    const staffReference = firebase.database().ref('/Staff');
    const studentReference = firebase.database().ref('/Students');
    const attendanceReference = firebase.database().ref('/Attendance');

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
            $("#att_container").append(
                "<h5 id='ma_title' class='center title'> </h5>" +
             
                "<div class='outer'>" +
                    "<div class='inner'>" +
                        "<table id='att_attendanceTable'>" + 
                            "<tr id='att_attendanceTableDates'>" +
                                "<th class='center'> DATE: </th>" +
                            "</tr>" + 
                        "</table>" +
                    "</div>" +
                "</div>"
            );

            /* Retrieve list of students from the database and show ONLY that mentor's grade. */
            $("#ma_title").append(loggedInUser.grade + " Attendance");

            /* Using 'test' attendance information, we will gather a list of dates that are created when staff submits a log */
            let dates = [];
            let dateReference = attendanceReference.child("test");
            dateReference.once('value', function(date_snapshot){
                date_snapshot.forEach(function(date_childSnapshot){
                    dates.push(date_childSnapshot.key);
                    $("#att_attendanceTableDates").append("<td class='center' style='width: 100px;'>" + date_childSnapshot.key.substring(5) + "</td>")
                })
            })

            /* For each student, we are going to grab their recorded attendance.
               Green represents present
               Red represents absent or not entered
            */
            studentReference.once('value', function(student_snapshot){
                student_snapshot.forEach(function(student_childSnapshot){
                    if (student_childSnapshot.val().grade === loggedInUser.grade) {
                        let studentAttendance = "<th>" + student_childSnapshot.val().name + "</th>";
                        for (let i = 0; i < dates.length; i ++){
                            studentsAttendanceReference = attendanceReference.child(student_childSnapshot.val().name + '_' + student_childSnapshot.key).child(dates[i]);
                            studentsAttendanceReference.on("value", function(attendance_snapshot){
                                if (attendance_snapshot.val() === 'P') {
                                    studentAttendance += "<td class='green' style='border: 1px solid black;'> </td>";
                                }
                                else {
                                    studentAttendance += "<td class='red' style='border: 1px solid black;'> </td>";
                                }
                            })
                        }
                        setTimeout(function() {
                            $("#att_attendanceTable").append("<tr id='att_attendanceTable_" + student_childSnapshot.val().name + "_" + student_childSnapshot.key + "'>" + studentAttendance + "</tr>");
                        }, 1000);
                    }
                })
            })
        }
        else if (role === 'admin') {
            $("#att_container").append(
            "<h6 style='float: left;'> Grade Selection: </h6>" +
            "<button id='att_dropdownButton' class='dropdown-trigger btn' href='#' data-target='att_grades'> - </button>" +
            
            "<ul id='att_grades' class='dropdown-content'>" +
                "<li class='att_gradeSelection'> 6B </li> <li class='att_gradeSelection'> 6G </li>" +
                "<li class='att_gradeSelection'> 7B </li> <li class='att_gradeSelection'> 7G </li>" +
                "<li class='att_gradeSelection'> 8B </li> <li class='att_gradeSelection'> 8G </li>" +
                "<li class='att_gradeSelection'> 9B </li> <li class='att_gradeSelection'> 9G </li>" +
                "<li class='att_gradeSelection'> 10B </li> <li class='att_gradeSelection'> 10G </li>" +
                "<li class='att_gradeSelection'> 11B </li> <li class='att_gradeSelection'> 11G </li>" +
                "<li class='att_gradeSelection'> 12B </li> <li class='att_gradeSelection'> 12G </li>" +
            "</ul> <br/> <br/>" +

            "<div class='outer'>" +
                "<div class='inner'>" +
                    "<table id='att_attendanceTable'>" + 
                        "<tr id='att_attendanceTableDates'> </tr>"+
                    "</table>" +
                "</div>" +
            "</div>"
        );
        
        /* Activate all dropdown menus */
        $('.dropdown-trigger').dropdown();

        /* When a dropdown menu item is pressed, change the value in the button and update the table accordingly. */
        $(".att_gradeSelection").on("click", function(){
            /* Sets button text to current grade. */
            const gradeSelection = $(this)[0].innerHTML.trim();
            $("#att_dropdownButton").text(gradeSelection);

            /* Clear the attendance table when another grade is selected */
            $("#att_attendanceTable").empty();
            $("#att_attendanceTable").append("<tr id='att_attendanceTableDates'>");
            $("#att_attendanceTableDates").append("<th class='center'> DATE: </th>")

            /* Using 'test' attendance information, we will gather a list of dates that are created when staff submits a log */
            let dates = [];
            let dateReference = attendanceReference.child("test");
            dateReference.once('value', function(date_snapshot){
                date_snapshot.forEach(function(date_childSnapshot){
                    dates.push(date_childSnapshot.key);
                    $("#att_attendanceTableDates").append("<td class='center' style='width: 100px;'>" + date_childSnapshot.key.substring(5) + "</td>")
                })
            })

            /* For each student, we are going to grab their recorded attendance.
               Green represents present
               Red represents absent or not entered
            */
            studentReference.once('value', function(student_snapshot){
                student_snapshot.forEach(function(student_childSnapshot){
                    if (student_childSnapshot.val().grade === gradeSelection) {
                        let studentAttendance = "<th>" + student_childSnapshot.val().name + "</th>";
                        for (let i = 0; i < dates.length; i ++){
                            studentsAttendanceReference = attendanceReference.child(student_childSnapshot.val().name + '_' + student_childSnapshot.key).child(dates[i]);
                            studentsAttendanceReference.on("value", function(attendance_snapshot){
                                if (attendance_snapshot.val() === 'P') {
                                    studentAttendance += "<td class='green' style='border: 1px solid black;'> </td>";
                                }
                                else {
                                    studentAttendance += "<td class='red' style='border: 1px solid black;'> </td>";
                                }
                            })
                        }
                        setTimeout(function() {
                            $("#att_attendanceTable").append("<tr id='att_attendanceTable_" + student_childSnapshot.val().name + "_" + student_childSnapshot.key + "'>" + studentAttendance + "</tr>");
                        }, 1000);
                    }
                })
            })
        });

        /* Activate the Confirmation modal */
        $('.modal').modal();
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