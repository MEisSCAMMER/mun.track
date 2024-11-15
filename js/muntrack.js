// Copyright (c) 2014 Nikhil Benesch <nikhil.benesch@gmail.com>
// All modifications to this fork copyright (c) 2024 Ishaan Ramesh
//
// This file is part of mun.track.
//
// mun.track is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License version 3 as published by
// the Free Software Foundation.
//
// mun.track is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
// A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with mun.track. If not, see <http://www.gnu.org/licenses/>.
//noinspection JSUnresolvedReference

const VERSION = "1.1.0";

let countryList = ["Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa",
    "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia",
    "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
    "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia", "Bosnia and Herzegovina",
    "Botswana", "Brazil", "British Indian Ocean Territory", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands",
    "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands",
    "Colombia", "Comoros", "Congo", "DR Congo", "Democratic Republic of the Congo", "Cook Islands", "Costa Rica",
    "Cote D'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana",
    "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar",
    "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Heard Island and Mcdonald Islands", "Holy See", "Honduras", "Hong Kong",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy",
    "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "South Korea", "North Korea", "Korea",
    "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao",
    "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico",
    "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco",
    "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
    "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia",
    "Rwanda", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan",
    "Suriname", "Svalbard", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands",
    "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands, British", "Virgin Islands, U.S.",
    "Western Sahara", "Yemen", "Zambia", "Zimbabwe"];

let isCountryPrompt = false;
let isPrompt = false;
let isFullScreenShowing = false;
let mobileCode = null;
let callback = null;

let country;
let timer = null;
let bigTimer = null;
let mcTimer1 = null; //(m)od (c)aucus
let modSpeakerTime = null;
let modMode = false;
let modPaused = false;
let bigTimerMode = false;
let bigTimerPaused = false;

let list = 0;
let quorum = null;
let current = [0, 0, 0];
let title = "mun.track";
let names = ["Rolling", "General", "Voting"];
let times = [0, 0, 0];
let countries = [[], [], []];
let extensions = [0, 0, 0];
let extensionTimes = [0, 0, 0];
let tally = [0, 0, 0];


$(document).ready(function () {
    $("#help").dialog({
        modal: true, width: 450,
        resizable: false, draggable: false,
        show: "fade", hide: "fade",
        close: function () {
            $("#command").focus()
        },
        autoOpen: false
    });

    $("#update").dialog({
        modal: true, width: 300, minHeight: 50,
        resizable: false, draggable: false,
        show: "fade", hide: "fade",
        close: function () {
            $("#command").focus()
        },
        buttons: {
            "Cool beans": function () {
                $(this).dialog("close")
            }
        },
        autoOpen: false
    });

    $("#vote").dialog({
        modal: true, dialogClass: "big",
        width: 900, minHeight: 50,
        resizable: false, draggable: false,
        show: "fade", hide: "explode",
        close: function () {
            print("ready");
            $("#controller").css("zIndex", 1);
            $("#command").focus()
        },
        autoOpen: false
    });

    $("#timer").dialog({
        modal: true, dialogClass: "big",
        width: 900, minHeight: 50,
        resizable: false, draggable: false,
        show: "fade", hide: "explode",
        close: function () {
            $("#timer").stop(true, true);
            print("ready");
            $("#controller").css("zIndex", 1);
            $("#command").focus()
        },
        autoOpen: false
    });

    $("#fullscreen").dialog({
        modal: true, dialogClass: "big",
        width: 800, minHeight: 50,
        show: "fade", hide: "explode",
        resizable: false, draggable: false,
        close: function () {
            $("#command").focus()
        },
        autoOpen: false//, closeOnEscape: false
    });

    $("#mod").dialog({
        modal: true, dialogClass: "big",
        width: 800, minHeight: 50,
        show: "fade", hide: "explode",
        resizable: false, draggable: false,
        close: function () {
            $("#total-time").stop(true, true);
            // $("#speaker-time").stop(true, true); //for when this is implemented
            print("ready");
            $("#command").focus()
        },
        autoOpen: false
    });

    $("#urlupdated").dialog({
        modal: true, dialogClass: "big",
        width: 800, minHeight: 50,
        show: "fade", hide: "explode",
        resizable: false, draggable: false,
        close: function () {
            $("#command").focus()
        },
        autoOpen: false//, closeOnEscape: false
    });


    retrieve();
    boot();
    setInterval(store, 10000);
    setInterval(checkFullScreen, 500);

    $(window).resize(checkFullScreen);


    $("#command").keydown(keydownHandler);
    $("#command").keyup(function() {
        if (isCountryPrompt && isPrompt && $(this).val().length > 3) {
            print(findCountry($(this).val()));
        }
    });
    $("body").mouseup(function() {
        $("#command").focus();
    });

    //prevent the link from opening automatically once the help dialog is opened
    $("#source-code-link").keypress(function(e) {
        if(e.which===13) { //on enter
            e.preventDefault();
            $("#source-code-link").blur(); //and de-focus the link
        }
    });

    $(window).unload(function() {});
    $("#command").focus();
});

