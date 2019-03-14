$(document).ready(function(){

    /* Today's date for logging purposes */
    const weekRange = getWeekRange(new Date());

    const staffReference = firebase.database().ref('/Staff');
    const breakfastReference = firebase.database().ref('/Breakfast/' + weekRange);
    const allBreakfastReference = firebase.database().ref('/Breakfast');

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
            /* Mentor Breakfast Page:
                Append form to container.
                Form submission functionality.
                Title change.
                Check if the user is trying to open the breakfast form when it has been filled out.
            */
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
                    bagels: 0,
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
        else if (role === 'admin') {
            /* Admin Breakfast Page:
                Append details to page.
                Retrieve chart data and show.
                Retrieve other data and show.
            */

            $("#b_container").append(
                "<h5 id='ad_currentWeekRange'> </h5>" +
                "<canvas id='ab_chart' aspectRatio='1'>" +
            
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
                        if (childSnapshot.key !== 'completed') {
                            chartData.push(childSnapshot.val());
                        }
                    }
                });
                
                const container = $("#ab_chart");
                const breakfastChart = new Chart(container, {
                    type: 'horizontalBar',
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
                            xAxes: [{
                                ticks: {
                                    beginAtZero:true,
                                    stepSize: 1
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

            /* Delete Breakfast from other weeks. */
            allBreakfastReference.once('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    if (childSnapshot.key !== weekRange) {
                        allBreakfastReference.child(childSnapshot.key).remove();
                    }
                });
            });
        }
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
    $(".homeScreen").on("click", function(){
        window.location.href = "/home";
    });

});