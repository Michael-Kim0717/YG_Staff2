$(document).ready(setTimeout(() => {

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

    /* Window locations */
    const href = (window.location.href).toLowerCase(),
        origin = (window.location.origin).toLowerCase();

    /* Firebase database references */
    const staffReference = firebase.database().ref('/Staff'),
        studentReference = firebase.database().ref('/Students'),
        breakfastReference = firebase.database().ref('/Breakfast/' + weekRange),
        adminLogReference = firebase.database().ref('/Log/' + weekRange);

    /* Get Current Logged in User */
    const user = firebase.auth().currentUser;
    let loggedInUser = {
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        grade: localStorage.getItem('grade'),
        role: localStorage.getItem('role'),
    };
    /* if (user) {
        console.log("yes");
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
            
            console.log(loggedInUser);
        });
    }
    else {
        console.log("no");
    } */

    /* Follow-up Firebase database reference */
    const mentorLogReference = firebase.database().ref('/Log/' + weekRange + '/' + loggedInUser.grade);

    /* General Functionality */
        /* Navigate back to Home Screen */
        $(".homeScreen").on("click", function(){
            window.location.href = "/home";
        });

        /* Navigate back to Login Screen */
        $(".loginScreen").on("click", function(){
            window.location.href = "/";
        });
        $(".logout").on("click", function(){
            firebase.auth().signOut().then(function() {
                localStorage.clear();
                window.location.href = "/";
            });
        });
        
        /* Check if user is logged in and move them accordingly. */
        function moveAccordingly () {
            if (loggedInUser.role === "admin") {
                switch (href) {
                    case origin + "/" :
                    case origin + "/register" :
                        window.location.href = "/home";
                        break;
                    case origin + "/thankyou" :
                        window.location.href = "/noPermission";
                        break;
                }
            }
            else if (loggedInUser.role === "mentor") {
                switch (href) {
                    case origin + "/" :
                    case origin + "/register" :
                        window.location.href = "/home";
                        break;
                    case origin + "/addstudent" :
                        window.location.href = "/noPermission";
                        break;
                }
            }
            else {
                switch (href) {
                    case origin + "/home" :
                    case origin + "/log" :
                    case origin + "/breakfast" :
                    case origin + "/directory" :
                    case origin + "/addstudent" :
                    case origin + "/thankyou" :
                        window.location.href = "/noPermission";
                        break;
                }
            }
        }

        /* If the user is an admin, add some separate pages. */
        if (loggedInUser.role === "admin" && href === origin + '/home') {
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
                                            window.location.href = "/home";
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
                                    window.location.href = "/home";
                                }
                            })  
                        });
                    }
                });
            }
        });

    /* Home Page Functionality */
        /* Change Welcome Text accordingly. */
        if (href === origin + "/home") {
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
                window.location.href = "/log"; 
            }
        });  
        $("#breakfastNav").on("click", function(){
            if ($("#breakfastNavText").text().trim() !== 'Completed') {
                window.location.href = "/breakfast"; 
            }
        });
        $("#directoryNav").on("click", function(){
            window.location.href = "/directory"; 
        });
        $("#addStudentNav").on("click", function(){
            window.location.href = "/addStudent";     
        });

    /* Log Functionality */
        /* Retrieves details */
        if (href === origin + "/log") {
            if (loggedInUser.role === "mentor") {
                $("#l_container").append(
                    "<h5 id='ml_title' class='center'> Log for </h5>" +
                    "<h6 class='ml_section'> Please submit logs by the end of the day! </h6>" +
                    "<h6 id='ml_error_section' style='color: red'> * Required </h6>" +
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
                        "<h6> Prayer Request * </h6>" +   
                        "<textarea id='ml_f_prayerRequest' class='materialize-textarea'></textarea>" + 
                    "</div>" +
                    "<div class='ml_section'>" +
                        "<h6> Questions for Pastor Mike </h6>" +    
                        "<textarea id='ml_f_questionsPMike' class='materialize-textarea'></textarea>" +
                    "</div>" +
                    "<div id='ml_f_submissionError' class='submissionError'> </div>" +
                    "<button class='btn' id='ml_f_submitLog'> Submit </button>"
                );
                $("#ml_title").append(getStartOfWeek(weekRange));
                $("#ml_f_grade").val(loggedInUser.grade);
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
                                window.location.href = "/thankYou";
                            }
                        }
                    }
                });
            }
            else if (loggedInUser.role === "admin") {
                $("#l_container").append(
                    "<h5 id='al_title'> Logs for </h5>" +
                    "<div id='al_missingLogs'>" +
                        "<b> <h6> Missing Logs from : </h6> </b>" +
                    "</div>" +
                    "<ul id='al_logView' class='collapsible'>" +
                    "</ul>"
                );
                
                /* Activate all collapsible list views */
                $('.collapsible').collapsible();
                
                /* View the logs for each grade. */
                $("#al_title").append(getStartOfWeek(weekRange));
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
                                        "<h6> <b> Relational Log: </b> <br/>" + log_childSnapshot.val().relational + "</h6> <br/>" +
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
    
    /* Breakfast Functionality */
        if (href === origin + "/breakfast") {
            if (loggedInUser.role === "mentor") {
                $("#b_container").append(
                    "<h5 id='mb_f_title'> </h5>" +
                    "<p> <label>" +
                        "<input id='mb_f_coffee' type='checkbox' />" +
                        "<span> Coffee </span>" +
                    "</label> </p>" +
                    "<p> <label>" +
                        "<input id='mb_f_orangeJuice' type='checkbox' />" +
                        "<span> Orange Juice </span>" +
                    "</label> </p>" +
                    "<p> <label>" +
                        "<input id='mb_f_fruits' type='checkbox' />" +
                        "<span> Fruits </span>" +
                    "</label> </p>" +
                    "<p> <label>" +
                        "<input id='mb_f_yogurt' type='checkbox' />" +
                        "<span> Yogurt </span>" +
                    "</label> </p>" +
                    "<p> <label>" +
                        "<input id='mb_f_bagels' type='checkbox' />" +
                        "<span> Bagels (If you want something else besides Plain, please let me know below!) </span>" +
                    "</label> </p>" +
                    "<div class='input-field col s12'>" +
                        "<input id='mb_f_suggestions' type='text' class='validate'>" +
                        "<label for='mb_f_suggestions'>Suggestions/Other</label>" +
                    "</div>" +
                    "<button class='btn' id='mb_f_submitBreakfast'> Submit </button>"
                );

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
                        window.location.href = "/thankYou";
                    });
                })

                /* Change Title to Reflect what Date this Breakfast is for */
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
                                window.location.href = "/home";
                            })
                        }
                    })
                });
            }
            else if (loggedInUser.role === "admin") {
                $("#b_container").append(
                    "<h5 id='ad_currentWeekRange'> </h5>" +
                    "<canvas id='ab_chart' aspectRatio='0.5'>" +
                
                    "</canvas>" +
                    "<div id='ad_otherList'>" +
                        "<h5> Other Suggestions: </h5>" +
                    "</div>"
                );
                
                /* Add the Chart of the Basic Options */
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
        }

    /* Directory Functionality */
        if (href === origin + "/directory") {
            if (loggedInUser.role === "mentor") {
                $("#d_container").append(
                    "<h5 id='md_title'> </h5>" +
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
            else if (loggedInUser.role === "admin") {
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
                    "</ul>"
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
            }
        }
    
    /* Mentor Thank You Page Functionality */
        /* Return the user back to the 'Home Page' */
        $("#mty_backHome").on("click", function(){
            window.location.href = "/home";
        });

    /* No Permission Page Functionality */
        /* Return the user back to the corresponding page */
        $("#np_backHome").on("click", function(){
            if (loggedInUser.role === "admin" || loggedInUser.role === "mentor") {
                window.location.href = "/home";
            }
            else {
                window.location.href = "/";
            }
        });

    /* Add Student to Directory Functionality */
        /* Autocomplete functionality for City field */
        if (href === origin + "/addstudent") {
            if (loggedInUser.role === "admin") {
                $("#ad_container").append(
                    "<h6 id='ad_error_section' class='error'> * Required </h6>" +
                    "<h6 class='ad_f_title'> Add a Student </h6>" +
                    "<div class='input-field col s12'>" +
                        "<input id='ad_f_name' type='text' class='validate'>" +
                        "<label for='ad_f_name'> Name * </label>" +
                    "</div>" +
                    "<div class='input-field col s12'>" +
                        "<input id='ad_f_grade' type='text' class='validate ad_f_grade'>" +
                        "<label for='ad_f_grade'> Grade * </label>" +
                    "</div>" +
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
                        "<input id='ad_f_phoneNumber' type='number' class='validate'>" +
                        "<label for='ad_f_phoneNumber'> Phone Number </label>" +
                    "</div>" +
                    "<div id='ad_f_submissionError' class='submissionError'>" +

                    "</div>" +
                    "<button class='btn' id='ad_f_addNewStudent'> Add Student </button>"
                );

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
                        if ($("#ad_f_grade").val() === "") {
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
                        studentCities[childSnapshot.val().city] = null;
                    });
                    $('input.ad_f_city').autocomplete({data: studentCities});
                });
            }
        }

}, 1000));