function compareTimes(time1, time2) {
    //check if times are in mm:ss format
    let rgx = /^\d{1,2}:\d{2}$/;
    if (!time1.match(rgx) || !time2.match(rgx)) return NaN;

    let time1Arr = time1.split(":");
    let time2Arr = time2.split(":");
    let time1Sec = parseInt(time1Arr[0]) * 60 + parseInt(time1Arr[1]);
    let time2Sec = parseInt(time2Arr[0]) * 60 + parseInt(time2Arr[1]);
    return time1Sec - time2Sec;
}

function keydownHandler(event) {
    if (event.which === 13) { //enter
        let cmd = $("#command").val();
        if(modMode && cmd === "") {
            if($("#total-time").html() === "0:00") return;
            clearInterval(mcTimer1);
            $("#speaker-time").html(modSpeakerTime);
            //if speaker time is more than total time, set total time to speaker time as well
            if(compareTimes($("#total-time").html(), modSpeakerTime) < 0) {
                $("#total-time").html(modSpeakerTime);
            }
            $("#speaker-time").css("color", "white");
            mcTimer1 = null;
            mcTimer1 = setInterval(modTick, 1000);
        } else {
            $("#command").val("");
            process(cmd);
        }

    } else if (event.which === 32 && !isPrompt) { //spacebar
        if(bigTimerMode) {
            if(!bigTimerPaused) {
                if($("#timer").html() === "0:00") return;
                clearInterval(bigTimer);
                bigTimer = null;
            } else bigTimer = setInterval(bigTick, 1000);
            bigTimerPaused = !bigTimerPaused;
        } else if(modMode) {
            if(!modPaused) {
                if($("#timer").html() === "0:00") return;
                clearInterval(mcTimer1);
                // clearInterval(tim)
                mcTimer1 = null;
            } else mcTimer1 = setInterval(modTick, 1000);
            modPaused = !modPaused;
        } else {
            if (!timer) {
                timer = setInterval(tick, 1000);
            } else {
                clearInterval(timer);
                timer = null;
            }
        }

        $("#command").val("");
        event.stopPropagation();
        return false;
    } else if (event.which === 27) { //escape
        //clear timers
        if(bigTimer !== null) {
            clearInterval(bigTimer);
            bigTimer = null;
        } else if(mcTimer1 !== null) {
            clearInterval(mcTimer1);
            mcTimer1 = null;
        }
        isPrompt = false;
        if(modMode) modMode = false;
        if(bigTimerMode) bigTimerMode = false;
        callback = null;
        $(this).val("");
        print("ready");
    }
}

function checkFullScreen() {
    if ($(window).height() < screen.height - 50) {
        if (!isFullScreenShowing) {
            isFullScreenShowing = true;
            //$("#fullscreen").dialog("open");
        }
    } else {
        if (isFullScreenShowing) {
            isFullScreenShowing = false;
            $("#fullscreen").dialog("close");
        }
    }
}

