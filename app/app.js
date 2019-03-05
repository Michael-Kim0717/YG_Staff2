$(document).ready(() => {

    /* Firebase Credentials */
    // Initialize Firebase
    var config = {
        /* TODO: Fill in .env variables. */
        apiKey: "AIzaSyA78aFMqSTt4MBNQuR5s3ERevKnGA4VJtY",
        authDomain: "byg-application.firebaseapp.com",
        databaseURL: "https://byg-application.firebaseio.com",
        projectId: "byg-application",
        storageBucket: "byg-application.appspot.com",
        messagingSenderId: "703932281959"
    };
    firebase.initializeApp(config);

    /* Today's date for logging purposes */
    const weekRange = getWeekRange(new Date());
    function getWeekRange(today) {
        startOfWeekDay = today.getDate() - today.getDay() + (today.getDay() === 0 ? -7 : 0);
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
        console.log("start of week: ", startOfWeekYear, startOfWeekMonth, startOfWeekDay);
        today = startOfWeekYear.toString() + startOfWeekMonth.toString() + startOfWeekDay.toString() + "-" + endOfWeek(parseInt(endOfWeekYear), parseInt(endOfWeekMonth), parseInt(today.getDate() + (6 - today.getDay())));
        
        return today;
    }
    function endOfWeek(year, month, day) {
        let daysInMonth = daysInCurrentMonth(month);
        if (daysInMonth < day) {
            if (month == 2 && year%4 == 0) {
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
        else if (month == 13) {
            year ++;
            month = "01";
        }
        console.log("end of week: ", year, month, day);
        return year + "" + month + "" + day;
    }

    /* Get Necessary Week */
    function getNextSunday(weekRange) {
        /* Returns 20190406 from 20190331-20190406 
            Separates year, month, day respectively to 2019 04 06
        */
        console.log(weekRange)
        let endOfWeek = weekRange.substring(9);
        let year = endOfWeek.substring(0, 4),
            month = endOfWeek.substring(4, 6),
            day = endOfWeek.substring(6);
        day = parseInt(day) + 1;

        /* Retrieves the amount of days in the month 
            Test case: 20190831
            Returns 31 from 08
            32 > 31, therefore change day to 32-31, month to 8+1
        */
        let daysInMonth = daysInCurrentMonth(month);
        if (day > daysInMonth) {
            day -= daysInMonth;
            month = parseInt(month) + 1;
        }

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10 && month.toString().length != 2) {
            month = "0" + month;
        }

        return month + "/" + day + "/" + year;
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

    /* Window locations */
    const href = window.location.href,
        origin = window.location.origin;

    /* Variables for local storage */
    const localStorage = window.localStorage,
        loggedInUser = {
            email: localStorage.getItem('email'),
            grade: localStorage.getItem('grade'),
            name: localStorage.getItem('name'),
            role: localStorage.getItem('role')
        };
    moveAccordingly();

    /* Firebase database references */
    const staffReference = firebase.database().ref('/Staff'),
        studentReference = firebase.database().ref('/Students'),
        breakfastReference = firebase.database().ref('/Breakfast/' + weekRange),
        adminLogReference = firebase.database().ref('/Log/' + weekRange),
        mentorLogReference = firebase.database().ref('/Log/' + weekRange + '/' + loggedInUser.grade);

    /* General Functionality */
        /* Navigate back to Home Screen */
        $(".homeScreen").on("click", function(){
            window.location.href = "/home.html";
        });

        /* Navigate back to Login Screen */
        $(".loginScreen").on("click", function(){
            window.location.href = "/index.html";
        });
        $(".logout").on("click", function(){
            firebase.auth().signOut().then(function() {
                localStorage.clear();
                window.location.href = "/index.html";
            });
        });
        
        /* Check if user is logged in and move them accordingly. */
        function moveAccordingly () {
            if (loggedInUser.role == 'admin') {
                switch (href) {
                    case origin + "/index.html" :
                    case origin + "/register.html" :
                        window.location.href = "/home.html";
                        break;
                    case origin + "/mentor/log.html" :
                    case origin + "/mentor/breakfast.html" :
                    case origin + "/mentor/directory.html" :
                    case origin + "/mentor/thankYou.html" :
                        window.location.href = "/noPermission.html";
                        break;
                }
            }
            else if (loggedInUser.role == 'mentor') {
                switch (href) {
                    case origin + "/index.html" :
                    case origin + "/register.html" :
                        window.location.href = "/home.html";
                        break;
                    case origin + "/admin/log.html" :
                    case origin + "/admin/breakfast.html" :
                    case origin + "/admin/directory.html" :
                    case origin + "/admin/addStudent.html" :
                        window.location.href = "/noPermission.html";
                        break;
                }
            }
            else {
                switch (href) {
                    case origin + "/home.html" :
                    case origin + "/admin/log.html" :
                    case origin + "/admin/breakfast.html" :
                    case origin + "/admin/directory.html" :
                    case origin + "/admin/addStudent.html" :
                    case origin + "/mentor/log.html" :
                    case origin + "/mentor/breakfast.html" :
                    case origin + "/mentor/directory.html" :
                    case origin + "/mentor/thankYou.html" :
                        window.location.href = "/noPermission.html";
                        break;
                }
            }
        }

        /* Activate all collapsible list views */
        $('.collapsible').collapsible();

        /* Activate all dropdown menus */
        $('.dropdown-trigger').dropdown();

        /* If the user is an admin, add some separate pages. */
        if (loggedInUser.role === 'admin' && href === origin + '/home.html') {
            $("#h_navigationContainer").append(
                "<div id='addStudentNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Add a Student </h3>" +
                "</div>"
            );
        }

    /* Registration Page Functionality */
        /* Registration button functionality */
        $("#r_f_register").on("click", function(){
            const email = $("#r_f_email").val(),
                password = $("#r_f_password").val(),
                confirmPassword = $("#r_f_confirmPassword").val(),
                registrationCode = $("#r_f_registrationCode").val();
            
            /* ERROR CONDITION: Check if any of the fields are empty */
            if (email === "" || password === "" || confirmPassword === "" || registrationCode === "") {
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
                    if (registrationCode === '0000') {
                        /* ERROR CONDITION: Check if the user email exists in the database */
                        staffReference.once('value', function(snapshot){
                            snapshot.forEach(function(childSnapshot){
                                if (email.toLowerCase() === (childSnapshot.val().email).toLowerCase()){
                                    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                                        console.log(error.message);
                                        $("#r_f_registrationError").empty();
                                        $("#r_f_registrationError").append(
                                            "<p class='error'>" +
                                                error.message + 
                                            "</p>"
                                        );
                                    });
                                    firebase.auth().onAuthStateChanged(function(user) {
                                        if (user) {
                                            localStorage.setItem('email', childSnapshot.val().email);
                                            localStorage.setItem('grade', childSnapshot.val().grade);
                                            localStorage.setItem('name', childSnapshot.val().name);
                                            localStorage.setItem('role', childSnapshot.val().role);
                                            window.location.href = "/home.html";
                                        }
                                    });
                                }
                            })  
                        });
                    }
                    else {
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

    /* Login Page Functionality */
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
                                    localStorage.setItem('email', childSnapshot.val().email);
                                    localStorage.setItem('grade', childSnapshot.val().grade);
                                    localStorage.setItem('name', childSnapshot.val().name);
                                    localStorage.setItem('role', childSnapshot.val().role);
                                    window.location.href = "/home.html";
                                }
                            })  
                        });
                    }
                });
            }
        });

    /* Home Page Functionality */
        /* Change Welcome Text accordingly. */
        if (href === origin + "/home.html") {
            $("#h_welcome").append(loggedInUser.name);
            if (loggedInUser.role === "mentor") {
                adminLogReference.once('value', function(logSnapshot){
                    logSnapshot.forEach(function(childSnapshot) {
                        if (childSnapshot.key === loggedInUser.grade) {
                            $("#logNav").html(
                                "<h3 id='logNavText' class='navigationText'> Completed </h3>"
                            )
                        }
                    })
                });
                
                firebase.database().ref('/Breakfast/' + weekRange + '/completed').once('value', function(breakfastSnapshot){
                    breakfastSnapshot.forEach(function(childSnapshot) {
                        if (childSnapshot.val() === loggedInUser.name.substring(0, 4) + loggedInUser.grade) {
                            $("#breakfastNav").html(
                                "<h3 id='breakfastNavText' class='navigationText'> Completed </h3>"
                            )
                        }
                    })
                });
            }
        }

        /* Navigate according to login status */
        $("#logNav").on("click", function(){
            if ($("#logNavText").text().trim() !== 'Completed') {
                window.location.href = loggedInUser.role === "mentor" ? "/mentor/log.html" : "/admin/log.html"; 
            }
        });  
        $("#breakfastNav").on("click", function(){
            if ($("#breakfastNavText").text().trim() !== 'Completed') {
                window.location.href = loggedInUser.role === "mentor" ? "/mentor/breakfast.html" : "/admin/breakfast.html"; 
            }
        });
        $("#directoryNav").on("click", function(){
            window.location.href = loggedInUser.role === "mentor" ? "/mentor/directory.html" : "/admin/directory.html"; 
        });
        $("#addStudentNav").on("click", function(){
            window.location.href = "/admin/addStudent.html";     
        });

    /* Mentor Log Functionality */
        /* Retrieves details */
        if (href === origin + "/mentor/log.html") {
            $("#ml_title").append(getNextSunday(weekRange));
            $("#ml_f_grade").val(loggedInUser.grade);
            mentorLogReference.once('value', function(snapshot){
                if (snapshot.val() == null) {
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
                        window.location.href = "/home.html";
                    })
                }
            });
        }
        /* Submitting the Log */
        $("#ml_f_submitLog").on("click", function(){
            /* ERROR CONDITION: Check if 'Small Group Reflection' is filled. */
            if ($("#ml_f_sgReflection").val() == "") {
                $("#ml_f_submissionError").empty();
                $("#ml_f_submissionError").append(
                    "<h6 class='error'> Please Fill in the Required Field: 'Small Group Reflection' </h6>"
                );
            }
            else {
                /* ERROR CONDITION: Check if 'Prayer Request' is filled. */
                if ($("#ml_f_relational").val() == "") {
                    $("#ml_f_submissionError").empty();
                    $("#ml_f_submissionError").append(
                        "<h6 class='error'> Please Fill in the Required Field: 'Relational Log' </h6>"
                    );
                }
                else {
                    /* ERROR CONDITION: Check if 'Relational Log' is filled. */
                    if ($("#ml_f_prayerRequest").val() == "") {
                        $("#ml_f_submissionError").empty();
                        $("#ml_f_submissionError").append(
                            "<h6 class='error'> Please Fill in the Required Field: 'Prayer Request' </h6>"
                        );
                    }
                    else {
                        var selected = [];
                        $('.student input:checked').each(function() {
                            const id = $(this).attr('id');
                            selected.push($(this).attr('name') + ": " + $("#" + id + "Absence").val());
                        });
                        console.log(selected);
                        const logDetails = {
                            missingStudents: selected,
                            reflection: $("#ml_f_sgReflection").val(),
                            relational: $("#ml_f_relational").val(),
                            prayerRequest: $("#ml_f_prayerRequest").val(),
                            questionsPMike: $("#ml_f_questionsPMike").val()
                        }
                        mentorLogReference.set(logDetails);
                        window.location.href = "/mentor/thankYou.html";
                    }
                }
            }
        });
    
    /* Mentor Breakfast Functionality */
        /* Change Title to Reflect what Date this Breakfast is for */
        if (href === origin + "/mentor/breakfast.html") {
            $("#mb_f_title").append("Breakfast for " + getNextSunday(weekRange));
            firebase.database().ref('/Breakfast/' + weekRange + '/completed').once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    if (loggedInUser.name.substring(0, 4) + loggedInUser.grade === childSnapshot.val()) {
                        $(".breakfastForm").empty();
                        $(".breakfastForm").append(
                            "<h5 class='center' style='margin-bottom: 3vh;'> The Breakfast Form has already been completed for this week! </h5>" +
                            "<button id='backHome' class='btn' style='margin: 0 auto; display: block;'> Back to Home </button>"  
                        );
    
                        $("#backHome").on("click", function(){
                            window.location.href = "/home.html";
                        })
                    }
                })
            });
        }

        /* Submit Breakfast */
        $("#mb_f_submitBreakfast").on("click", function(){
            let currentBreakfast = {
                bagel: 0,
                coffee: 0,
                fruits: 0,
                orangeJuice: 0,
                other: [],
                completed: [],
                yogurt: 0,
            }
            breakfastReference.once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    currentBreakfast[childSnapshot.key] = childSnapshot.val();
                });
                $('.breakfastForm input:checked').each(function() {
                    currentBreakfast[$(this).attr('id').substring(5)] ++;
                });
                if ($("#mb_f_suggestions").val() != "") {
                    currentBreakfast.other.push($("#mb_f_suggestions").val());
                }
                currentBreakfast.completed.push(loggedInUser.name.substring(0, 4) + loggedInUser.grade);
                breakfastReference.set(currentBreakfast);
                window.location.href = "/mentor/thankYou.html";
            });
        })

    /* Mentor Directory Functionality */
        /* Retrieve list of students from the database and show ONLY that mentor's grade. */
        if (href === origin + "/mentor/directory.html") {
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
                                        "<h6>" + childSnapshot.val().address + ", " + 
                                            childSnapshot.val().city + ", " + 
                                            childSnapshot.val().state +   
                                        "</h6> <br/>" + 
                                    "</span>" + 
                                "</div>" +
                            "</li>"
                        );
                    }
                })
            })
        }
    
    /* Mentor Thank You Page Functionality */
        /* Return the user back to the 'Home Page' */
        $("#mty_backHome").on("click", function(){
            window.location.href = "/home.html";
        });

    /* No Permission Page Functionality */
        /* Return the user back to the corresponding page */
        $("#np_backHome").on("click", function(){
            if (loggedInUser.role === "admin" || loggedInUser.role === "mentor") {
                window.location.href = "/home.html";
            }
            else {
                window.location.href = "/index.html";
            }
        });

    /* Admin Log Functionality */
        /* View the logs for each grade. */
        if (href === origin + "/admin/log.html") {
            $("#al_title").append(getNextSunday(weekRange));
            adminLogReference.once('value', function(log_snapshot){
                let missingLogs = [
                    "6B", "6G", 
                    "7B", "7G", 
                    "8B", "8G", 
                    "9B", "9G", 
                    "10B", "10G", 
                    "11B", "11G", 
                    "12B", "12G"
                ];
                log_snapshot.forEach(function(log_childSnapshot){
                    console.log(log_childSnapshot.val());
                    $("#al_logView").append(
                        "<li>" +
                            "<div class='collapsible-header'>" + log_childSnapshot.key + "</div>" +
                            "<div class='collapsible-body'>" +
                                "<span>" +
                                    "<div class='" + log_childSnapshot.key + weekRange + "'>" +
                                        "<h6> <b> Missing Students: </b> </h6>" +
                                    "</div> <br/>" +
                                    "<h6> <b> Small Group Reflection: </b> <br/>" + log_childSnapshot.val().reflection + "</h6> <br/>" +
                                    "<h6> <b> Prayer Request: </b> <br/>" + log_childSnapshot.val().prayerRequest + "</h6> <br/>" +
                                    "<h6> <b> Questions for Pastor Mike: </b> <br/>" + log_childSnapshot.val().questionsPMike + "</h6> <br/>" +
                                "</span>" + 
                            "</div>" +
                        "</li>"
                    );
                    if (undefined !== log_childSnapshot.val().missingStudents) {
                        for (let i = 0; i < log_childSnapshot.val().missingStudents.length; i++) {
                            $("." + log_childSnapshot.key + weekRange).append(
                                "<h6>" + log_childSnapshot.val().missingStudents[i] + "</h6>"
                            )
                        }
                    }
                    missingLogs = removeElementFromArray(missingLogs, log_childSnapshot.key);
                })
                for (let i = 0; i < missingLogs.length; i++){
                    if (i < missingLogs.length - 1) {
                        missingLogs[i] += ', ';
                    }
                    $("#al_missingLogs").append(
                        "<h6 class='al_missingLogGrade'> " + missingLogs[i] + " </h6>"
                    );
                }
            })
        }

        /* Remove a grade from an array to find who has yet to submit their log */
        function removeElementFromArray(grades, gradeToRemove) {
            for (let i = 0; i < grades.length; i++) {
                if (grades[i] === gradeToRemove) {
                    grades.splice(i, 1);
                }
            }
            return grades;
        }
    
    /* Admin Breakfast Functionality */
        /* Add the Chart of the Basic Options */
        if (href === origin + "/admin/breakfast.html") {
            let chartData = [];
            let others = [];
            $("#ad_currentWeekRange").append("Breakfast for " + getNextSunday(weekRange));
            breakfastReference.once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    if (childSnapshot.key === 'other'){
                        others = childSnapshot.val();
                    }
                    else {
                        chartData.push(childSnapshot.val());
                    }
                });
                
                const container = $("#ab_chart");
                const breakfastChart = new Chart(container, {
                    type: 'bar',
                    data: {
                        labels: ["Bagels", "Coffee", "Fruits", "Orange Juice", "Yogurt"],
                        datasets: [{
                            label: 'Votes',
                            data: chartData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });

                for (let i = 0; i < others.length; i++) {
                    $("#ad_otherList").append(
                        "<h6>" + others[i] + "</h6>"
                    )
                }
            });
        }

    /* Admin Directory Functionality */
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
                                        "<h6>" + student_childSnapshot.val().phone + "</h6> <br/>" + 
                                        "<h6> <b> Birthday: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().birthday + "</h6> <br/>" + 
                                        "<h6> <b> Address: </b> </h6>" +
                                        "<h6>" + student_childSnapshot.val().address + ", " + 
                                            student_childSnapshot.val().city + ", " + 
                                            student_childSnapshot.val().state +   
                                        "</h6> <br/>" + 
                                        
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
                            console.log("Editing " + "#" + student_childSnapshot.key + "Edit")
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
                                    "<button class='btn right' id='" + student_childSnapshot.key + "Delete'> Delete </button>" +
                                "</span>"
                            );
                            M.updateTextFields();
                            $("#" + student_childSnapshot.key + "Edit").text("Confirm Edit");
                            
                            $("#" + student_childSnapshot.key + "Edit").on("click", function(){
                                console.log("Confirming Edit for " + "#" + student_childSnapshot.key + "Edit")
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

    /* Add Student to Directory Functionality */
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
        /* Autocomplete functionality for City field */
        if (href === origin + "/admin/addStudent.html") {
            let studentCities = {};
            studentReference.once('value', function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    studentCities[childSnapshot.val().city] = null;
                });
                $('input.ad_f_city').autocomplete({data: studentCities});
            });
        }
        /* When the 'Add Student' button is pressed */
        $("#ad_f_addNewStudent").on("click", function(){
            /* ERROR CONDITION: Name is not filled */
            if ($("#ad_f_name").val() == "") {
                $("#ad_f_submissionError").empty();
                $("#ad_f_submissionError").append(
                    "<h6 class='error'> Please Fill in the Required Field: 'Name' </h6>"
                );
            }
            else {
                /* ERROR CONDITION: Grade is not filled */
                if ($("#ad_f_grade").val() == "") {
                    $("#ad_f_submissionError").empty();
                    $("#ad_f_submissionError").append(
                        "<h6 class='error'> Please Fill in the Required Field: 'Grade' </h6>"
                    );
                }
                else {
                    $("#ad_f_submissionError").empty();
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
                    $("#ad_f_name").val("");
                    $("#ad_f_grade").val("");
                    $("#ad_f_address").val("");
                    $("#ad_f_city").val("");
                    $("#ad_f_state").val("");
                    $("#ad_f_birthday").val("");
                    $("#ad_f_email").val("");
                    $("#ad_f_phoneNumber").val("");
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

});