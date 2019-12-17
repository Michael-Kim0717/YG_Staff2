$(document).ready(function(){
 
    /* Today's date for logging purposes */
    const weekRange = getWeekRange(new Date());
    const weekRangeForDevo = getWeekRangeForDevo(new Date());

    const staffReference = firebase.database().ref('/Staff');
    const adminLogReference = firebase.database().ref('/Log/' + weekRange);

    $("#nb_return").text("LOGOUT");

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
                
                appendPage(loggedInUser.role, loggedInUser.name, loggedInUser.grade);
            });
        }
        else {
            moveAccordingly("none");
        }
    });

    const devoReference = firebase.database().ref('/Devo/' + weekRangeForDevo);

    function appendPage (role, name, grade) {
        const welcomeText = "Welcome " + retrieveFirstName(loggedInUser.name);
        if (role === 'mentor') {
            /* Mentor Home Page:
                Change Welcome Text accordingly.
                Check to see if the mentor has already completed log and/or breakfast.
            */
            let logNavText = "Log";
            let devoNavText = "Devo";
            /* Removed 10/29/2019 */
            // let breakfastNavText = "Breakfast";
            const whatsNewText = 
            "11/11: <br/>" +
            "Mentors can now add students.";

            adminLogReference.once('value', function(logSnapshot){
                logSnapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.key === loggedInUser.grade) {
                        $("#logNavText").empty();
                        $("#logNavText").append(
                            "Completed"
                        );
                    }
                })
            });    
            
            devoReference.once('value', function(devoSnapshot){
                devoSnapshot.forEach(function(childSnapshot) {
                    console.log(childSnapshot);
                    if (childSnapshot.key === replaceSpaces(name) + grade && childSnapshot.val().submitted === 'y'){
                        $("#devoNavText").empty();
                        $("#devoNavText").append(
                            "Completed"
                        );
                    }
                })
            });
            /* Removed 10/29/2019 */
            /* firebase.database().ref('/Breakfast/' + weekRange + '/completed').once('value', function(breakfastSnapshot){
                breakfastSnapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.val() === loggedInUser.name.substring(0, 4) + loggedInUser.grade) {
                        $("#breakfastNavText").empty();
                        $("#breakfastNavText").append(
                            "Completed"
                        );
                    }
                })
            }); */

            $("#h_navigationContainer").append(
                "<h5 id='h_welcome' class='title'>" + welcomeText + "</h5>" +
                
                "<ul id='whatsNewContainer' class='collapsible'>" +
                    "<li>" +
                        "<div class='collapsible-header'> What's New? </div>" +
                        "<div class='collapsible-body'>" +
                            whatsNewText +
                        "</div>" +
                    "</li>" +
                "</ul>" +

                "<div id='logNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='logNavText' class='navigationText'>" + logNavText + "</h3>" +
                "</div>" +
                "<div id='devoNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='devoNavText' class='navigationText'>" + devoNavText + "</h3>" +
                "</div>" +
                /* Removed 10/29/2019 */
                /* "<div id='breakfastNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='breakfastNavText' class='navigationText'>" + breakfastNavText + "</h3>" +
                "</div>" +  */
                "<div id='directoryNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Directory </h3>" +
                "</div>" + 
                "<div id='attendanceNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Attendance </h3>" +
                "</div>" + 
                "<div id='addStudentNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Add Student </h3>" +
                "</div>"
            );

            $(".collapsible").collapsible();

            /* Navigate according to login status */
            $("#logNav").on("click", function(){
                if ($("#logNavText").text().trim() !== 'Completed') {
                    window.location.href = "/log"; 
                }
            });
            $("#devoNav").on("click", function(){
                if ($("#devoNavText").text().trim() !== 'Completed') {
                    window.location.href = "/devo";
                }
            });
            /* Removed 10/29/2019 */  
            /* $("#breakfastNav").on("click", function(){
                if ($("#breakfastNavText").text().trim() !== 'Completed') {
                    window.location.href = "/breakfast"; 
                }
            }); */
            $("#directoryNav").on("click", function(){
                window.location.href = "/directory"; 
            });
            $("#attendanceNav").on("click", function(){
                window.location.href = "/attendance";
            });
            $("#addStudentNav").on("click", function(){
                window.location.href = "/addStudent";
            });
        }
        else if (role === 'admin') {
            /* Admin Home Page: 
                Change Welcome Text accordingly.
                Add Admin specific pages to the home page.
            */
            const whatsNewText = "";
            
            $("#h_navigationContainer").append(
                "<h5 id='h_welcome' class='title'>" + welcomeText + "</h5>" +

                "<ul id='whatsNewContainer' class='collapsible'>" +
                    "<li>" +
                        "<div class='collapsible-header'> What's New? </div>" +
                        "<div class='collapsible-body'>" +
                            whatsNewText +
                        "</div>" +
                    "</li>" +
                "</ul>" +

                "<div id='logSubmitNav' class=''>" +
                    
                "</div>" +
                "<div id='logNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='logNavText' class='navigationText'> Log </h3>" +
                "</div>" +
                "<div id='devoSubmitNav' class=''>" +
                    
                "</div>" +
                "<div id='devoNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='devoNavText' class='navigationText'> Devo </h3>" +
                "</div>" +
                /* Removed 10/29/2019 */
                /* "<div id='breakfastNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 id='breakfastNavText' class='navigationText'> Breakfast </h3>" +
                "</div>" + */
                "<div id='directoryNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Student Directory </h3>" +
                "</div>" +
                "<div id='addStudentNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Add Student </h3>" +
                "</div>" +
                "<div id='staffDirectoryNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Staff Directory </h3>" +
                "</div>" +
                "<div id='attendanceNav' class='s10 offset-s1 navigation valign-wrapper'>" +
                    "<h3 class='navigationText'> Attendance </h3>" +
                "</div>"
            );

            if (grade !== undefined) {
                $("#logSubmitNav").addClass("s10 offset-s1 navigation valign-wrapper");
                $("#logSubmitNav").append("<h3 id='submitLogNavText' class='navigationText'> Submit Log </h3>");

                adminLogReference.once('value', function(logSnapshot){
                    logSnapshot.forEach(function(childSnapshot) {
                        if (childSnapshot.key === grade) {
                            $("#submitLogNavText").empty();
                            $("#submitLogNavText").append(
                                "Completed"
                            );
                        }
                    })
                }); 

                $("#devoSubmitNav").addClass("s10 offset-s1 navigation valign-wrapper");
                $("#devoSubmitNav").append("<h3 id='submitDevoNavText' class='navigationText'> Submit Devo </h3>");

                devoReference.once('value', function(devoSnapshot){
                    console.log(devoSnapshot.key)
                    devoSnapshot.forEach(function(childSnapshot) {
                        console.log(childSnapshot.key)
                        if (childSnapshot.key === replaceSpaces(name) + grade && childSnapshot.val().submitted === 'y') {
                            $("#submitDevoNavText").empty();
                            $("#submitDevoNavText").append(
                                "Completed"
                            );
                        }
                    })
                }); 
            }

            $(".collapsible").collapsible();

            /* Navigate according to login status */
            $("#logSubmitNav").on("click", function(){
                if ($("#submitLogNavText").text().trim() !== 'Completed') {
                    window.location.href = "/adminLog"; 
                }
            });
            $("#logNav").on("click", function(){
                window.location.href = "/log"; 
            });  
            $("#devoSubmitNav").on("click", function(){
                if ($("#submitDevoNavText").text().trim() !== 'Completed') {
                    window.location.href = "/adminDevo"; 
                }
            });  
            $("#devoNav").on("click", function(){
                window.location.href = "/devo"; 
            });  
            /* Removed 10/29/2019 */
            /* $("#breakfastNav").on("click", function(){
                window.location.href = "/breakfast"; 
            }); */
            $("#directoryNav").on("click", function(){
                window.location.href = "/directory"; 
            });
            $("#addStudentNav").on("click", function(){
                window.location.href = "/addStudent";     
            });
            $("#staffDirectoryNav").on("click", function(){
                window.location.href = "/staffDirectory";
            });
            $("#attendanceNav").on("click", function(){
                window.location.href = "/attendance";
            });
        }
    }

    function replaceSpaces (name) {
        while (name.indexOf(" ") !== -1) {
            let spaceIndex = name.indexOf(" ");
            name = name.substring(0, spaceIndex) + "_" + name.substring(spaceIndex + 1);
        }

        return name;
    }

    /* Retrieves entire week range from Monday to Sunday */
    function getWeekRangeForDevo(today) {
        startOfWeekDay = today.getDate() - today.getDay() + 1;
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
        today = startOfWeekYear.toString() + startOfWeekMonth.toString() + startOfWeekDay.toString() + "-" + endOfWeek(parseInt(endOfWeekYear), parseInt(endOfWeekMonth), parseInt(today.getDate() + (7 - today.getDay())));
        
        return today;
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

    /* Get the first name from the user */
    function retrieveFirstName (name) {
        return name.substring(0, name.indexOf(" "));
    }

    function moveAccordingly(role) {
        /* Check if user is logged in and move them accordingly. */
        if (role === "none") {
            window.location.href = "/noPermission";
        }
    }

    /* Navigate back to Login Screen */
    $("#nb_return").on("click", function(){
        firebase.auth().signOut().then(function() {
            firebase.auth().onAuthStateChanged(function(user){
                if (!user) {
                    window.location.href = "/";
                }
            })
        });
    });

});