function tick() {
    let seconds = parseInt($("#info-time").html());
    if (seconds > 0) {
        $("#info-time").html((parseInt($("#info-time").html()) - 1) + " seconds");
    }
    if (seconds <= 11) {
        $("#info-time").css("color", "#aa0");
    }
    if (seconds <= 1) {
        $("#info-time").css("color", "#a20");
        clearTimeout(timer);
        timer = null;
    }
}

function bigTick() {
    let time = $("#timer").html().split(":");
    let seconds = (parseInt(time[0], 10) * 60) + parseInt(time[1], 10) - 1;
    console.log(seconds);
    if (seconds === 0) {
        $("#timer").effect("shake", {times: 1000, distance: "10"}, 100);
        clearInterval(bigTimer);
        bigTimer = null;
    }
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    $("#timer").html(minutes + ":" + (seconds < 10 ? "0" + seconds : seconds));
}

function modTick() {
    let time = $("#total-time").html().split(":");
    let speakerTime = $("#speaker-time").html().split(":");
    let seconds = (parseInt(time[0], 10) * 60) + parseInt(time[1], 10) - 1;
    let speakerSeconds = (parseInt(speakerTime[0], 10) * 60) + parseInt(speakerTime[1], 10) - 1;
    console.log(speakerSeconds);
    if (seconds === 0) {
        $("#total-time").effect("shake", {times: 1000, distance: "10"}, 100);
        clearInterval(mcTimer1);
        mcTimer1 = null;
    } if(speakerSeconds === 0) {
        $("#speaker-time").css("color", "#a20");
        $("#speaker-heading").effect("shake", {times: 5, distance: "10"}, 100);
        clearInterval(mcTimer1);
        mcTimer1 = null;
    }
    let minutes = Math.floor(seconds / 60);
    let speakerMinutes = Math.floor(speakerSeconds / 60);
    seconds %= 60;
    $("#total-time").html(minutes + ":" + (seconds < 10 ? "0" + seconds : seconds));
    $("#speaker-time").html(speakerMinutes + ":" + (speakerSeconds < 10 ? "0" + speakerSeconds : speakerSeconds));
}

function print(string) {
    $("#console").html(string);
}

function prompt(text, callbackIn, defaultVal) {
    print(text);
    if (defaultVal) $("#command").val(defaultVal).select();

    isPrompt = true;
    isCountryPrompt = false;
    callback = callbackIn;
}

function promptCallback(input) {
    isPrompt = false;
    isCountryPrompt = false;
    print("ready");

    callback(input);
}

function process(command) {
    store();

    if (isPrompt) {
        promptCallback(command);
        return;
    }

    switch ($.trim(command)) {
        case "about": case "version":
            about();
            break;
        case "a": case "add":
            prompt("add? (q to exit)", add);
            isCountryPrompt = true;
            break;
        case "b": case "boot":
            boot();
            break;
        case "c": case "change":
            prompt("change?", change);
            break;
        case "clear":
            prompt("CLEAR?", clear, "no");
            break;
        case "d": case "del": case "delete":
            prompt("delete? (q to exit)", deleter);
            break;
        case "D": case "deleteall":
            //clear speakers
            prompt("sure?", deleteAll, "y");
            break;
        case "e": case "extend":
            extend();
            break;
        case "x": case "esc": case "exit":
            keydownHandler({which: 27}); //simulate escape
            break;
        case "f": case "flip":
            prompt("flip?", flip);
            break;
        case "h": case "?": case "help":
            help();
            break;
        case "i": case "insert":
            prompt("insert?", insert);
            isCountryPrompt = true;
            break;
        case "k": case "space":
            keydownHandler({which: 32}); //simulate spacebar
            break;
        case "m": case "mod":
            prompt("set time to?", mod, "5:00");
            break;
        case "n": case "next":
            next();
            break;
        case "p": case "prev": case "previous":
            prev();
            break;
        case "s": case "switch":
            switcher();
            break;
        case "sh": case "settitle":
            prompt("set title to?", setTitle, $("#title").html());
            break;
        case "sq": case "setquorum":
            prompt("set quorum to?", setQuorum, parseInt($("#info-quorum").html()));
            break;
        case "st": case "settime":
            prompt("set time to?", setTime, parseInt($("#info-time").html()));
            break;
        case "se": case "setext": case "setexts": case "setextensions":
            prompt("set extensions to?", setExtensions, extensions[list]);
            break;
        case "t": case "timer":
            prompt("set timer to? (mm or mm:ss)", startTimer, "5:00");
            break;
        case "v": case "vote":
            vote();
            break;
        default:
            print("unrecognized command. try again?");
    }
}

