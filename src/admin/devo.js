$(document).ready(function(){

    /* Today's date for logging purposes */
    const weekRange = getWeekRange(new Date());

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
        if (role === 'admin') {
            /* Admin Log Page:
                Append details to page.
                Append logs from database.
            */
                       /* Mentor Log Page:
                Append form to container.
                Check if the user has already completed the log for this week.
                Append students from database.
                Submit log button functionality.
            */
            const devoReference = firebase.database().ref('/Devo/passage');
            $("#adevo_container").append(
                "<h5 id='mdevo_title' class='center title'> Devo for </h5> <br/>" +
                "<div id='mdevo_save_update' class='submissionError success center'> </div>" +
                "<div class='row'>" +
                    "<div class='center input-field col s8'>" + 
                        "<input id='mdevo_passage' type='text' class='validate'>" +
                    "</div>" +
                    "<div class='input-field col s4'>" + 
                        "<button class='btn' id='mdevo_f_submitPassage'> Save </button>" +
                    "</div>" +
                "</div>" +
                "<div id='mdevo_passage_update' class='submissionError success center'> </div>" +
                "<div class='mdevo_section'>" +
                    "<h6> What Happened? </h6>" +
                    "<textarea id='mdevo_f_summary' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div class='mdevo_section'>" +
                    "<h6> What are three questions you have about this passage? <br/> Try and attempt to answer them through prayer and what is being said in light of the whole chapter. </h6>" +
                    "<textarea id='mdevo_f_questions' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div class='mdevo_section'>" +
                    "<h6> In what ways does today’s devotional change the way you think, act, and feel? </h6>" +
                    "<textarea id='mdevo_f_affect' class='materialize-textarea'></textarea>" +
                "</div>" +
                "<div id='mdevo_f_submissionError' class='submissionError'> </div>" +
                "<button class='btn' id='mdevo_f_submitDevo'> Submit </button>"
            );
            devoReference.once('value', function(snapshot){    
                $("#mdevo_passage").val(snapshot.val());
            });
            $("#mdevo_title").append(getNextSunday(weekRange));
            
            /* Follow-up Firebase database reference */
            const mentorDevoReference = firebase.database().ref('/Devo/' + weekRange + '/' + replaceSpaces(loggedInUser.name) + loggedInUser.grade);
            
            /* Add values of previously saved devo into the current devo. */

            mentorDevoReference.once('value', function(snapshot){
                if (snapshot.val() !== null) {
                    if (snapshot.val().submitted === 'y') {
                        $("#adevo_container").empty();
                        $("#adevo_container").append(
                            "<h5 class='center' style='margin-bottom: 3vh;'> Devo has already been completed for this week! </h5>" +
                            "<button id='backHome' class='btn' style='margin: 0 auto; display: block;'> Back to Home </button>"  
                        );
    
                        $("#backHome").on("click", function(){
                            window.location.href = "/home";
                        })   
                    }
                    else if (snapshot.val().submitted === 'n') {
                        if (undefined !== snapshot.val().summary)
                            $("#mdevo_f_summary").val(snapshot.val().summary);
                        if (undefined !== snapshot.val().questions)
                            $("#mdevo_f_questions").val(snapshot.val().questions);
                        if (undefined !== snapshot.val().affect)
                            $("#mdevo_f_affect").val(snapshot.val().affect);
                    }
                }
            });

            const saveInterval = setInterval(function(){
                const devoDetails = {
                    name: loggedInUser.name,
                    submitted: 'n',
                    summary: $("#mdevo_f_summary").val(),
                    questions: $("#mdevo_f_questions").val(),
                    affect: $("#mdevo_f_affect").val()
                }
                mentorDevoReference.set(devoDetails);
                $("#mdevo_save_update").append("Saving...");
                $("#mdevo_save_update").append(
                    '<div class="progress">' +
                        '<div class="indeterminate"></div>' +
                    '</div>'
                );
                setTimeout(function(){
                    $("#mdevo_save_update").empty();
                }, 2000);
            }, 10000);
            
            $("#mdevo_f_submitPassage").on("click", function(){
                devoReference.set($("#mdevo_passage").val());
                $("#mdevo_passage_update").append("The passage was updated.");
                setTimeout(function(){
                    $("#mdevo_passage_update").empty();
                }, 2000);
            });

            /* Submitting the Log */
            $("#mdevo_f_submitDevo").on("click", function(){
                /* ERROR CONDITION: Check if 'What Happened?' is filled. */
                if ($("#mdevo_f_summary").val() === "") {
                    $("#mdevo_f_submissionError").empty();
                    $("#mdevo_f_submissionError").append(
                        "<h6 class='error'> Please Fill in the Required Field: 'What Happened?' </h6>"
                    );
                }
                else {
                    if ($("#mdevo_f_questions").val() === "") {
                        /* ERROR CONDITION: Check if 'Three Questions' is filled. */
                        if ($("#mdevo_f_questions").val() === "") {
                            $("#mdevo_f_submissionError").empty();
                            $("#mdevo_f_submissionError").append(
                                "<h6 class='error'> Please Fill in the Required Field: 'What are three questions you have about this passage?' </h6>"
                            );
                        }
                    }
                    else {
                        /* ERROR CONDITION: Check if 'Devotional Change' is filled. */
                        if ($("#mdevo_f_affect").val() === "") {
                            $("#mdevo_f_submissionError").empty();
                            $("#mdevo_f_submissionError").append(
                                "<h6 class='error'> Please Fill in the Required Field: 'In what ways does today's devotional change the way you think, act, and feel?' </h6>"
                            );
                        }
                        else {
                            clearInterval(saveInterval);
                            const devoDetails = {
                                name: loggedInUser.name,
                                submitted: 'y',
                                summary: $("#mdevo_f_summary").val(),
                                questions: $("#mdevo_f_questions").val(),
                                affect: $("#mdevo_f_affect").val()
                            }
                            mentorDevoReference.set(devoDetails);
                            setTimeout(function(){
                                window.location.href = "/thankYou";
                            }, 2500);
                        }
                    }
                }
            });
        }
    }

    /* Removes all instance of the character '&' from string. */
    function removeAnd (logSnippet) {
        while (logSnippet.indexOf("&") !== -1) {
            let andIndex = logSnippet.indexOf("&");
            logSnippet = logSnippet.substring(0, andIndex) + "and" + logSnippet.substring(andIndex + 1);
        }

        return logSnippet;
    }

    function replaceSpaces (name) {
        while (name.indexOf(" ") !== -1) {
            let spaceIndex = name.indexOf(" ");
            name = name.substring(0, spaceIndex) + "_" + name.substring(spaceIndex + 1);
        }

        return name;
    }

    /* Retrieves entire week range from Monday to Sunday */
    /* Ex. this week 3/11 - 3/17 */
    function getWeekRange(today) {
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

    /* Get Necessary Week */
    function getNextSunday(weekRange) {
        /* Returns 20190406 from 20190331-20190406 
            Separates year, month, day respectively to 2019 04 06
        */
        let endOfWeek = weekRange.substring(9);
        let year = endOfWeek.substring(0, 4),
            month = endOfWeek.substring(4, 6),
            day = endOfWeek.substring(6);
        day = parseInt(day);

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