function help() {
    $("#help").dialog("open");
}

function update() {
    $("#update").dialog("open");
}

function checkTime(time) {
    let good = true;
    if (!time.match(/^\d{1,2}:\d{2}$/)) {
        print("invalid time");
        good = false;
    } else if (time.match(/^0:00$/)) {
        /* there was a bug where 0:00 would make the timer go into negative time. I was too lazy to fix this, so
        I figured: denial is the answer to most of life"s problems--let"s fix another one */
        print("why. why would you want to do that");
        good = false;
    }
    return good;
}

function startTimer(time) {
    if(time.match(/^\d+$/)) time += ":00";
    else if (!checkTime(time)) return;

    $("#timer").html(time);
    $("#timer").dialog("open");
    $("#controller").css("zIndex", 5000);
    $("#command").focus();

    clearInterval(bigTimer);
    bigTimerMode = true;
    bigTimer = setInterval(bigTick, 1000);
}

function mod(time) {
    if(time.match(/^\d+$/)) time += ":00";
    else if (!checkTime(time)) return;

    clearInterval(mcTimer1);
    $("#total-time").html(time);
    prompt("speaker time? (mm:ss or ss)", enterMod, "30");
}

function enterMod(speakerTime) {
    if (!checkTime(speakerTime)) {
        if(speakerTime.match(/^\d{2}$/)) {
            print("ready");
            speakerTime = "0:" + speakerTime;
        } else return;
    }
    modSpeakerTime = speakerTime;
    modMode = true;
    modPaused = false;

    let modTimer = $("#total-time").html();
    let totalTimes = modTimer.split(":");
    let speakerTimes = speakerTime.split(":");
    if(totalTimes[0] < speakerTimes[0] || (totalTimes[0] === speakerTimes[0] && totalTimes[1] < speakerTimes[1])) {
        print("invalid speaker time: must be less than total time");
        return;
    }

    $("#speaker-time").html(speakerTime).dialog("open");
    $("#mod").dialog("open");
    $("#controller").css("zIndex", 5000);
    $("#command").focus();

    clearInterval(mcTimer1);
    keydownHandler({which: 14});
    setTimeout(function() {}, 100);
    keydownHandler({which: 14}); //simulate enter (reset timer color)
    mcTimer1 = setInterval(modTick, 1000);
}

function vote() {
    $("#vote").dialog("open");
    $("#controller").css("zIndex", 5000);
    $("#command").focus();
    $("#vote-results").hide().removeClass();

    tally = [0, 0, 0];
    tallyResults();
    prompt("for?", tallyFor);
}

function tallyFor(input) {
    tally[0] = parseInt(input) || 0;
    tallyResults();
    prompt("against?", tallyAgainst);
}

function tallyAgainst(input) {
    tally[1] = parseInt(input) || 0;
    tallyResults();
    let estimate = parseInt($("#info-quorum").html()) - tally[0] - tally[1];
    prompt("abstaining?", tallyAbstain, (estimate > 0 ? estimate : "0"));
}

function tallyAbstain(input) {
    tally[2] = parseInt(input) || 0;
    tallyResults();

    let result = (tally[0] !== tally[1] ? (tally[0] > tally[1] ? "passes" : "fails") : "ties");
    $("#vote-results").html(result).addClass(result);

    prompt("resolution " + result + ". reveal?", tallyReveal, "yes");
}

function tallyReveal() {
    $("#vote-results").show("slow");
    $("#controller").css("zIndex", 1);
    print("esc to exit");
}

function tallyResults() {
    $("#vote-tally").html("For " + tally[0] + ", Against " + tally[1] + ", Abstaining " + tally[2]);
}

function about() {
    print("v" + VERSION + " - developed by nikhil benesch");
}

function setTitle(input) {
    title = input;
    $("#title").html(input);
    $("title").html(input==="mun.track" ? input : ("mun.track – " + input));
}

function setQuorum(input) {
    quorum = parseInt(input);
    if (isNaN(quorum) && quorum !== null) {
        print("not a number");
        return;
    }
    $("#info-quorum").html(quorum + " delegates");
    $("#info-majority").html(Math.ceil(quorum / 2.0));
    $("#info-thirdmajority").html(Math.ceil(quorum * (2.0 / 3.0)));
    $("#info-20percent").html(Math.ceil(quorum * .20));
    $("#info-10percent").html(Math.ceil(quorum * .10));
}

function setTime(input) {
    let time = parseInt(input);
    if (isNaN(time)) {
        print("not a number");
        return;
    }
    times[list] = time;

    $("#info-time").html(time + " seconds");
}

function setExtensions(input) {
    let extension = parseInt(input);
    if (isNaN(extension)) {
        print("not a number");
        return;
    }
    extensions[list] = extension;

    prompt("set extension time to?", setExtensionTime, extensionTimes[list]);
}

function setExtensionTime(input) {
    let time = parseInt(input);
    if (isNaN(time)) {
        print("not a number");
        return;
    }
    extensionTimes[list] = time;

    $("#info-extensions").html(extensions[list] + "x " + time + "s");
}

function switcher() {
    list++;
    if (list > 2) list = 0;

    boot();
}

function boot() {
    generateList();
    setTime(times[list]);
    setExtensionTime(extensionTimes[list]);
    if (quorum) setQuorum(quorum);
    $("#speaker-list-title").html(names[list] + " Speakers List");
    $("#info-time").css("color", "white");
    $("#info-extensions").css("color", "white");

    clearTimeout(timer);
    timer = null;
}

function add(input) {
    if (input !== "quit" && input !== "q") {
        if(input.length < 3) {
            prompt("too short. add something else? (q to exit)", add);
        } else {
            countries[list].push(findCountry(input));
            generateList();
            prompt("add? (q to exit)", add);
        }

        isCountryPrompt = true;
    }
}

function extend() {
    let rextensions = parseInt($("#info-extensions").html());
    if (rextensions > 0) {
        $("#info-time").css("color", "white");
        $("#info-extensions").html((rextensions - 1) + "x " + extensionTimes[list] + "s");
        $("#info-time").html((parseInt($("#info-time").html()) + extensionTimes[list]) + " seconds");
    } else {
        $("#info-extensions").css("color", "#a20");
        print("no remaining extensions!");
    }
    clearTimeout(timer);
    timer = null;
}

function clear(input) {
    if (input === "yes") {
        countries[list] = [];
        current[list] = 0;
        generateList();
    }
}

function change(input) {
    country = parseInt(input);
    if (isNaN(country) || country > countries[list].length || country < 0) {
        print("invalid country");
        return;
    }

    prompt("change to?", changeTo);
    isCountryPrompt = true;
}

function changeTo(input) {
    countries[list][country - 1] = findCountry(input);
    generateList();
}

function flip(input) {
    country = parseInt(input) - 1;
    if (isNaN(input) || input > countries[list].length || input < 0) {
        print("invalid country");
        return;
    }

    prompt("with?", flipper);
}

function flipper(input) {
    let country2 = parseInt(input) - 1;
    if (isNaN(country2) || country2 > countries[list].length || country2 < 0) {
        print("invalid country");
        return;
    }

    let temp = countries[list][country];
    countries[list][country] = countries[list][country2];
    countries[list][country2] = temp;

    generateList();
}

function insert(input) {
    country = findCountry(input);

    prompt("insert where?", insertWhere);
}

function insertWhere(input) {
    let position = parseInt(input) - 1;
    if (isNaN(position) || position > countries[list].length || position < 0) {
        print("invalid country");
        return;
    }

    countries[list].splice(position, 0, country);
    generateList();
}

function deleter(input) {
    if (input !== "quit" && input !== "q") {
        country = parseInt(input);
        if (isNaN(country)) {
            print("not a number");
            return;
        }
        countries[list].splice(country - 1, 1);
        if (country < current[list]) current[list]--;

        generateList();

        prompt("delete? (q to exit)", deleter);
    }
}

function deleteAll(input) {
    if(input === "yes" || input === "y") {
        countries[list] = [];
        generateList();
    }
}

function next() {
    if (current[list] <= countries[list].length - 2) current[list]++;
    boot();
}

function prev() {
    if (current[list] > 0) current[list]--;
    boot();
}

function generateList() {
    $("#speaker-list").html("");
    $("#speaker-list").removeClass().addClass("list" + list);
    if (list === 2) {
        let output = "<ul class=\"left\"><li class=\"bold\">For</li>";
        for (let i = 0; i < countries[list].length; i += 2) {
            let style = ">";
            if (i < current[list]) style = " class=\"strike\">";
            else if (i === current[list]) style = " class=\"current\">";
            output += "<li" + style + (i + 1) + ".&nbsp;" + countries[list][i] + "</li>";
        }

        output += "</ul><ul class=\"right\"><li class=\"bold\">Against</li>";
        for (let i = 1; i < countries[list].length; i += 2) {
            let style = ">";
            if (i < current[list]) style = " class=\"strike\">";
            else if (i === current[list]) style = " class=\"current\">";
            output += "<li" + style + (i + 1) + ".&nbsp;" + countries[list][i] + "</li>";
        }
        output += "</ul>";

        $("#speaker-list").html(output);
    } else {
        for (let i = 0; i < countries[list].length; i++) {
            let style = ">";
            if (i < current[list]) style = " class=\"strike\">";
            else if (i === current[list]) style = " class=\"current\">";
            $("#speaker-list").append("<li" + style + (i + 1) + ".&nbsp;" + countries[list][i] + "</li>");
        }
    }

    if (countries[list].length > 0 && $("#speaker-list li.current").length > 0) {
        $("#speaker-list").scrollTo($("#speaker-list li.current"));
    }
}

function findCountry(input) {
    if (input.length > 20) return input;
    let min = 4;
    let country = input;
    let ld;

    for (let i = 0; i < countryList.length; i++) {
        ld = levenshtein(input, countryList[i]);
        if (ld < min) {
            min = ld;
            country = countryList[i]==="Bosnia" ? "Bosnia and Herzegovina" : countryList[i];
        }
    }

    return country;
}

function levenshtein(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    let si;
    let n = a.length;
    let m = b.length;
    if (!n) return m;
    if (!m) return n;

    let mx = [];
    for (let i = 0; i <= n; i++) {
        mx[i] = [];
        mx[i][0] = i;
    }

    for (let j = 0; j <= m; j++) mx[0][j] = j;
    for (let k = 1; k <= n; k++) {
        si = a.charAt(k - 1);
        for (let l = 1; l <= m; l++)
            mx[k][l] = Math.min(mx[k - 1][l] + 1, mx[k][l - 1] + 1, mx[k - 1][l - 1] +
                (si === b.charAt(l - 1) ? 0 : 1));
    }
    return mx[n][m];
}

function retrieve() {
    let obj = JSON.parse($.cookie("data"));
    if (obj) {
        if (obj.version !== VERSION) {
            update();
            return;
        }
        quorum = obj.quorum;
        times = obj.times;
        //note: `times` randomly became 8 here, but then equally randomly fixed itself. this may recur
        countries = obj.countries;
        current = obj.current;
        extensions = obj.extensions;
        extensionTimes = obj.extensionTimes;
        mobileCode = obj.mobileCode;
        list = obj.list;
        title = obj.title;
        setTitle(title);
    } else {
        process("?");
    }
}

function store() {
    let obj = {
        quorum: quorum, times: times, countries: countries, current: current, extensions: extensions,
        extensionTimes: extensionTimes, mobileCode: mobileCode, title: title, list: list, version: VERSION
    };

    $.cookie("data", JSON.stringify(obj), {expires: 7000});
}
