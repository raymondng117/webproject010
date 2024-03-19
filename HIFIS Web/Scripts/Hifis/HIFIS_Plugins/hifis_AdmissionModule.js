//*************************************************************************
//
// Author:		Tremblay, Marie-Pier
// Create date: 21-12-2021
// Description: Assemble all the Admission Javascript to create min and make adding it to compile scripts.
//              Will allow to speed the loading and function call.
//
//*************************************************************************
var HIFIS_Admissions = (HIFIS_Admissions ? (function () { alert("HIFIS_Admissions already exists."); })() : {


    Init: function () {

        console.log("HIFIS_Admissions.js is ready!");

        // MPT - 626624 - Boost Admission Module speed and reduce loading time


    }, // END Init

    SharedFunction: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }
                }

            }, // END OnReady


        }, // END ApplyOnLoad

        Utility_Functions: {


            requiredIf: function () {

                var value = document.querySelector("#IsBookOut").getAttribute("value");

                if (value === "False") {
                    return false;
                }

                return true;
            },

            // MP - Move HIFIS_Admissions.SharedFunction.Utility_Functions.ValidatePath() to init_hifis.js
            /*
            ValidatePath: function () {

                if (location.pathname.indexOf('Admissions') != -1) {
                    return true;
                }
                else {
                    return false;
                }
            },
            */

            //***************************************************************************
            //*
            //*   Checks if client has a family, if so, shows the add client button.
            //*
            //****************************************************************************
            clientFamilyCheck: function (id) {

                family = null;

                if (ValidatePath('Admissions/BookIn') && id == null) {

                    id = $('#ClientIDs option:last')[0].value;
                }

                $.ajax({

                    url: URL_Admission_GetFamilyListAjax,
                    type: "GET",
                    data: { "id": id },

                }).done(function (data) {

                    if ($.isEmptyObject(data) || $(clientIDs).attr("disabled") !== undefined) { // if the client ids button is disabled then don't show the add family button

                        $("#familyBtn").addClass("hide");
                    }
                    else if ($(clientIDs).val() != null && $(clientIDs).val().length == 1 && $(clientIDs).val().toString() == id) {

                        $("#familyBtn").removeClass("hide");
                        family = data;
                    }
                    else { }

                });
            },


            //***************************************************************************
            //*
            //*   Gets the organizations contact information to be displayed in the bed
            //*   availability popover.
            //*
            //****************************************************************************
            getShelterInfo: function (id) {

                var htmlstring;

                $.ajax({

                    url: URL_Admission_ShelterInfo,
                    type: "GET",
                    data: { "id": id },
                    async: false,

                }).done(function (data) {

                    htmlstring = "<div><p>" + data["address"] + "</p>";
                    htmlstring += "<p>" + data["phone"] + "<br/>" + data["email"] + "<br/>" + data["website"] + "</p>";
                    htmlstring += "<p>" + label_CutOffTime + "&nbsp" + data["cutofftime"] + "</p>";
                    htmlstring += "<p>" + data["visibility"] + "</p></div>";

                    var popoverdiv = $("div[data-id=\"" + id + "\"]");
                    popoverdiv.html(htmlstring);
                    $("div.popover-content").popover("show");

                });

                //return '<div data-id="' + id + '">@Labels.Loading <img src="@Url.Content("~/Content/images/Loaders/loader-50.gif")" alt="Loader Image" /></div>';
                return htmlstring;
            },


            //***************************************************************************
            //*
            //* - This function iterates through each bed panel and writes the bed content
            //*   to the popover display.
            //*
            //****************************************************************************
            createPopover: function () {

                $(".bedButton").not(".inactiveBed").each(function () {

                    var content = "<div>";
                    //if ($(this).is(".booked-bed"))
                    //    content = "<div class=\"booked-popover\">";

                    // print reserved details first
                    $(this).children(".bedContent").children(".clientButton_reserved").each(function () {

                        content += "<p><strong>" + label_DateOfReservation + "</strong>&nbsp&nbsp" + $(this).attr("data-date") + "<br/>";
                        content += "<strong>" + label_ReservationFor + "</strong>&nbsp&nbsp" + $(this).attr("data-label") + "</p>";
                    });

                    // print booked in details under reservation details
                    $(this).children(".bedContent").children(".clientButton_booked").each(function () {

                        content += "<p><strong>" + label_BookInDate + "</strong>&nbsp&nbsp" + $(this).attr("data-date") + "<br/>";
                        content += "<strong>" + label_Client + "</strong>&nbsp&nbsp" + $(this).attr("data-label") + "</p>";
                    });

                    content += "</div>";

                    if (content === "<div></div>") {
                        //content = "<div class=\"available-popover\"><p><strong>@Labels.Available</strong></p></div>";
                        content = "";
                    }

                    $(this).attr("data-content", content);
                });
            },


            //***************************************************************************
            //*
            //*   This function will stick the client button toolbar to the top of the
            //*   window when scrolling down.
            //*
            //****************************************************************************
            moveToolBar: function () {

                if (ValidatePath('Admissions')) {

                    var move = function () {

                        var st = $(window).scrollTop();
                        var ot = $(".anchor").offset() != null || undefined ? $(".anchor").offset().top : 0;
                        var s = $("#clientToolBar");

                        if (st > ot) {

                            s.css({
                                position: "fixed",
                                top: "0px",
                                left: "0px",
                            });
                            s.css("background-color", "rgba(235, 235, 235, 0.80)");
                            s.append($(".toolbar-controls"));
                        }
                        else {

                            if (st <= ot) {

                                s.css({
                                    position: "relative",
                                    top: "",
                                    left: "",
                                });
                                s.css("background-color", "#fff");
                            }

                            $("#toolbar").children("div").append($(".toolbar-controls"));
                        }
                    };

                    $(window).scroll(move);
                    move();
                }

            },


            //***************************************************************************
            //*
            //*   This function sets the height property of rooms within a row.
            //*
            //****************************************************************************
            unifyDivHeights: function () {

                $("div.body").children(".row").each(function () {

                    var maxHeight = 0;

                    $(this).children(".room").each(function () {
                        var height = $(this).outerHeight();
                        if (height > maxHeight)
                            maxHeight = height;
                    });

                    // 13 seems to be needed to close the gap
                    $(this).children(".room").css("min-height", maxHeight + 13);

                });

            },


            //***************************************************************************
            //*
            //*   Removes any processing details of a popover display. Processing details
            //*   are the details that display when you have moved a client into a bed
            //*   during a admission process.
            //*
            //****************************************************************************
            removeProcessingPopover: function (bed) {

                var dataContent = bed.attr("data-content");
                var splitContent = dataContent.split("<p class='process'><strong>");
                dataContent = splitContent[0];
                bed.attr("data-content", dataContent);
            },


            //***************************************************************************
            //*
            //*   Makes options for a select element from json data.
            //*
            //****************************************************************************
            makeOptions: function (res) {

                var str = "";
                if (res.length > 0) {

                    //starting the list at 1 so it does not append the first blank element ( so as to not interefere with the default selections)
                    for (i = 1; i < res.length; i++) {
                        str += '<option value="' + res[i].Value + '">' + res[i].Text + '</option>';
                    }
                }
                else {

                    str += '<option value="" disabled>' + label_NoneToDisplay + '</option>';
                }

                return str;
            },


            //***************************************************************************
            //*
            //*   Gets the list of beds available on this date at the service provider
            //*
            //***************************************************************************
            updateAvailableBedsList: function () {

                $.ajax({

                    url: URL_Admission_GetAvailableBedsList,
                    type: "POST",

                }).done(function (data) {

                    $('#BedID').empty();
                    $('#BedID').append(HIFIS_Admissions.SharedFunction.Utility_Functions.makeOptions(data.Result));

                }).always(function () {

                    HIFIS_Admissions.SharedFunction.Utility_Functions.reinitSelect2($('#BedID'));
                });
            },


            //***************************************************************************
            //*
            //*   reinitializes select2 after modifying the options.
            //*
            //***************************************************************************
            reinitSelect2: function (selector) {

                selector.select2('destroy');
                selector.select2({ width: 'resolve', allowClear: true, placeholder: $("#DropdownPlaceholder").val(), });
            },


            //***************************************************************************
            //*
            //*   This function gets all of the current admission details for the entire
            //*   shelter.
            //*
            //****************************************************************************
            getCurrentAdmissionDetails: function (isHidden, isOnComplete) {

                //console.log("isHidden: " + isHidden.toString());
                //console.log("isOnComplete: " + isOnComplete.toString());
                var datetime = null;
                if ($("#DateStart").val() == undefined) {
                    datetime = dateTime_Now;
                }
                else {
                    datetime = $("#DateStart").val();
                }

                $.ajax({

                    url: URL_Admission_AdmissionDetailsAjax,
                    type: "POST",
                    data: { date: datetime },

                }).done(function (data) {

                    // remove any static information from the bed details. Static meaning book-ins or reservations. A requested bed can still be moved around.
                    $(".bedButton").not(".inactiveBed").removeClass("booked-bed").addClass("activeBed");
                    $(".clientButton_reserved").remove(); // clear reserved client divs
                    $(".clientButton_booked").remove(); // clear booked client divs

                    HIFIS_Admissions.SharedFunction.Utility_Functions.appendClientDivsToBeds(data, isOnComplete); // create client content which will be seen in the expanded graphical view
                    HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover(); // create popover menus which will be seen when you hover over a bed panel

                    $(".clientButton_reserved").hide();
                    if ($("#IsReservation").val() == "true" || $("#IsReservation").val() == "True") {
                        $(".clientButton_booked").hide();
                        $(".bedButton").not("inactiveBed").addClass("activeBed");
                    }
                    // for the collapsed view this will hide the bed content
                    if (isHidden == true) {
                        $(".bedContent").children().hide();
                    }

                    // removes the identifier of an active bed if a client is currently booked in to this bed
                    if ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False") {
                        $(".clientButton_booked").parents(".bedContent").parents(".bed").removeClass("activeBed").removeClass("requested-bed").addClass("booked-bed");
                        $(".clientButton").parents(".bedContent").parents(".bed").removeClass("activeBed");
                    }

                    $("div.body").fadeIn(800);

                });
            },


            //***************************************************************************
            //*
            //*   This function will append client information to the bed panels after the
            //*   the function getCurrentAdmissionDetails get the updated data.
            //*
            //****************************************************************************
            appendClientDivsToBeds: function (data, isOnComplete) {

                $(".bedContent").removeClass("glyphicon-flag").removeClass("glyphicon-exclamation-sign").addClass("glyphicon-bed");

                for (var i = 0; i < data.length; i++) {

                    var htmlString = "";
                    if (data[i]["isReserved"] == "True") {

                        var glyph = "glyphicon-flag";
                        if (data[i]["date"].split("<span class='today'>").length > 1) {

                            glyph = "glyphicon-exclamation-sign";
                        }

                        htmlString = '<div class="clientButton_reserved btn btn-primary"'; // change
                        htmlString += ' data-clientid="' + data[i]["clientID"] + '" data-date="' + data[i]["date"] + '" data-label="' + data[i]["label"] + '" data-stay="' + data[i]["stayID"] + '">';
                        htmlString += '<span class="glyphicon glyphicon-user"></span>&nbsp' + data[i]["label"] + '</div>';

                        $("#bed-" + data[i]["bedID"]).children(".bedContent").removeClass("glyphicon-bed").addClass(glyph).append(htmlString);
                    }
                    else {

                        var bed = $("#bed-" + data[i]["bedID"]);
                        var bedContent = bed.children(".bedContent");
                        var clientButton = bedContent.children(".clientButton");

                        htmlString = '<div class="clientButton_booked btn btn-primary"';
                        htmlString += ' data-clientid="' + data[i]["clientID"] + '" data-date="' + data[i]["date"] + '" data-label="' + data[i]["label"] + '" data-stay="' + data[i]["stayID"] + '">';
                        htmlString += '<span class="glyphicon glyphicon-user"></span>&nbsp' + data[i]["label"] + '</div>';

                        bedContent.append(htmlString);

                        // checks if there is a clientButton inside bedContent which would mean someone is trying to book in a reservation which conflicts with a current stay
                        if (clientButton.length > 0 && ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False")) {

                            $("#clientToolBar").append(clientButton);
                            if (!isOnComplete) { // only if is not an oncomplete function

                                //console.log("408: label_ReservationConflictStay: " + label_ReservationConflictStay);
                                alert(label_ReservationConflictStay);
                            }
                        }
                    }

                    // removes the identifier of an active bed if a client is currently booked in to this bed
                    if (data[i]["isReserved"] == "false" || data[i]["isReserved"] == "False") {

                        $(".clientButton_booked").parents(".bedContent").parents(".bed").removeClass("activeBed").removeClass("requested-bed").addClass("booked-bed");
                        $(".clientButton").parents(".bedContent").parents(".bed").removeClass("activeBed");
                    }

                }
            },


            //***************************************************************************
            //*
            //*   This function gets the form for a new admission.
            //*
            //****************************************************************************
            getNewForm: function (isReservation) {

                $.ajax({

                    url: URL_Admission_GetNewAdmissionForm + isReservation,
                    type: "GET",

                }).done(function (data) {

                    $("#stayFormDiv").html(data.Result);
                    init_hifis();

                    if (isReservation) {

                        $("#wake").hide();
                        $("#intox").hide();
                        $("#latePass").hide();
                        $("#IsReservation").val(true);
                    }
                    else {

                        $("#IsReservation").val(false);
                    }

                });

            },


            //***************************************************************************
            //*
            //*   This function checks if the client is currently booked in and if not
            //*   it then checks for a service restriction.
            //*
            //****************************************************************************
            isClientBookedIn: function (id, text) {
                //console.log("isClientBookedIn" + id + " - " + text);
                if (ValidatePath('Admissions/BookIn') && (id == undefined && text == undefined)) {

                    //if ($(clientIDs).val() != null && $(clientIDs).val().length >= 1) {
                    //
                    //    selectedClientValues_BookIn = {
                    //        id: $('#ClientIDs option:last')[0].value,
                    //        text: $('#ClientIDs option:last')[0].text
                    //    };
                    //}

                    id = $('#ClientIDs option:last')[0].value;
                    text = $('#ClientIDs option:last')[0].text;
                }
                var startDate;
                if ($("#ReservationDateStart").val() != null) {
                    startDate = $("#ReservationDateStart").val();
                }
                else {
                    startDate = $("#DateStart").val()
                }
                $.ajax({

                    url: URL_Admission_IsClientBookedIn,
                    type: "GET",
                    data: {
                        "id": id,
                        "date": startDate
                    },

                }).done(function (data) {

                    if (data && ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False")) {

                        //console.log("486: text + label_AlreadyBooked: " + text + label_AlreadyBooked);
                        alert(text + label_AlreadyBooked);
                        $("#ClientIDs option[value=" + id + "]").prop("selected", false).parent().trigger("change");
                        $("#ClientIDs option[value=" + id + "]").remove();
                        $(".clientButton[data-clientid='" + id + "']").remove();
                    }
                    else if (data && ($("#IsReservation").val() == "true" || $("#IsReservation").val() == "True")) {
                        alert(text + label_AlreadyBooked);
                        $("#ClientIDs option[value=" + id + "]").prop("selected", false).parent().trigger("change");
                        $("#ClientIDs option[value=" + id + "]").remove();
                        $(".clientButton[data-clientid='" + id + "']").remove();
                    }
                    else {

                        HIFIS_Admissions.BookInView.Utility_Functions.isServiceRestricted(id, text);
                    }

                    if ($(clientIDs).val() != null && $(clientIDs).val().length == 1) {
                        HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck(id);
                    }
                    else {

                        $("#familyBtn").addClass("hide");
                    }

                });

            },


            //***************************************************************************
            //*
            //*   Click event which posts the admission details to be inserted into the
            //*   database. This page displays after the above submit event which validates
            //*   the form.
            //*
            //****************************************************************************
            saveClientsInBeds: function (url) {

                if ($("#clientToolBar").children(".clientButton").length == 0) {

                    // re-initialize the array of client accomodation detail objects
                    jsArray = [];

                    // disable the save button to prevent double clicking and resubmitting
                    $(this).attr("disabled", true);

                    $(".clientButton").each(function () {

                        var temp = {};
                        temp.ClientID = $(this).attr("data-clientid");
                        temp.RoomID = $(this).parents("div").parents(".bedButton").parents(".room").attr("data-room-id"); // change
                        temp.BedID = $(this).parents("div").parents(".bedButton").attr("data-bed-id"); // change
                        jsArray.push(temp);
                    });

                    // serialize form and create JSON object out of client accomodations array
                    var formData = $("#admissionsForm").serialize();
                    var clientAdmissions = JSON.stringify(jsArray);

                    // POST ADMISSION
                    $.ajax({

                        url: url,
                        type: "POST",
                        data: formData + "&clientAdmissions=" + clientAdmissions,

                    }).done(function (data) {

                        if (data.Success) {

                            //this could be used in order to remove the url
                            //if (($("#IsReservation").val() === "True" || $("#IsReservation").val() === "true") && ($("#StayID").val() !== "" || $("#StayID").val() !== null)) {
                            //    window.location = "@Url.Action("Index", "Admissions", new { id = "" })";
                            //}

                            // reset display of beds upon successful completion
                            $(".requested-bed").not(".legend").removeClass("requested-bed");

                            // append any failed submissions because of bed conflicts, due to concurrency issues, to the tool bar for re-submission
                            for (var i = 0; i < data.Result.ValidationMessages.length; i++) {

                                var client = $("#bed-" + data.Result.ValidationMessages[i]).children(".bedContent").children(".clientButton");
                                $("#clientToolBar").append(client);
                                client.show();
                            }

                            // remove successfully submitted clients
                            $(".bedButton").children(".bedContent").children(".clientButton").each(function () {

                                $("#ClientIDs option[value=" + $(this).attr("data-clientid") + "]").prop("selected", false).parent().trigger("change");
                                $(this).remove();
                            });

                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, true);

                            // if there are no leftover clients for re-submission then display table views
                            if ($("#clientToolBar").children(".clientButton").length == 0) {

                                var url = '';
                                if (returnToClient == 'True' || returnToClient == true) {

                                    //the variable is initiate only once a client is selected or if is an already existing bookIn or reservation.
                                    if (clients == '' || clients == undefined) {

                                        clients = $('#ClientIDs option:first')[0].value;
                                    }

                                    url = URL_Admission_ClientAdmissions + clients;
                                    window.location.href = url;
                                }
                                else {

                                    url = URL_Admission_Index;
                                    window.location.href = url;
                                }

                            }
                            else {

                                var clientLabels = "";
                                $("#clientToolBar").children(".clientButton").each(function () {
                                    clientLabels += $(this).text().trim() + ", ";
                                });
                                clientLabels += ConcurrencyConflict;
                                displayNotification('error', '', "<p>" + FailedToSave + "<br />" + clientLabels + "</p>");

                            }

                            if (jsArray.length == 0 || jsArray.length > data.Result.ValidationMessages.length)
                                displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");

                        }
                        else {

                            for (var x = 0; x < data.Result.ValidationMessages.length; x++) {
                                displayNotification('error', '', "<p>" + data.Result.ValidationMessages[x] + "</p>");
                            }
                        }

                        $("#confirmBtn").attr("disabled", false);

                    }).fail(function (data) {

                        displayNotification('error', '', "<p>" + label_FailedToSave + "</p>");
                        $("#confirmBtn").attr("disabled", false);

                    });

                }
                else {

                    //console.log("1011: label_Selectedclients: " + label_Selectedclients);
                    alert(label_Selectedclients);
                }

            },


        }, // END Utility_Functions

    }, // END SharedFunction

    _AdmissionsFormView: {

        ApplyOnLoad: {

            //This function will be call in Init at the start.
            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    //$("#DateStart_Date").on("change", );
                    var attr = $("#IsReservation").attr("value");
                    if (attr == "True" || attr === "true") {

                        $("#wake").hide();
                        $("#intox").hide();
                        $("#assistance").hide();
                        $("#latePass").hide();
                    }

                    HIFIS_Admissions._AdmissionsFormView.Utility_Functions.dateAndTimePicker_OnChange(editDetails, URL_Admission_showBedsHistoryTableURL);
                }

            }, // END OnReady


        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   _AdmissionsFormView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            //MP - Move requiredIf() to HIFIS_Admissions.SharedFunction.Utility_Functions.requiredIf()

            dateAndTimePicker_OnChange: function (editDetails, url) {

                // MPT - Since this JS will load on the _Layout.cshtml (Root of all views) and the input IDs are generated 
                // (not unique) they could be use elsewhere, we need to validate the path to apply only in Admission Module
                if (ValidatePath('Admissions')) {

                    $(document).on('change', '#datePicker1', function () {

                        if ($("#ClientIDs").val() != null && $("#ClientIDs").val() !== undefined
                            && $("#PrimaryClientID").val() != null && $("#PrimaryClientID").val() !== undefined) {

                            if (editDetails != null) {

                                HIFIS_Admissions._AdmissionsFormView.Utility_Functions.showBedsHistoryTable(url);
                            }

                            for (i = 0; i < $("#ClientIDs").length; i++) {

                                //console.log("596: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                                HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($("#ClientIDs option:eq(" + i + ")").val(), $("#ClientIDs option:eq(" + i + ")").text().trim());
                            }
                        }
                    });

                    $(document).on('change', '#datePicker2', function () {

                        if ($("#ClientIDs").val() != null && $("#ClientIDs").val() !== undefined
                            && $("#PrimaryClientID").val() != null && $("#PrimaryClientID").val() !== undefined) {

                            if (editDetails != null) {

                                HIFIS_Admissions._AdmissionsFormView.Utility_Functions.showBedsHistoryTable(url);
                            }
                        }
                    });

                    $(document).on('change', '#timePicker1', function () {

                        if ($("#ClientIDs").val() != null && $("#ClientIDs").val() !== undefined
                            && $("#PrimaryClientID").val() != null && $("#PrimaryClientID").val() !== undefined) {

                            if (editDetails != null) {

                                HIFIS_Admissions._AdmissionsFormView.Utility_Functions.showBedsHistoryTable(url);
                            }

                            for (i = 0; i < $("#ClientIDs").length; i++) {

                                //console.log("626: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                                HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($("#ClientIDs option:eq(" + i + ")").val(), $("#ClientIDs option:eq(" + i + ")").text().trim());
                            }
                        }
                    });

                    $(document).on('change', '#timePicker2', function () {

                        if ($("#ClientIDs").val() != null && $("#ClientIDs").val() !== undefined
                            && $("#PrimaryClientID").val() != null && $("#PrimaryClientID").val() !== undefined) {

                            if (editDetails != null) {

                                HIFIS_Admissions._AdmissionsFormView.Utility_Functions.showBedsHistoryTable(url);
                            }
                        }
                    });

                }

            },

            showBedsHistoryTable: function (stayID, url) {

                //var stayID = stayID;
                var dateStart = $('#DateStart').val();
                var dateEnd = $('#DateEnd').val();

                if (dateEnd && dateStart) {

                    dateStart += " " + $('#DateStart_TimeOfDay').val();
                    dateEnd += " " + $('#DateEnd_TimeOfDay').val();

                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        data: { stayID: stayID, dateStart: dateStart, dateEnd: dateEnd },
                        url: url,
                        success: function (result) {
                            if (result.data.length == 0) {
                                $('#warningPanel').hide('slow');
                            }
                            else {
                                HIFIS_Admissions._AdmissionsFormView.Utility_Functions.loadBedsHistoryTable(result.data);
                                $('#warningPanel').show('slow');
                            }
                        }
                    });
                }
            },

            loadBedsHistoryTable: function (data) {

                $('#bedsHistoryTable tbody tr').remove();
                var trHTML = "";

                $.each(data, function (index, element) {
                    trHTML += '<tr><td>' + element.dateStart + '</td><td>' + element.dateEnd + '</td><td>' + element.roomName + '</td><td>' + element.bedName + '</td></tr>';
                });

                $('#bedsHistoryTable').append(trHTML);
            }

        }, // END Utility_Functions


    }, // END _AdmissionsFormView

    
    BookInView: {

        //****************************************************************************
        //* All functions or event that need to be triggered or attach when the page is loading or Ready
        //****************************************************************************
        ApplyOnLoad: {

            //***************************************************************************
            //*
            //*   The document on ready function. This function will check if any client
            //*   ids came pre-populated and sends out ajax calls to check if they are al-
            //*   ready booked in or have service restrictions. If not, the calls go ahead
            //*   and append clientButtons to the client toolbar.
            //*
            //*   It then creates the popover for all of the bed panels and changes back-
            //*   ground colors for selected beds if necessary. If a reservation is pre-
            //*   populated it calls the function getCurrentAdmissionDetails, to check for
            //*   conflicts with a current book-in and the reserved bed.
            //*
            //*   BASICALLY, the on ready function will decide how to initially display
            //*   the content of the Index view.
            //*
            //****************************************************************************
            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");

                    }

                    $(".cd-top").hide();
                    //var clients = clients;

                    // IF THERE ARE PRE-POPULATED CLIENTS IN THE VIEWMODEL
                    if (clients != "") {

                        // display index pages form
                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        // IF INTAKE IS NOT A RESERVATION
                        if ($("#IsReservation").val() === "False" || $("#IsReservation").val() === "false") {

                            $(clientIDs).children("option").each(function () {

                                //console.log("746: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                                HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value").toString(), $(this).text().trim());
                            });

                            // get the current admission details which will prevent the use of a booked in bed
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                            $("h3#page-title").html(label_NewBookIn);

                        }
                        else {

                            // hide unused form controls
                            $("#wake").hide();
                            $("#intox").hide();
                            $("#latePass").hide();

                            if ($("#StayID").val() === "") {

                                // append client object buttons to the toolbar
                                $(clientIDs).children("option").each(function () {

                                    var htmlString = '<div class="clientButton btn btn-primary" data-clientid="' + $(this).attr("value") + '">';
                                    htmlString += '<span class="glyphicon glyphicon-user"></span>&nbsp&nbsp' + $(this).text().trim() + '</div>';

                                    $("#clientToolBar").append(htmlString);
                                });
                            }

                            if ($("#IsReservation").val() === "True" || $("#IsReservation").val() === "true") {

                                $("h3#page-title").html(label_viewTitle_EditReservation);
                            }
                            else {

                                $("h3#page-title").html(label_NewReservation);
                            }
                        }
                        $("#ClientIDs").attr("disabled", true);
                    
                        //console.log("785: Begin Family validation session_IsWithFamily value is :" + session_IsWithFamily);
                    
                        //Attestation+Consent Validation, but first lets get the family members
                        if (session_IsWithFamily == 'True')
                        {
                            //console.log("790 Entering family validation");
                            family = null;
                            var id = $('#ClientIDs option:first')[0].value;
                            
                            $.ajax({
                                url: URL_Admission_GetFamilyListAjax,
                                type: "GET",
                                data: { "id": id },

                            }).done(function (data) {

                                family = data;
                                //console.log("798: validateAttestationConsent was call");
                                HIFIS_Admissions.BookInView.Utility_Functions.validateAttestationConsent();
                            });
                        };

                        
                    }
                    else {
                        // display index page normally
                        $("#bedsView").fadeOut(300);
                        $("#admissionFormDiv").fadeIn(800);

                    }// END IF


                    // Filter Bed Availability list
                    $(document).on("change", "#GeoRegionID #details-panel3", function () {

                        var table = $('#availabilityTable').DataTable();
                        table.ajax.url(URL_Admission_SheltersAdmissionsStatsJson + $('#GeoRegionID').val()).load();
                    });


                    // find all client object buttons within an active bed to change display
                    $(".clientButton").parent().parent(".activeBed").addClass("requested-bed").removeClass(".activeBed");


                    // initialize the popover display of the beds
                    $(".bedButton").popover({

                        html: true,
                        container: "body",
                        template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                    });

                    // Modals
                    //$(".modal").hide().css("display", "normal");


                    // window scroll check
                    $(window).scroll(function () {

                        if ($(this).scrollTop() > 100 && !$("#admissionFormDiv").is(":visible") && !$("#tablesView").is(":visible")) {

                            $(".cd-top").fadeIn();
                        }
                        else {

                            $(".cd-top").fadeOut();
                        }
                    });


                    //Click event to scroll to top
                    $(document).on("click", ".cd-top", function () {

                        $("html, body").animate({ scrollTop: 0 }, 800);
                        return false;
                    });


                    // call function to fix toolbar when scrolling
                    HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar();


                    $(document).on("wb-ready.wb", function (event) {
                        // Show page!
                        //$("#container").show();

                    });


                    $(document).on("wb-ready.wb-tables", ".wb-tables", function (event) {

                        $("#loader-div").addClass("hide").css({ "margin-left": "250px", "margin-top": "100px" });
                        $("#container").css('margin-left', '');

                    });


                    //***************************************************************************
                    //*
                    //*   Draw event for the DataTables plugin. Since the tables data loads after
                    //*   the JavaScript loads, the buttons within the tables need to be initia-
                    //*   lized here.
                    //*
                    //****************************************************************************
                    $(document).on("wb-updated.wb-tables", ".wb-tables", function (event, settings) {

                        initButtons();
                        var currentOrg = session_currentOrg;

                        for (var i = 0; i < $("#availabilityTable > tbody > tr > td").length; i += 4) {

                            var element = $("#availabilityTable > tbody > tr > td").eq(i);
                            if (element.text() === currentOrg) {

                                element.parent("tr").css("font-weight", "bolder");
                            }
                        }

                        $(".info-pop").popover({

                            html: true,
                            container: "body",
                            content: function () {
                                return HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo($(this).attr("data-id"));
                            },
                            placement: "left",
                            trigger: "focus",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });
                    });


                    //***************************************************************************
                    //*
                    //*   Submit event for the intake form. This event triggers when the user
                    //*   clicks the next button of the admissions form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#showBedsButton", function (event) {

                        if ($("#admissionsForm").valid() && $("#ClientIDs").val() != null) {

                            if (session_BedDisplayExpanded == "False") {

                                $(".smallTileButton").trigger("click");
                            }
                            else {

                                $(".largeTileButton").trigger("click");
                            }
                        }

                        $("#book-in-controls").show();
                        $("#backBtn").hide();

                        if ($("#admissionsForm").valid()) {

                            var isReso = $("#IsReservation").val();
                            if (isReso == "false" || isReso == "False") {

                                $("h3#page-title").html(label_BookIn);
                            }
                            else {

                                $("h3#page-title").html(label_Reservation);
                            }
                        }

                        //event.preventDefault();

                    });


                    //***************************************************************************
                    //*
                    //*   Click event which posts the admission details to be inserted into the
                    //*   database. This page displays after the above submit event which validates
                    //*   the form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#confirmBtn", function () {

                        HIFIS_Admissions.SharedFunction.Utility_Functions.saveClientsInBeds(URL_Admission_NewAdmission);
                    });


                    //***************************************************************************
                    //*
                    //*   Allows the control panels client search control to be initiated with
                    //*   the return key.
                    //*
                    //****************************************************************************
                    $(document).keypress(function (e) {
                        if (e.which == 13 && $("#search-box:focus").length > 0)
                            $(".searchButton").trigger("click");
                    });


                    //***************************************************************************
                    //*
                    //*   This click event initiates the service call to move a client to another
                    //*   bed
                    //*
                    //****************************************************************************
                    $(document).on("click", "#modalYesButton", function () {

                        $.ajax({

                            url: URL_Admission_ChangeClientBed,
                            type: "GET",
                            data: {
                                id: $(selectedBookedInClient).attr("data-stay"),
                                room: $(selectedBookedInClient).parents().parents().parents().attr("data-room-id"),
                                bed: $(selectedBookedInClient).parents().parents().attr("data-bed-id")
                            },

                        }).done(function (data) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false); // calling this function displays the current admission details in the graphical view
                            selectedBookedInClient = null;
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $(".modal").hide();
                            //$("#bookedInTable").DataTable().ajax.reload();
                            //$("#reservationsTable").DataTable().ajax.reload();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   This click event closes any open modal. This acts like a cancel button.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".modalCloseButton", function () {

                        // calling this function displays the current admission details in the graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);
                        selectedBookedInClient = null;
                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This click event will trigger a click event for the required bed view
                    //*   button which will reload the data for the current beds.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#refresh-beds", function () {

                        if ($(selectedToolBarBtn).attr("id") === "smallViewBtn")
                            $(".smallTileButton").trigger("click");
                        else
                            $(".largeTileButton").trigger("click");
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on an available bed which will select this bed for the new
                    //*   admission. First off, it checks if there is a selected booked in client,
                    //*   in which case it means the user is trying to move a booked in client to
                    //*   this bed rather than be part of a new admission. Secondly, it checks if
                    //*   the event target is an existing client within the bed, in which case the
                    //*   event stops and only fires an event on the client button. In any other
                    //*   case, the event is fired and the selected client is moved to this bed as
                    //*   part of a new admission process.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .activeBed", function (event) {

                        // if an already booked in client is selected
                        if (selectedBookedInClient != null) {

                            $(this).children(".bedContent").html(selectedBookedInClient); // display client within bed

                            // if the user is in the small icons view then hide the client buttons
                            if ($(selectedToolBarBtn).attr("id") == "smallViewBtn")
                                $(".bedContent").children().hide();

                            // show the confirm move modal to confirm whether the user wants to move the client or not
                            $("#move-confirm").show();

                        } else if ($(".clientButton").length > 0) {

                            if (selectedClient == null) // if a client is not selected then the event selects the first matching element.
                                selectedClient = $(".clientButton").first();

                            // check if this client is within a requested bed and reset the bed so it is available
                            var requestedBed = selectedClient.parents().parents(".requested-bed");     // get the selected client's currently selected bed
                            if (requestedBed.length > 0) {                                             //
                                HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover(requestedBed);                                 // remove existing popover details for a processing request
                                requestedBed.removeClass("requested-bed").addClass("activeBed");       // reset the bed back to an active bed
                            }

                            // we can now write the client div to this new .activeBed element
                            $(this).children(".bedContent").html(selectedClient);

                            // if the user is in the small icon view then hide the client button
                            if (selectedToolBarBtn.attr("id") == "smallViewBtn") {
                                $(".bedContent").children().hide();
                            }

                            // append info to the popover display
                            var content = $(this).attr("data-content");
                            content += "<p class='process'><strong>" + label_Processing + "</strong>&nbsp&nbsp" + selectedClient.text().trim() + "</p>";
                            $(this).attr("data-content", content);

                            // change background color and selection types of bedButtons for all of the beds that contain a client admission request
                            $(this).addClass("requested-bed").removeClass("activeBed");

                            // within an if in case a null value exists
                            if (selectedClient.length > 0) {

                                selectedClient.removeClass("selected-client"); // reset
                                displayNotification('info', '', "<p>" + selectedClient.text().trim() + "</p>");
                            }

                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a requested bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .requested-bed", function (event) {

                        // stops the event if click is on a client button within an active bed
                        if (!$(event.target).is(".clientButton")) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover($(this));

                            var clientButton = $(this).children().children(".clientButton");
                            $("#clientToolBar").append(clientButton);
                            clientButton.show();

                            if (selectedClient != null)
                                selectedClient.removeClass("selected-client");

                            $(this).removeClass("requested-bed").addClass("activeBed");
                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is part of a new admission.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton", function (event) {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {
                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is already booked in. This allows the user
                    //*   to move the client to another bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton_booked", function (event) {

                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");

                        if ($(this).is(".selected-booked")) {

                            $(this).removeClass("selected-booked");
                            selectedBookedInClient = null;
                        }
                        else {

                            selectedBookedInClient = $(this);
                            $(".clientButton_booked").removeClass("selected-booked");
                            $(this).addClass("selected-booked");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on the client toolbar that is delegated to the clientButton.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#toolbar .clientButton", function (event) {

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Select event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(document).on("select2:select", "#ClientIDs", function (e) {

                        selectedClientValues_BookIn = {};

                        selectedClientValues_BookIn = {
                            id: e.params.data.id,
                            text: e.params.data.text
                        };                        

                    });


                    //***************************************************************************
                    //*
                    //*   Unselect event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(document).on("select2:unselect", "#ClientIDs", function (e) {

                        var clientObject = $(".clientButton[data-clientid='" + e.params.data.id + "']");
                        clientObject.parent().parent(".bedButton").removeClass("requested-bed");
                        clientObject.remove();
                        $("#ClientIDs option[value='" + e.params.data.id + "']").remove();

                        if ($(clientIDs).val() != null && $(clientIDs).val().length == 1) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck($(clientIDs).val().toString());
                        }
                        else {

                            $("#familyBtn").addClass("hide");
                            if ($(clientIDs).val() == null) {

                                $("#ClientIDs > option").remove();
                            }
                        }

                    });


                    //***************************************************************************
                    //*
                    //*   Selects family for a book in by placing them as selected options in the
                    //*   multi-select control for client ids.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#familyBtn", function () {

                        //console.log("1365: validateAttestationConsent was call");
                        HIFIS_Admissions.BookInView.Utility_Functions.validateAttestationConsent();
                        
                    });


                    //***************************************************************************
                    //*
                    //*   Get stay details to display to the user.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#tablesView .display-btn", function () {

                        var displayModal = $("#display-stay");
                        var id = $(this).attr("data-id");
                        var client = $(this).attr("data-client");

                        $("#printBtn").attr("href", URL_Admission_Details + id); // sets the print url to the right stay id
                        $("#clientAddmissionsBtn").attr("href", URL_Admission_ClientAdmissions + client); // sets the client url to the right client id

                        displayModal.find(".modal-body").html($("#loader-div").removeClass("hide"));
                        displayModal.show();

                        $.ajax({

                            url: URL_Admission_DisplayBookedInStay,
                            type: "GET",
                            data: { "id": id },

                        }).done(function (data) {

                            displayModal.find(".modal-body").html($("#loader-div"));
                            displayModal.find(".modal-body").append(data.Result);
                            $("#loader-div").addClass("hide");

                        }).fail(function () {

                            //.log("1391: label_GetStayInformation: " + label_GetStayInformation);
                            alert(label_GetStayInformation);
                            displayModal.hide();
                        });

                    });


                    //***************************************************************************
                    //*
                    //*   When a user clicks on the print button within the display modal we want
                    //*   to open the display in a new tab but also close the modal for smoother
                    //*   interaction.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#printBtn", function () {

                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   Display state events.
                    //*
                    //****************************************************************************
                    // starts a new book-in
                    $(document).on("click", "#tablesView #book-in-btn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(false);

                        $("h3#page-title").html(label_NewBookIn);
                    });


                    // starts a new reservation
                    $(document).on("click", "#tablesView #reserve-btn", function () {

                        $("#ClientIDs").attr("disabled", false);

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(true);

                        $("h3#page-title").html(label_NewReservation);
                    });


                    // brings you to the graphical view to manage booked in clients
                    $(document).on("click", "#tablesView .manage-btn", function () {

                        if (session_BedDisplayExpanded == "False") {

                            $(".largeTileButton").trigger("click");
                        }
                        else {

                            $(".smallTileButton").trigger("click");
                        }

                        $("#book-in-controls").hide();
                        $("#backBtn").show();
                        $("#IsReservation").val("false");
                        $("#search-box").trigger("focus");

                        $("h3#page-title").html(label_ManageRoomsBeds);
                    });


                    // displays the modal to confirm deletion of a reservation
                    $(document).on("click", "#tablesView .deleteButton", function (event) {

                        $("#delete-confirm").show();
                        deleteID = $(this).attr("data-stayid");
                        event.preventDefault();
                    });


                    // refresh the bed availability table
                    $(document).on("click", "#tablesView #refresh-stats", function () {

                        $("#availabilityTable").DataTable().ajax.reload();
                    });


                    $(document).on("wb-updated.wb-tabs", ".wb-tabs", function (event, $newPanel) {

                        $('#GeoRegionID').select2();
                    });


                    // removes a reservation from the list
                    $(document).on("click", "#modalDeleteButton", function () {

                        $.ajax({

                            url: URL_Admission_DeleteReservation,
                            type: "GET",
                            data: { "id": deleteID },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);
                            $("#reservationsTable").DataTable().ajax.reload();
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $(".bedContent").removeClass("glyphicon-flag").removeClass("glyphicon-exclamation-sign").addClass("glyphicon-bed");

                        });
                    });


                    // goes back to the admission form from the manage rooms and beds view
                    $(document).on("click", "#backToFormBtn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        var isReso = $("#IsReservation").val();
                        if (isReso == "false" || isReso == "False") {
                            $("h3#page-title").html(label_NewBookIn);
                        }
                        else {
                            $("h3#page-title").html(label_NewReservation);
                        }
                    });

                    // goes back to the tables view from the manage rooms and beds view
                    $(document).on("click", "#backBtn", function () {

                        $("#tablesView").fadeIn(800);
                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        selectedBookedInClient = null; // reset, if any, selected clients that are booked in.

                        $("#bookedInTable").DataTable().ajax.reload();
                        $("#reservationsTable").DataTable().ajax.reload();

                        $("h3#page-title").html(label_Admissions);
                    });


                    // displays the graphical view as small icons
                    $(document).on("click", ".smallTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);

                        $(".bedContent").children().hide(); // since this is the small icon view then hide the content so it does not overflow
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        var lastRoom = $("div.body").children(".row").last().children(".room");
                        if (lastRoom.length != 1)
                            $(".room").removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        else
                            $(".room").not(lastRoom).removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        $(".bed").css("width", "35px").css("height", "30px");

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    // displays the graphical view as large icons
                    $(document).on("click", ".largeTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                        $(".clientButton").show();
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        $(".room").addClass("col-md-12").addClass("col-lg-12").addClass("col-sm-12").addClass("col-xs-12");
                        $(".bed").css("width", "157px").css("height", "90px");//.removeClass("noText")

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    //***************************************************************************
                    //*
                    //*   Booking control panel.
                    //*
                    //****************************************************************************
                    $(".bookinControlPanel").on({
                        mouseenter: function () {
                            if ($(this).is(".closed"))
                                $(this).stop(true, true).animate({ left: "+=250px" }, 500).removeClass("closed").addClass("open");
                        },
                        mouseleave: function () {
                            if ($(this).is(".open"))
                                $(this).stop(true, true).animate({ left: "-=250px" }, 500).removeClass("open").addClass("closed");
                        }
                    });

                    $("#chk-OccupiedBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".booked-bed").not(".legend").show();
                        else
                            $(".booked-bed").not(".legend").hide();
                    });

                    $("#chk-UnoccupiedBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".activeBed").not(".legend").show();
                        else
                            $(".activeBed").not(".legend").hide();
                    });

                    $("#chk-overflowBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".overflowBed").not(".legend").show();
                        else
                            $(".overflowBed").not(".legend").hide();
                    });

                    $("#chk-InactiveBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".inactiveBed").not(".legend").show();
                        else
                            $(".inactiveBed").not(".legend").hide();
                    });

                    $("#chk-OccupiedRooms").on("change", function () {
                        var availableRooms = $(".activeBed").parents(".room");
                        if ($(this).is(":checked"))
                            $(".room").not(".legend").not(availableRooms).show();
                        else
                            $(".room").not(".legend").not(availableRooms).hide();
                    });

                    //***************************************************************************
                    //*
                    //*   This function searches the text of client buttons for matching search
                    //*   query.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".searchButton", function () {

                        index = 0;
                        flag = false;

                        $(".selected-booked").removeClass("selected-booked");
                        var array = $(".clientButton_booked");
                        var q = $("#search-box").val().toLowerCase();

                        array.slice(index).each(function () {

                            var text = $(this).attr("data-label").toLowerCase();

                            if (text.search(q) >= 0) {

                                var client = $(this);

                                $('html, body').stop(true, true).animate({
                                    scrollTop: client.parent().parent().parent(".room").offset().top
                                }, 1000);

                                flag = true;
                                index = ++index % array.length;
                                client.trigger("click");//.addClass("selected-booked");
                                return false;
                            }

                            index = ++index % array.length;
                        });
                    });
                }


            }, // END OnReady


        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   BookInView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            validateAttestationConsent: function () {
                //console.log("validateAttestationConsent");

                var familyArray = [];
                var postData = {};
                var textTag = $('<text>');

                //go for the attestation and refine the family list
                if (appSettings_IsAttestationEnabled == 'True' || appSettings_IsAttestationEnabled) {

                    for (var keyX in family) {

                        if (family.hasOwnProperty(keyX)) {
                            familyArray.push(keyX);
                        }
                    }

                    postData = {
                        FamilyMembers: familyArray,
                        InputName: 'ClientIDs',
                        Callback: '$(function(data) {HIFIS_Admissions.BookInView.Utility_Functions.familyAttestationCallback(data.Result); });'
                    };

                    $(textTag).append(

                        $.post(URL_Master_FamilyAttestation,
                            $.param(postData, true),
                            function (data) {
                                $("#family-attestation-result").html(data);
                            })
                    );
                }
                else if (appSettings_EnforceConsent == 'True' || appSettings_EnforceConsent) {

                    for (var keyY in family) {

                        if (family.hasOwnProperty(keyY)) {
                            familyArray.push(keyY);
                        }
                    }

                    postData = {
                        FamilyMembers: familyArray,
                        InputName: 'ClientIDs',
                        Callback: '$(function(data) {HIFIS_Admissions.BookInView.Utility_Functions.familyAttestationCallback(data.Result); });'
                    };

                    $(textTag).append(

                        $.post(URL_Master_FamilyConsent,
                            $.param(postData, true),
                            function (data) {
                                $("#family-attestation-result").html(data);
                            })
                    );
                }
                else {

                    HIFIS_Admissions.BookInView.Utility_Functions.familyAttestationCallback(null);
                }
            },

            autocompleteCallback: function () {

                var id = $('#ClientIDs option:last')[0].value;
                var text = $('#ClientIDs option:last')[0].text;

                if ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False") {

                    //console.log("172: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                    HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(id, text);
                }
                
                else if ($(".clientButton[data-clientid='" + id + "']").length == 0) {

                    var htmlString = '<div class="clientButton btn btn-primary" data-clientid="' + id + '">';
                    htmlString += '<span class="glyphicon glyphicon-user"></span >&nbsp&nbsp' + text + '</div>';

                    $("#clientToolBar").append(htmlString);
                }
               
                else { }
            },


            applyAttestationResults: function (result) {

                for (var index in result) {
                    var attestedClientID = result[index];
                    delete family[attestedClientID];
                 }
            },


            familyAttestationCallback: function (result) {
                //console.log("1806: familyAttestationCallback was call");
                if (result != null && result != "null") {

                    HIFIS_Admissions.BookInView.Utility_Functions.applyAttestationResults(result);
                }

                $("#ClientIDs > option").remove();
                $(clientIDs).val("").trigger("change");
                $("#clientToolBar").html("");

                // add clients to the options list
                for (var key in family) {

                    if (family.hasOwnProperty(key)) {

                        $(clientIDs).append($("<option>", { value: key, text: family[key] }));
                        $("select#ClientIDs option[value='" + key + "']").prop("selected", true).parent().trigger("change");
                    }
                }

                // check if clients are already booked in
                $(clientIDs).children("option").each(function () {

                    //console.log("1829: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                    HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                });
            },


            // MP - Move getCurrentAdmissionDetails() to HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails()

            // MP - Move appendClientDivsToBeds() to HIFIS_Admissions.SharedFunction.Utility_Functions.appendClientDivsToBeds()
           
            // MP - Move createPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover()
            
            // MP - Move unifyDivHeights() to HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights()
            
            // MP - Move getNewForm() to HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm()
            
            // MP - Move isClientBookedIn() to HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn()


            //***************************************************************************
            //*
            //*   This function checks for a service restriction.
            //*
            //****************************************************************************
            isServiceRestricted: function (id, text) {

                $("#familyBtn").hide();
                $.ajax({

                    url: URL_Master_IsServiceRestrictedAjax,
                    type: "GET",
                    data: {
                        "id": id,
                        "moduleType": ServiceRestrictionModules_Stays,
                        "requestDate": ($("#DateStart").val() + " " + $("#DateStart_TimeOfDay").val())
                    },

                }).done(function (isRestricted) {

                    if (isRestricted) {

                        //console.log("1870: text + label_ActiveServiceRestriction: " + text + label_ActiveServiceRestriction);
                        alert(text + label_ActiveServiceRestriction);

                        if (HasRight_Barred_Override === "False") {

                            $("#ClientIDs option[value=" + id + "]").prop("selected", false).parent().trigger("change");
                            $("#ClientIDs option[value=" + id + "]").remove();
                            $(".clientButton[data-clientid='" + id + "']").remove();

                        }
                        else {

                            HIFIS_Admissions.BookInView.Utility_Functions.appendClientButton(id, text);
                        }
                    }
                    else {

                        HIFIS_Admissions.BookInView.Utility_Functions.appendClientButton(id, text);
                    }
                });

            },


            appendClientButton: function (id, text) {

                if ($(".clientButton[data-clientid='" + id + "']").length == 0) {

                    var htmlString = '<div class="clientButton btn btn-primary" data-clientid="' + id + '"><span class="glyphicon glyphicon-user"></span>&nbsp&nbsp' + text + '</div>';

                    $("#clientToolBar").append(htmlString);
                    $("#familyBtn").show();
                }
            },

            // MP - Move moveToolBar() to HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar()
            
            // MP - Move removeProcessingPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover()
           
            // MP - Move clientFamilyCheck() to HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck()
            
            // MP - Move getShelterInfo() to HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo()


        }, // END Utility_Functions

    }, // END BookInView

    //BookOutView
    /*
    BookOutView: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {
                    
                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    HIFIS_Admissions.SharedFunction.Utility_Functions.requiredIf();
                }

            }, // END OnReady

        }, // END ApplyOnLoad

        //****************************************************************************************************************
        //*   BookOutView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            // MP - Move requiredIf() to HIFIS_Admissions.SharedFunction.Utility_Functions.requiredIf()
            

        }, // END Utility_Functions

    }, // END BookOutView
    */ 

    //ClientAdmissionsView
    /*
    ClientAdmissionsView: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    $(document).on("wb-ready.wb-tables", ".wb-tables", function (event) {

                        $("#loader-div").addClass("hide").css({ "margin-left": "250px", "margin-top": "100px" });
                        $("#container").css('margin-left', '');

                        //***************************************************************************
                        //*
                        //*   Get stay details to display to the user.
                        //*
                        //****************************************************************************
                        $(document).on("click", "#AJAXbookedInTable .display-btn", function () {

                            var displayModal = $("#display-stay");
                            var id = $(this).attr("data-id");
                            var client = $(this).attr("data-client");

                            $("#printBtn").attr("href", URL_Admission_Details + id); // sets the print url to the right stay id
                            displayModal.find(".modal-body").html($("#loader-div").removeClass("hide"));
                            displayModal.show();

                            $.ajax({

                                url: URL_Admission_DisplayBookedInStay,
                                type: "GET",
                                data: { "id": id },

                            }).done(function (data) {

                                displayModal.find(".modal-body").html($("#loader-div"));
                                displayModal.find(".modal-body").append(data.Result);
                                $("#loader-div").addClass("hide");

                            }).fail(function () {

                                //console.log("1906: label_GetStayInformation: " + label_GetStayInformation);
                                alert(label_GetStayInformation);
                                displayModal.hide();
                            });

                        });

                        $(".modalCloseButton").on("click", function () {
                            $(".modal").hide();
                        });
                    });


                    // draw event for the datatables...Since the datatables loads after the javascript loads then
                    // the buttons within the tables need to be initialised after the table is drawn.
                    $(document).on("wb-updated.wb-tables", ".wb-tables", function (event, settings) {

                        initButtons();
                        $(".editButton").parents("td").addClass("align-text-center");
                    });


                    $(document).on("click", ".addButton", function (event) {

                        return HIFIS_Admissions.ClientAdmissionsView.Utility_Functions.BlockDeceasedArchivedBookins();
                    });


                    $(document).on("click", ".reserveButton", function (event) {

                        return HIFIS_Admissions.ClientAdmissionsView.Utility_Functions.BlockDeceasedArchivedBookins();
                    });

                }

            }, // END OnReady

        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   ClientAdmissionsView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            BlockDeceasedArchivedBookins: function () {

                if (current_ClientStateTypeID == archivedInt || current_ClientStateTypeID == deceasedInt) {

                    displayNotification('alert', '', "<p>" + label_BookInWithWrongStatusMsg + "</p>");
                    return false; // cancel the event
                }
                return true;
            },

        }, // END Utility_Functions

    }, // END ClientAdmissionsView
    */

    //CreateView
    /*
    CreateView: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    HIFIS_Admissions.SharedFunction.Utility_Functions.updateAvailableBedsList();
                }

            } // END OnReady

        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   CreateView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {


            // MP - Move updateAvailableBedsList() to HIFIS_Admissions.SharedFunction.Utility_Functions.updateAvailableBedsList()
            
            // MP - Move makeOptions() to HIFIS_Admissions.SharedFunction.Utility_Functions.makeOptions()
            
            // MP - Move reinitSelect2() to HIFIS_Admissions.SharedFunction.Utility_Functions.reinitSelect2()
            

        }, // END Utility_Functions

    }, // END CreateView
    */

    EditReservationView: {

        ApplyOnLoad: {


            //***************************************************************************
            //*
            //*   The document on ready function. This function will check if any client
            //*   ids came pre-populated and sends out ajax calls to check if they are al-
            //*   ready booked in or have service restrictions. If not, the calls go ahead
            //*   and append clientButtons to the client toolbar.
            //*
            //*   It then creates the popover for all of the bed panels and changes back-
            //*   ground colors for selected beds if necessary. If a reservation is pre-
            //*   populated it calls the function getCurrentAdmissionDetails, to check for
            //*   conflicts with a current book-in and the reserved bed.
            //*
            //*   BASICALLY, the on ready function will decide how to initially display
            //*   the content of the Index view.
            //*
            //****************************************************************************
            OnReady: function () {


                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    $(function () {

                        $(".cd-top").hide();

                        // IF THERE ARE PRE-POPULATED CLIENTS IN THE VIEWMODEL
                        if (clients != "") {

                            // display index pages form                     
                            $("#admissionFormDiv").fadeIn(800);
                            $("#tablesView").fadeOut(300);
                            $("#bedsView").fadeOut(300);

                            // IF INTAKE IS NOT A RESERVATION
                            if ($("#IsReservation").val() === "False" || $("#IsReservation").val() === "false") {

                                $(clientIDs).children("option").each(function () {

                                    //console.log("2142: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                                    HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                                });

                                // get the current admission details which will prevent the use of a booked in bed
                                HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                                $("h3#page-title").html(label_NewBookIn);

                            }
                            else {

                                // hide unused form controls
                                $("#wake").hide();
                                $("#intox").hide();
                                $("#latePass").hide();

                                if ($("#StayID").val() === "") {

                                    // append client object buttons to the toolbar
                                    $(clientIDs).children("option").each(function () {

                                        var htmlString = "<div class='clientButton btn btn-primary' data-clientid='" + $(this).attr("value") + "'>";
                                        htmlString += "<span class='glyphicon glyphicon-user'></span>&nbsp&nbsp" + $(this).text().trim() + "</div>"

                                        $("#clientToolBar").append(htmlString);
                                    });
                                }

                                if ($("#IsReservation").val() === "True" || $("#IsReservation").val() === "true") {

                                    $("h3#page-title").html(label_viewTitle_EditReservation);
                                }
                                else {

                                    $("h3#page-title").html(label_NewReservation);
                                }
                            }

                            $("#ClientIDs").attr("disabled", true);

                        } else {

                            // display index page normally
                            $("#bedsView").fadeOut(300);
                            $("#admissionFormDiv").fadeIn(800);


                          
                        }// END IF 


                        // Filter Bed Availability list
                        $(document).on("change", "#details-panel3 #GeoRegionID", function () {

                            var table = $('#availabilityTable').DataTable();
                            table.ajax.url(URL_Admission_SheltersAdmissionsStatsJson + $('#GeoRegionID').val()).load();
                        });


                        // find all client object buttons within an active bed to change display
                        $(".clientButton").parent().parent(".activeBed").addClass("requested-bed").removeClass(".activeBed");


                        // initialize the popover display of the beds
                        $(".bedButton").popover({

                            html: true,
                            container: "body",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });


                        // Modals
                        //$(".modal").hide().css("display", "normal");


                        // window scroll check
                        $(window).scroll(function () {

                            if ($(this).scrollTop() > 100 && !$("#admissionFormDiv").is(":visible") && !$("#tablesView").is(":visible")) {

                                $(".cd-top").fadeIn();
                            }
                            else {

                                $(".cd-top").fadeOut();
                            }
                        });


                        //Click event to scroll to top
                        $(document).on("click", ".cd-top", function () {

                            $("html, body").animate({ scrollTop: 0 }, 800);
                            return false;
                        });


                        // call function to fix toolbar when scrolling
                        HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar();

                    }); // END ON READY FUNCTION


                    $(document).on("wb-ready.wb", function (event) {
                        // Show page!
                        //$("#container").show();

                    });


                    $(document).on("wb-ready.wb-tables", ".wb-tables", function (event) {

                        $("#loader-div").addClass("hide").css({ "margin-left": "250px", "margin-top": "100px" });
                        $("#container").css('margin-left', '');
                    });


                    //***************************************************************************
                    //*
                    //*   Draw event for the DataTables plugin. Since the tables data loads after
                    //*   the JavaScript loads, the buttons within the tables need to be initia-
                    //*   lized here.
                    //*
                    //****************************************************************************
                    $(document).on("wb-updated.wb-tables", ".wb-tables", function (event, settings) {

                        initButtons();
                        var currentOrg = session_currentOrg;

                        for (var i = 0; i < $("#availabilityTable > tbody > tr > td").length; i += 4) {

                            var element = $("#availabilityTable > tbody > tr > td").eq(i);
                            if (element.text() === currentOrg) {

                                element.parent("tr").css("font-weight", "bolder");
                            }
                        }

                        $(".info-pop").popover({

                            html: true,
                            container: "body",
                            content: function () {
                                return HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo($(this).attr("data-id"));
                            },
                            placement: "left",
                            trigger: "focus",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });
                    });


                    //***************************************************************************
                    //*
                    //*   Submit event for the intake form. This event triggers when the user
                    //*   clicks the next button of the admissions form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#showBedsButton", function (event) { //incorrect button id was used in submit function event

                        if ($("#admissionsForm").valid() && $("#ClientIDs").val() != null && $("#ReservationStatusTypeID").val() != "") {

                            if (session_BedDisplayExpanded == "False") {

                                $(".smallTileButton").trigger("click");
                            }
                            else {

                                $(".largeTileButton").trigger("click");
                            }
                        }

                        $("#book-in-controls").show();
                        $("#backBtn").hide();

                        if ($("#admissionsForm").valid()) {

                            var isReso = $("#IsReservation").val();
                            if (isReso == "false" || isReso == "False") {

                                $("h3#page-title").html(label_BookIn);
                            }
                            else {

                                $("h3#page-title").html(label_Reservation);
                            }
                        }

                        //event.preventDefault();

                    });


                    //***************************************************************************
                    //*
                    //*   Click event which posts the admission details to be inserted into the
                    //*   database. This page displays after the above submit event which validates
                    //*   the form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#confirmBtn", function () {

                        HIFIS_Admissions.SharedFunction.Utility_Functions.saveClientsInBeds(URL_Admission_Reservations);
                    });


                    //***************************************************************************
                    //*
                    //*   Allows the control panels client search control to be initiated with 
                    //*   the return key.
                    //*
                    //****************************************************************************
                    $(document).keypress(function (e) {

                        if (e.which == 13 && $("#search-box:focus").length > 0)
                            $(".searchButton").trigger("click");
                    });


                    //***************************************************************************
                    //*
                    //*   This click event initiates the service call to move a client to another
                    //*   bed
                    //*
                    //****************************************************************************
                    $(document).on("click", "#modalYesButton", function () {

                        $.ajax({

                            url: URL_Admission_ChangeClientBed,
                            type: "GET",
                            data: {
                                id: $(selectedBookedInClient).attr("data-stay"),
                                room: $(selectedBookedInClient).parents().parents().parents().attr("data-room-id"),
                                bed: $(selectedBookedInClient).parents().parents().attr("data-bed-id")
                            },

                        }).done(function (data) {

                            //$(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false); // calling this function displays the current admission details in the graphical view
                            selectedBookedInClient = null;
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $("#bookedInTable").DataTable().ajax.reload();
                            $("#reservationsTable").DataTable().ajax.reload();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   This click event closes any open modal. This acts like a cancel button.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".modalCloseButton", function () {

                        // calling this function displays the current admission details in the graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);
                        selectedBookedInClient = null;
                        //$(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This click event will trigger a click event for the required bed view
                    //*   button which will reload the data for the current beds.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#refresh-beds", function () {

                        if ($(selectedToolBarBtn).attr("id") === "smallViewBtn") {

                            $(".smallTileButton").trigger("click");
                        }
                        else {

                            $(".largeTileButton").trigger("click");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on an available bed which will select this bed for the new
                    //*   admission. First off, it checks if there is a selected booked in client, 
                    //*   in which case it means the user is trying to move a booked in client to 
                    //*   this bed rather than be part of a new admission. Secondly, it checks if 
                    //*   the event target is an existing client within the bed, in which case the 
                    //*   event stops and only fires an event on the client button. In any other 
                    //*   case, the event is fired and the selected client is moved to this bed as 
                    //*   part of a new admission process.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .activeBed", function (event) {

                        // if an already booked in client is selected
                        if (selectedBookedInClient != null) {

                            $(this).children(".bedContent").html(selectedBookedInClient); // display client within bed

                            // if the user is in the small icons view then hide the client buttons
                            if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                $(".bedContent").children().hide();

                            // show the confirm move modal to confirm whether the user wants to move the client or not
                            $("#move-confirm").show();

                        } else if ($(".clientButton").length > 0) {

                            if (selectedClient == null) // if a client is not selected then the event selects the first matching element.
                                selectedClient = $(".clientButton").first();

                            // check if this client is within a requested bed and reset the bed so it is available
                            var requestedBed = selectedClient.parents().parents(".requested-bed");     // get the selected client's currently selected bed
                            if (requestedBed.length > 0) {

                                HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover(requestedBed);                                 // remove existing popover details for a processing request
                                requestedBed.removeClass("requested-bed").addClass("activeBed");       // reset the bed back to an active bed
                            }

                            // we can now write the client div to this new .activeBed element
                            $(this).children(".bedContent").html(selectedClient);

                            // if the user is in the small icon view then hide the client button
                            if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                $(".bedContent").children().hide();

                            // append info to the popover display
                            var content = $(this).attr("data-content");
                            content += "<p class='process'><strong>" + label_Processing + "</strong>&nbsp&nbsp" + selectedClient.text().trim() + "</p>"
                            $(this).attr("data-content", content);

                            // change background color and selection types of bedButtons for all of the beds that contain a client admission request
                            $(this).addClass("requested-bed").removeClass("activeBed");

                            // within an if in case a null value exists
                            if (selectedClient.length > 0) {

                                selectedClient.removeClass("selected-client"); // reset 
                                displayNotification('info', '', "<p>" + selectedClient.text().trim() + "</p>");
                            }

                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a requested bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .requested-bed", function (event) {

                        // stops the event if click is on a client button within an active bed
                        if (!$(event.target).is(".clientButton")) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover($(this));

                            var clientButton = $(this).children().children(".clientButton");
                            $("#clientToolBar").append(clientButton);
                            clientButton.show();

                            if (selectedClient != null) {

                                selectedClient.removeClass("selected-client");
                            }

                            $(this).removeClass("requested-bed").addClass("activeBed");
                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is part of a new admission.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton", function (event) {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is already booked in. This allows the user
                    //*   to move the client to another bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton_booked", function (event) {

                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");

                        if ($(this).is(".selected-booked")) {

                            $(this).removeClass("selected-booked");
                            selectedBookedInClient = null;
                        }
                        else {

                            selectedBookedInClient = $(this);
                            $(".clientButton_booked").removeClass("selected-booked");
                            $(this).addClass("selected-booked");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on the client toolbar that is delegated to the clientButton.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#toolbar .clientButton", function (event) {

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Select event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(clientIDs).on("select2:select", function (e) {


                        if ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False") {

                            //console.log("2717: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(e.params.data.id, e.params.data.text);
                        }
                        else if ($(".clientButton[data-clientid='" + e.params.data.id + "']").length == 0) {

                            var htmlString = '<div class="clientButton btn btn-primary" data-clientid="' + e.params.data.id + '">';
                            htmlString += '<span class="glyphicon glyphicon-user"></span>&nbsp&nbsp' + e.params.data.text + '</div>';

                            $("#clientToolBar").append(htmlString);
                        }
                        else { }

                    });


                    //***************************************************************************
                    //*
                    //*   Unselect event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(clientIDs).on("select2:unselect", function (e) {

                        var clientObject = $(".clientButton[data-clientid='" + e.params.data.id + "']");
                        clientObject.parent().parent(".bedButton").removeClass("requested-bed");
                        clientObject.remove();
                        $("#ClientIDs option[value='" + e.params.data.id + "']").remove();

                        if ($(clientIDs).val() != null && $(clientIDs).val().length == 1) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck($(clientIDs).val().toString());
                        }
                        else {
                            
                            $("#familyBtn").addClass("hide");

                            if ($(clientIDs).val() == null) {

                                $("#ClientIDs > option").remove();
                            }
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Selects family for a book in by placing them as selected options in the
                    //*   multi-select control for client ids.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#familyBtn", function () {

                        $("#ClientIDs > option").remove();
                        $(clientIDs).val("").trigger("change");
                        $("#clientToolBar").html("");

                        // add clients to the options list
                        for (var key in family) {

                            if (family.hasOwnProperty(key)) {

                                $(clientIDs).append($("<option>", { value: key, text: family[key] }));
                                $("select#ClientIDs option[value='" + key + "']").prop("selected", true).parent().trigger("change");
                            }
                        }

                        // check if clients are already booked in
                        $(clientIDs).children("option").each(function () {

                            //console.log("2785: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                        });
                    });


                    //***************************************************************************
                    //*
                    //*   Get stay details to display to the user.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#tablesView .display-btn", function () {

                        var displayModal = $("#display-stay");
                        var id = $(this).attr("data-id");
                        var client = $(this).attr("data-client");

                        $("#printBtn").attr("href", URL_Admission_Details + id); // sets the print url to the right stay id
                        $("#clientAddmissionsBtn").attr("href", URL_Admission_ClientAdmissions + client); // sets the client url to the right client id

                        displayModal.find(".modal-body").html($("#loader-div").removeClass("hide"));
                        displayModal.show();

                        $.ajax({

                            url: URL_Admission_DisplayBookedInStay,
                            type: "GET",
                            data: { "id": id },

                        }).done(function (data) {

                            displayModal.find(".modal-body").html($("#loader-div"));
                            displayModal.find(".modal-body").append(data.Result);
                            $("#loader-div").addClass("hide");

                        }).fail(function () {

                            //console.log("2713: label_GetStayInformation: " + label_GetStayInformation);
                            alert(label_GetStayInformation);
                            displayModal.hide();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   When a user clicks on the print button within the display modal we want
                    //*   to open the display in a new tab but also close the modal for smoother
                    //*   interaction.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#printBtn", function () {

                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   Display state events.
                    //*
                    //****************************************************************************
                    // starts a new book-in
                    $(document).on("click", "#tablesView #book-in-btn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(false);

                        $("h3#page-title").html(label_NewBookIn);
                    });


                    // starts a new reservation
                    $(document).on("click", "#tablesView #reserve-btn", function () {

                        $("#ClientIDs").attr("disabled", false);

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(true);

                        $("h3#page-title").html(label_NewReservation);
                    });


                    // brings you to the graphical view to manage booked in clients
                    $(document).on("click", "#tablesView .manage-btn", function () {

                        if (session_BedDisplayExpanded == "False") {

                            $(".largeTileButton").trigger("click");
                        }
                        else {

                            $(".smallTileButton").trigger("click");
                        }

                        $("#book-in-controls").hide();
                        $("#backBtn").show();
                        $("#IsReservation").val("false");
                        $("#search-box").trigger("focus");

                        $("h3#page-title").html(label_ManageRoomsBeds);
                    });


                    // displays the modal to confirm deletion of a reservation
                    $(document).on("click", "#tablesView .deleteButton", function (event) {

                        $("#delete-confirm").show();
                        deleteID = $(this).attr("data-stayid");
                        event.preventDefault();
                    });


                    // refresh the bed availability table
                    $(document).on("click", "#tablesView #refresh-stats", function () {

                        $("#availabilityTable").DataTable().ajax.reload();
                    });


                    $(document).on("wb-updated.wb-tabs", ".wb-tabs", function (event, $newPanel) {

                        $('#GeoRegionID').select2();
                    });

                    
                    // removes a reservation from the list
                    $(document).on("click", "#modalDeleteButton", function () {

                        $.ajax({

                            url: URL_Admission_DeleteReservation,
                            type: "GET",
                            data: { "id": deleteID },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admission.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);
                            $("#reservationsTable").DataTable().ajax.reload();
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $(".bedContent").removeClass("glyphicon-flag").removeClass("glyphicon-exclamation-sign").addClass("glyphicon-bed");

                        });
                    });


                    // goes back to the admission form from the manage rooms and beds view
                    $(document).on("click", "#backToFormBtn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        var isReso = $("#IsReservation").val();
                        if (isReso == "false" || isReso == "False") {

                            $("h3#page-title").html(label_NewBookIn);
                        }
                        else {

                            $("h3#page-title").html(label_NewReservation);
                        }

                    });


                    // goes back to the tables view from the manage rooms and beds view
                    $(document).on("click", "#backBtn", function () {

                        $("#tablesView").fadeIn(800);
                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        selectedBookedInClient = null; // reset, if any, selected clients that are booked in.

                        $("#bookedInTable").DataTable().ajax.reload();
                        $("#reservationsTable").DataTable().ajax.reload();

                        $("h3#page-title").html(label_Admissions);
                    });


                    // displays the graphical view as small icons
                    $(document).on("click",".smallTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);

                        $(".bedContent").children().hide(); // since this is the small icon view then hide the content so it does not overflow
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        var lastRoom = $("div.body").children(".row").last().children(".room");
                        if (lastRoom.length != 1) {
                            $(".room").removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        }
                        else {
                            $(".room").not(lastRoom).removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                            $(".bed").css("width", "35px").css("height", "30px");
                        }

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    // displays the graphical view as large icons
                    $(document).on("click",".largeTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                        $(".clientButton").show();
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        $(".room").addClass("col-md-12").addClass("col-lg-12").addClass("col-sm-12").addClass("col-xs-12");
                        $(".bed").css("width", "157px").css("height", "90px");//.removeClass("noText")

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    //***************************************************************************
                    //*
                    //*   Booking control panel.
                    //*
                    //****************************************************************************
                    $(".bookinControlPanel").on({

                        mouseenter: function () {
                            if ($(this).is(".closed"))
                                $(this).stop(true, true).animate({ left: "+=250px" }, 500).removeClass("closed").addClass("open");
                        },
                        mouseleave: function () {
                            if ($(this).is(".open"))
                                $(this).stop(true, true).animate({ left: "-=250px" }, 500).removeClass("open").addClass("closed");
                        }
                    });

                    $("#chk-OccupiedBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".booked-bed").not(".legend").show();
                        else
                            $(".booked-bed").not(".legend").hide();
                    });

                    $("#chk-UnoccupiedBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".activeBed").not(".legend").show();
                        else
                            $(".activeBed").not(".legend").hide();
                    });

                    $("#chk-overflowBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".overflowBed").not(".legend").show();
                        else
                            $(".overflowBed").not(".legend").hide();
                    });

                    $("#chk-InactiveBeds").on("change", function () {
                        if ($(this).is(":checked"))
                            $(".inactiveBed").not(".legend").show();
                        else
                            $(".inactiveBed").not(".legend").hide();
                    });

                    $("#chk-OccupiedRooms").on("change", function () {
                        var availableRooms = $(".activeBed").parents(".room");
                        if ($(this).is(":checked"))
                            $(".room").not(".legend").not(availableRooms).show();
                        else
                            $(".room").not(".legend").not(availableRooms).hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This function searches the text of client buttons for matching search 
                    //*   query.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".searchButton", function () {

                        index = 0;
                        flag = false;

                        $(".selected-booked").removeClass("selected-booked");
                        var array = $(".clientButton_booked");
                        var q = $("#search-box").val().toLowerCase();

                        array.slice(index).each(function () {

                            var text = $(this).attr("data-label").toLowerCase();

                            if (text.search(q) >= 0) {

                                client = $(this);

                                $('html, body').stop(true, true).animate({
                                    scrollTop: client.parent().parent().parent(".room").offset().top
                                }, 1000);

                                flag = true;
                                index = ++index % array.length;
                                client.trigger("click");//.addClass("selected-booked");
                                return false;
                            }

                            index = ++index % array.length;
                        });
                    });


                }


            }, // END OnReady

        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   EditReservationView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            // MP - Move getCurrentAdmissionDetails() to HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails()
            
            // MP - Move appendClientDivsToBeds() to HIFIS_Admissions.SharedFunction.Utility_Functions.appendClientDivsToBeds()
           
            // MP - Move createPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover()
            
            // MP - Move unifyDivHeights() to HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover()
            
            // MP - Move getNewForm() to HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm()
            
            // MP - Move isClientBookedIn() to HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn()


            //***************************************************************************
            //*
            //*   This function checks for a service restriction.
            //*
            //****************************************************************************
            isServiceRestricted: function (id, text) {

                $.ajax({

                    url: URL_Master_IsServiceRestrictedAjax,
                    type: "GET",
                    data: {
                        "id": id,
                        "moduleType": ServiceRestrictionModules_Stays,
                        "requestDate": $("#DateStart").val()
                    },

                }).done(function (data) {

                    if (data) {

                        //console.log("3059: text + label_ActiveServiceRestriction: " + text + label_ActiveServiceRestriction);
                        alert(text + label_ActiveServiceRestriction);

                        $("#ClientIDs option[value=" + id + "]").prop("selected", false).parent().trigger("change");
                        $("#ClientIDs option[value=" + id + "]").remove();
                        $(".clientButton[data-clientid='" + id + "']").remove();

                    }
                    else if ($(".clientButton[data-clientid='" + id + "']").length == 0) {

                        $("#clientToolBar").append("<div class=\"clientButton btn btn-primary\" data-clientid=\"" + id
                            + "\"><span class=\"glyphicon glyphicon-user\"></span>&nbsp&nbsp" + text + "</div>");
                    }
                    else { }

                });

            },


            // MP - Move moveToolBar() to HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar()
            
            // MP - Move removeProcessingPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover()
            
            // MP - Move clientFamilyCheck() to HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck()
            
            // MP - Move getShelterInfo() to HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo()
            

        }, // END Utility_Functions

    }, // END EditReservationView

    //ExpressBookInView
    /*
    ExpressBookInView: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {
                    
                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    //focus view on filenumber input for scanners.
                    $(function() {
                        HIFIS_Admissions.ExpressBookInView.Utility_Functions.noClient();
                    });

                    var pgmID = [];
                    $('#programIDs option:selected').each(function () {
                        pgmID = $('#programIDs').val();
                    });


                    //Calling the bookin action to save the stay.
                    $(document).on('click', '#bookInButton', function () {

                        $.ajax({

                            url: URL_Admission_ExpressBookIn,
                            type: "POST",
                            data: {
                                "ClientID": $('#HiddenClientID').val(),
                                "BedID": $('#BedID').val(),
                                "ReferredFromID": $('#ReferredFromID').val(),
                                "ReasonForServiceID": $('#ReasonForServiceID').val(),
                                "ProgramIDs": pgmID, //only selected options of program field are passed
                                "__RequestVerificationToken": HIFIS_Admissions.ExpressBookInView.Utility_Functions.gettoken()
                            },

                        }).done(function (data) {

                            if (data.Success == true) {

                                displayNotification('success', '', "<p>" + $('#ClientFullName').val() + " " + label_BookedIn + "</p>");
                                HIFIS_Admissions.ExpressBookInView.Utility_Functions.hideValidation();
                                HIFIS_Admissions.ExpressBookInView.Utility_Functions.noClient();
                                HIFIS_Admissions.ExpressBookInView.Utility_Functions.resetROV();
                            }
                            else {

                                HIFIS_Admissions.ExpressBookInView.Utility_Functions.showValidation(data.ValidationSummary);
                                HIFIS_Admissions.SharedFunction.Utility_Functions.updateAvailableBedsList();
                            }

                        }).always(function () { });

                    });

                    //If enter has been presssed on the file number textbox
                    $(document).on('keydown', 'input[type=text]', function (e) {

                        if (e.which == 13) {

                            if (IsAttestationEnabled()) {

                                //var htmlString = '<text>';

                                //htmlString += 
                                $().post(URL_Master_ConfirmAccessToClient, {

                                    FieldType: SelectClientFieldTypes_FileNumber,
                                    ID: $('#FileNumber').val(),
                                    InputName: 'FileNumber',
                                    Callback: 'HIFIS_Admissions.ExpressBookInView.Utility_Functions.getClientFromFileNumber();'

                                },

                                function (data) {
                                    $("#FileNumber-attestation-result").html(data);
                                });

                                //htmlString += '</text>';
                            }
                            else {

                                HIFIS_Admissions.ExpressBookInView.Utility_Functions.getClientFromFileNumber();
                            }
                        }
                    });

                }

            }, // END OnReady

        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   ExpressBookInView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {


            gettoken: function () {

                var token = AntiForgeryToken;
                token = $(token).val();
                return token;
            },


            getClientFromFileNumber: function () {

                HIFIS_Admissions.ExpressBookInView.Utility_Functions.hideBookInButton();
                HIFIS_Admissions.ExpressBookInView.Utility_Functions.hideValidation();

                $.ajax({

                    url: URL_Admission_GetROVPartialFromFileNumber,
                    type: "POST",
                    data: { "fileNumber": $('#FileNumber').val() },

                }).done(function (data) {

                    HIFIS_Admissions.ExpressBookInView.Utility_Functions.populateROVitals(data.Result);

                    if (data.Success == true) {

                        if (data.Restricted == true) {

                            $("#serviceRestrictionAlert").removeClass("hide");
                        }
                        else {

                            $("#serviceRestrictionAlert").addClass("hide");
                        }

                        if ((data.Restricted == true && HasRight_Barred_Override !== "False") || data.Restricted != true) {

                            HIFIS_Admissions.ExpressBookInView.Utility_Functions.isClientBookedIn();
                        }

                        if (data.Multiple == true) {

                            HIFIS_Admissions.ExpressBookInView.Utility_Functions.showValidation("<div class=\"validation-summary-errors mrgn-lft-md mrgn-rght-0 mrgn-tp-0 mrgn-bttm-0\" data-valmsg-summary=\"true\">" +
                                "<span>" +
                                label_Warning +
                                "</span>" +
                                "<ul>" +
                                "<li>" +
                                label_TwoClientsOneNumber +
                                "</li>" +
                                "<li>" +
                                "<a id=\"fileNumberSearch\" title=\"" + label_ClickForFullResults + "\" target=\"_blank\" href=\"../ClientTombstone/ClientSearchProxy?q=" +
                                $('#FileNumber').val() + "\">" + label_ClickForFullResults + "</a>" +
                                "</li>" +
                                "</ul>" +
                                "<div>");
                        }

                    }
                    else {

                        $("#servicerestrictionAlert").hide();
                        HIFIS_Admissions.ExpressBookInView.Utility_Functions.noClient();
                        displayNotification('info', '', "<p>" + label_msgRecordNotFound + "</p>");
                    }

                }).always(function () {

                    $('#FileNumber').val("");
                });

            },


            openClientSearch: function () {

                $.post("ClientTombstone/ClientSearchProxy", {
                    q: $('#FileNumber').val()
                },
                function (data) { });
            },


            //for Ajax validation display
            showValidation: function (data) {

                $('#validationSummary').removeClass("hide").addClass("show");
                $('#validationSummaryText').removeClass("hide").empty().append(data);
            },


            hideValidation: function () {

                $('#validationSummary').removeClass("show").addClass("hide");
                $('#validationSummaryText').addClass("hide").empty();
            },


            //reset the ROV partial to what is displayed when no client is selected.
            resetROV: function () {

                $('#hifis-client-profile').empty().append("<div class=\"row\">" +
                    "<section class=\"col-md-12\">" +
                    "<div class=\"well well-sm mrgn-tp-sm\">" +
                    "<h5 class=\"mrgn-tp-0\">" +
                    label_CouldNotShowClientProfile +
                    "</h5>" +
                    label_NoClientSpecified +
                    "</div>" +
                    "</section>" +
                    "</div>");
            },


            //display the save button after everything has loaded / been modified.
            displayBookInButton: function () {
                
                $('#bookInButton').show();
            },


            hideBookInButton: function () {
                
                $('#bookInButton').hide();
            },


            //if there was a client found based on the file number enable the following fields.
            clientExists: function () {

                $('#ReasonForServiceID').prop('disabled', false);
                $('#BedID').prop('disabled', false);
                $('#ddFrom').prop('disabled', false);

            },


            //if no client is currently selected OR if selected client is already booked in disable all the controls.
            noClient: function () {

                $("#FileNumber").focus();

                $('#ReasonForServiceID').val("").change();
                $('#ReasonForServiceID').prop('disabled', true);

                $('#DateBookIn_Date').prop('disabled', true);
                $('#DateBookIn_TimeOfDay').prop('disabled', true);

                $('#BedID').val("").change();
                $('#BedID').prop('disabled', true);

                $('#ddFrom').prop('disabled', true);
            },


            //check if client is already booked in to a bed today.
            isClientBookedIn: function () {

                $.ajax({

                    url: URL_Admission_IsClientBookedIn,
                    type: "POST",
                    data: { "id": $('#HiddenClientID').val(), "date": dateTime_Now },

                }).done(function (data) {

                    if (data) {
                        HIFIS_Admissions.ExpressBookInView.Utility_Functions.noClient();
                        displayNotification('alert', '', "<a target=\"_blank\" href=\"ClientAdmissions/" + $('#HiddenClientID').val() + "\">" + $('#ClientFullName').val() + " " + label_AlreadyBookedIn + "</a>");
                    }
                    else {

                        HIFIS_Admissions.ExpressBookInView.Utility_Functions.clientExists();

                        HIFIS_Admissions.SharedFunction.Utility_Functions.updateAvailableBedsList();
                        HIFIS_Admissions.ExpressBookInView.Utility_Functions.updateWithPreviousInfo();

                        $(document).ajaxStop(function () {

                            $(this).unbind("ajaxStop");
                            HIFIS_Admissions.ExpressBookInView.Utility_Functions.displayBookInButton();
                        });
                    }

                }).always(function () { });

            },


            //Get the values of client's previous stay and select them in the drop downs if they exist.
            updateWithPreviousInfo: function () {

                $.ajax({

                    url: URL_Admission_GetPreviousStayInfo,
                    type: "POST",
                    data: { "clientID": $('#HiddenClientID').val() },

                }).done(function (data) {

                    if (data.Success == true) {

                        $('#ReasonForServiceID').val(data.Result.Reason).change();
                        $('#BedID').val(data.Result.Bed).change();
                    }

                }).always(function () {

                    HIFIS_Admissions.SharedFunction.Utility_Functions.reinitSelect2($('#BedID'));
                });

            },

            // MP - Move updateAvailableBedsList() to HIFIS_Admissions.SharedFunction.Utility_Functions.updateAvailableBedsList()

            // MP - Move makeOptions() to HIFIS_Admissions.SharedFunction.Utility_Functions.makeOptions()

            // MP - Move reinitSelect2() to HIFIS_Admissions.SharedFunction.Utility_Functions.reinitSelect2()

        }, // END Utility_Functions

    }, // END ExpressBookInView
    */

    IndexView: {

        ApplyOnLoad: {


            //***************************************************************************
            //*
            //*   The document on ready function. This function will check if any client
            //*   ids came pre-populated and sends out ajax calls to check if they are al-
            //*   ready booked in or have service restrictions. If not, the calls go ahead
            //*   and append clientButtons to the client toolbar.
            //*
            //*   It then creates the popover for all of the bed panels and changes back-
            //*   ground colors for selected beds if necessary. If a reservation is pre-
            //*   populated it calls the function getCurrentAdmissionDetails, to check for
            //*   conflicts with a current book-in and the reserved bed.
            //*
            //*   BASICALLY, the on ready function will decide how to initially display
            //*   the content of the Index view.
            //*
            //****************************************************************************
            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    $(function () {
                        //var clients = clients;

                        // display index page normally
                        $("#tablesView").fadeIn(800);
                        $("#bedsView").fadeOut(300);
                        $(".cd-top").hide();
                        //$("#admissionFormDiv").fadeOut(300);


                        // Filter Bed Availability list
                        $(document).on("change", "#details-panel3 #GeoRegionID", function () {

                            var table = $('#availabilityTable').DataTable();
                            table.ajax.url(URL_Admission_SheltersAdmissionsStatsJson + $('#GeoRegionID').val()).load();
                        });


                        // find all client object buttons within an active bed to change display
                        $(".clientButton").parent().parent(".activeBed").addClass("requested-bed").removeClass(".activeBed");


                        // initialize the popover display of the beds
                        $(".bedButton").popover({

                            html: true,
                            container: "body",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });


                        // Modals
                        $(".modal").hide().css("display", "normal");


                        // window scroll check
                        $(window).scroll(function () {

                            if ($(this).scrollTop() > 100 && !$("#tablesView").is(":visible")) {

                                $(".cd-top").fadeIn();
                            }
                            else {

                                $(".cd-top").fadeOut();
                            }
                        });


                        //TODO: MP - Make sure it only apply on this page for ".cd-top"
                        //Click event to scroll to top
                        $(document).on("click", ".cd-top", function () {

                            $("html, body").animate({ scrollTop: 0 }, 800);
                            return false;
                        });


                        // call function to fix toolbar when scrolling
                        HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar();

                    }); // END ON READY FUNCTION


                    $(document).on("wb-ready.wb-tables", ".wb-tables", function (event) {

                        $("#loader-div").addClass("hide").css({ "margin-left": "250px", "margin-top": "100px" });
                        $("#container").css('margin-left', '');
                    });


                    //***************************************************************************
                    //*
                    //*   Draw event for the DataTables plugin. Since the tables data loads after
                    //*   the JavaScript loads, the buttons within the tables need to be initia-
                    //*   lized here.
                    //*
                    //****************************************************************************
                    //$('#foodBankItemsList').on('draw.dt', function () {
                    //    init_hifis();

                    //    //This re-init any lightboxes that are dynamically added via the datables reload call
                    //    $(".wb-lbx").trigger("wb-init.wb-lbx");
                    //});

                    $(document).on("wb-updated.wb-tables", ".wb-tables", function (event, settings) {

                        initButtons();
                        var currentOrg = session_currentOrg;

                        for (var i = 0; i < $("#availabilityTable > tbody > tr > td").length; i += 4) {

                            var element = $("#availabilityTable > tbody > tr > td").eq(i);
                            if (element.text() === currentOrg) {

                                element.parent("tr").css("font-weight", "bolder");
                            }
                        }

                        $(".info-pop").popover({

                            html: true,
                            container: "body",
                            content: function () {
                                return HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo($(this).attr("data-id"));
                            },
                            placement: "left",
                            trigger: "focus",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });
                    });

                    //$(document).on("click", "#admissionsForm", function (event) {
                    //    if ($("#ClientIDs").val() != null && $("#ReservationDateStart").val() != null && $("#ReasonForServiceID").val() != null) {
                    //        var id = $('#ClientIDs option:last')[0].value;
                    //        var text = $('#ClientIDs option:last')[0].text;
                    //        if ($("#IsReservation").val() == "true" || $("#IsReservation").val() == "True") {

                    //        //console.log("172: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                    //        HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(id, text);
                    //    }
                    //    }
                    //    event.preventDefault();
                    //});

                    //***************************************************************************
                    //*
                    //*   Submit event for the intake form. This event triggers when the user
                    //*   clicks the next button of the admissions form.
                    //*
                    //****************************************************************************
                    $(document).on("submit", "#admissionsForm", function (event) {
                       
                        if ($("#admissionsForm").valid() && $("#ClientIDs").val() != null) {

                            if (session_BedDisplayExpanded == "False") {

                                $(".smallTileButton").trigger("click");
                            }
                            else {

                                $(".largeTileButton").trigger("click");
                            }
                        }

                        $("#book-in-controls").show();
                        $("#backBtn").hide();

                        var isReso;

                        if ($(this).valid()) {
                            isReso = $("#IsReservation").val();
                        }

                        if (isReso == "false" || isReso == "False") {
                            $("h3#page-title").html(label_BookIn);
                        }
                        else {
                            $("h3#page-title").html(label_Reservation);
                        }

                        event.preventDefault();
                    });


                    //***************************************************************************
                    //*
                    //*   Allows the control panels client search control to be initiated with
                    //*   the return key.
                    //*
                    //****************************************************************************
                    $(document).keypress(function (e) {

                        if (e.which == 13 && $("#search-box:focus").length > 0)
                            $(".searchButton").trigger("click");
                    });


                    //***************************************************************************
                    //*
                    //*   This click event initiates the service call to move a client to another
                    //*   bed
                    //*
                    //****************************************************************************
                    $(document).on("click", "#modalYesButton", function () {

                        $.ajax({

                            url: URL_Admission_ChangeClientBed,
                            type: "GET",
                            data: {
                                id: selectedBookedInClient.attr("data-stay"),
                                room: selectedBookedInClient.parents().parents().parents().attr("data-room-id"),
                                bed: selectedBookedInClient.parents().parents().attr("data-bed-id")
                            },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false); // calling this function displays the current admission details in the graphical view
                            selectedBookedInClient = null;
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $("#bookedInTable").DataTable().ajax.reload();
                            $("#reservationsTable").DataTable().ajax.reload();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   This click event closes any open modal. This acts like a cancel button.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".modalCloseButton", function () {

                        // calling this function displays the current admission details in the graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);
                        selectedBookedInClient = null;
                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This click event will trigger a click event for the required bed view
                    //*   button which will reload the data for the current beds.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#refresh-beds", function () {

                        if ($(selectedToolBarBtn).attr("id") === "smallViewBtn")
                            $(".smallTileButton").trigger("click");
                        else
                            $(".largeTileButton").trigger("click");
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on an available bed which will select this bed for the new
                    //*   admission. First off, it checks if there is a selected booked in client,
                    //*   in which case it means the user is trying to move a booked in client to
                    //*   this bed rather than be part of a new admission. Secondly, it checks if
                    //*   the event target is an existing client within the bed, in which case the
                    //*   event stops and only fires an event on the client button. In any other
                    //*   case, the event is fired and the selected client is moved to this bed as
                    //*   part of a new admission process.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .activeBed", function (event) {

                        // if an already booked in client is selected
                        if (!$(event.target).is(".clientButton_booked")) {

                            if (selectedBookedInClient != null) {

                                $(this).children(".bedContent").html(selectedBookedInClient); // display client within bed

                                // if the user is in the small icons view then hide the client buttons
                                if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                    $(".bedContent").children().hide();

                                // show the confirm move modal to confirm whether the user wants to move the client or not
                                $("#move-confirm").show();

                            } else if ($(".clientButton").length > 0) {

                                if (selectedClient == null) // if a client is not selected then the event selects the first matching element.
                                    selectedClient = $(".clientButton").first();

                                // check if this client is within a requested bed and reset the bed so it is available
                                var requestedBed = selectedClient.parents().parents(".requested-bed");     // get the selected client's currently selected bed
                                if (requestedBed.length > 0) {                                             //
                                    HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover(requestedBed);                                 // remove existing popover details for a processing request
                                    requestedBed.removeClass("requested-bed").addClass("activeBed");       // reset the bed back to an active bed
                                }

                                // we can now write the client div to this new .activeBed element
                                $(this).children(".bedContent").html(selectedClient);

                                // if the user is in the small icon view then hide the client button
                                if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                    $(".bedContent").children().hide();

                                // append info to the popover display
                                var content = $(this).attr("data-content");
                                content += "<p class='process'><strong>" + label_Processing + "</strong>&nbsp&nbsp" + selectedClient.text().trim() + "</p>";
                                $(this).attr("data-content", content);

                                // change background color and selection types of bedButtons for all of the beds that contain a client admission request
                                $(this).addClass("requested-bed").removeClass("activeBed");

                                // within an if in case a null value exists
                                if (selectedClient.length > 0) {
                                    selectedClient.removeClass("selected-client"); // reset
                                    displayNotification('info', '', "<p>" + selectedClient.text().trim() + "</p>");
                                }

                                selectedClient = null;
                            }
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a requested bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .requested-bed", function (event) {

                        // stops the event if click is on a client button within an active bed
                        if (!$(event.target).is(".clientButton_booked")) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover($(this));

                            var clientButton = $(this).children().children(".clientButton");
                            $("#clientToolBar").append(clientButton);
                            clientButton.show();

                            if (selectedClient != null) {
                                selectedClient.removeClass("selected-client");
                            }

                            $(this).removeClass("requested-bed").addClass("activeBed");
                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is part of a new admission.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton", function (event) {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is already booked in. This allows the user
                    //*   to move the client to another bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton_booked", function (event) {

                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");

                        if ($(this).is(".selected-booked")) {

                            $(this).removeClass("selected-booked");
                            selectedBookedInClient = null;
                        }
                        else {

                            selectedBookedInClient = $(this);
                            $(".clientButton_booked").removeClass("selected-booked");
                            $(this).addClass("selected-booked");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on the client toolbar that is delegated to the clientButton.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#toolbar .clientButton", function (event) {

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Select event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(document).on("select2:select", "#ClientIDs", function (e) {


                        if ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False") {

                            //console.log("3963: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(e.params.data.id, e.params.data.text);
                        }
                        else if ($(".clientButton[data-clientid='" + e.params.data.id + "']").length == 0) {

                            var htmlString = '<div class="clientButton btn btn-primary" data-clientid="' + e.params.data.id + '">';
                            htmlString += '<span class="glyphicon glyphicon-user"></span>&nbsp&nbsp' + e.params.data.text + '</div>';

                            $("#clientToolBar").append(htmlString);
                        }
                        else { }
                    });


                    //***************************************************************************
                    //*
                    //*   Unselect event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(document).on("select2:unselect", "#ClientIDs", function (e) {

                        var clientObject = $(".clientButton[data-clientid='" + e.params.data.id + "']");
                        clientObject.parent().parent(".bedButton").removeClass("requested-bed");
                        clientObject.remove();
                        $("#ClientIDs option[value='" + e.params.data.id + "']").remove();

                        if ($(clientIDs).val() != null && $(clientIDs).val().length == 1) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck($(clientIDs).val().toString());
                        }
                        else {

                            $("#familyBtn").addClass("hide");

                            if ($(clientIDs).val() == null) {

                                $("#ClientIDs > option").remove();
                            }
                        }
                    });

                    //***************************************************************************
                    //*
                    //*   Selects family for a book in by placing them as selected options in the
                    //*   multi-select control for client ids.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#familyBtn", function () {

                        $("#ClientIDs > option").remove();
                        $(clientIDs).val("").trigger("change");
                        $("#clientToolBar").html("");

                        // add clients to the options list
                        for (var key in family) {

                            if (family.hasOwnProperty(key)) {

                                $(clientIDs).append($("<option>", { value: key, text: family[key] }));
                                $("select#ClientIDs option[value='" + key + "']").prop("selected", true).parent().trigger("change");
                            }
                        }

                        // check if clients are already booked in
                        $(clientIDs).children("option").each(function () {

                            //console.log("4029: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                        });
                    });


                    //***************************************************************************
                    //*
                    //*   Get stay details to display to the user.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#tablesView .display-btn", function () {

                        var displayModal = $("#display-stay");
                        var id = $(this).attr("data-id");
                        var client = $(this).attr("data-client");

                        $("#printBtn").attr("href", URL_Admission_Details + id); // sets the print url to the right stay id
                        $("#clientAddmissionsBtn").attr("href", URL_Admission_ClientAdmissions + client); // sets the client url to the right client id
                        displayModal.find(".modal-body").html($("#loader-div").removeClass("hide"));
                        displayModal.show();

                        $.ajax({

                            url: URL_Admission_DisplayBookedInStay,
                            type: "GET",
                            data: { "id": id }

                        }).done(function (data) {

                            displayModal.find(".modal-body").html($("#loader-div"));
                            displayModal.find(".modal-body").append(data.Result);
                            $("#loader-div").addClass("hide");

                        }).fail(function () {

                            //console.log("3934: label_GetStayInformation: " + label_GetStayInformation);
                            alert(label_GetStayInformation);
                            displayModal.hide();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   When a user clicks on the print button within the display modal we want
                    //*   to open the display in a new tab but also close the modal for smoother
                    //*   interaction.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#printBtn", function () {

                        $(".modal").hide();
                    });


                    // brings you to the graphical view to manage booked in clients
                    $(document).on("click", "#tablesView .manage-btn", function () {

                        if (session_BedDisplayExpanded == "False") {

                            $(".largeTileButton").trigger("click");
                        }
                        else {

                            $(".smallTileButton").trigger("click");
                        }

                        $("#book-in-controls").hide();
                        $("#backBtn").show();
                        $("#IsReservation").val("false");
                        $("#search-box").trigger("focus");

                        $("h3#page-title").html(label_ManageRoomsBeds);
                    });

                    // displays the modal to confirm deletion of a reservation
                    $(document).on("click", "#tablesView .deleteButton", function (event) {

                        $("#delete-confirm").show();
                        deleteID = $(this).attr("data-stayid");
                        event.preventDefault();
                    });


                    // refresh the bed availability table
                    $(document).on("click", "#tablesView #refresh-stats", function () {

                        $("#availabilityTable").DataTable().ajax.reload();
                    });


                    $(document).on("wb-updated.wb-tabs", ".wb-tabs", function (event, $newPanel) {

                        $('#GeoRegionID').select2();
                    });


                    // removes a reservation from the list
                    $(document).on("click", "#modalDeleteButton", function () {

                        $.ajax({

                            url: URL_Admission_DeleteReservation,
                            type: "GET",
                            data: { "id": deleteID },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);
                            $("#reservationsTable").DataTable().ajax.reload();
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $(".bedContent").removeClass("glyphicon-flag").removeClass("glyphicon-exclamation-sign").addClass("glyphicon-bed");

                        });
                    });


                    // goes back to the tables view from the manage rooms and beds view
                    $(document).on("click", "#backBtn", function () {

                        $("#tablesView").fadeIn(800);
                        $("#bedsView").fadeOut(300);

                        selectedBookedInClient = null; // reset, if any, selected clients that are booked in.

                        $("#bookedInTable").DataTable().ajax.reload();
                        $("#reservationsTable").DataTable().ajax.reload();

                        $("h3#page-title").html(label_Admissions);
                    });


                    // displays the graphical view as small icons
                    $(document).on("click", ".smallTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);

                        $(".bedContent").children().hide(); // since this is the small icon view then hide the content so it does not overflow
                        selectedToolBarBtn = $(this);

                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        var lastRoom = $("div.body").children(".row").last().children(".room");
                        if (lastRoom.length != 1)
                            $(".room").removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        else
                            $(".room").not(lastRoom).removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        $(".bed").css("width", "35px").css("height", "30px");

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    // displays the graphical view as large icons
                    $(document).on("click", ".largeTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                        $(".clientButton").show();
                        selectedToolBarBtn = $(this);

                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        $(".room").addClass("col-md-12").addClass("col-lg-12").addClass("col-sm-12").addClass("col-xs-12");
                        $(".bed").css("width", "157px").css("height", "90px");//.removeClass("noText")

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });

                    //***************************************************************************
                    //*
                    //*   Booking control panel.
                    //*
                    //****************************************************************************
                    $(".bookinControlPanel").on({

                        mouseenter: function () {

                            if ($(this).is(".closed")) {
                                $(this).stop(true, true).animate({ left: "+=250px" }, 500).removeClass("closed").addClass("open");
                            }
                        },
                        mouseleave: function () {

                            if ($(this).is(".open")) {
                                $(this).stop(true, true).animate({ left: "-=250px" }, 500).removeClass("open").addClass("closed");
                            }
                        }
                    });

                    $(document).on("change", "#chk-OccupiedBeds", function () {

                        if ($(this).is(":checked")) {
                            $(".booked-bed").not(".legend").show();
                        }
                        else {
                            $(".booked-bed").not(".legend").hide();
                        }
                    });

                    $(document).on("change", "#chk-UnoccupiedBeds", function () {

                        if ($(this).is(":checked")) {
                            $(".activeBed").not(".legend").show();
                        }
                        else {
                            $(".activeBed").not(".legend").hide();
                        }
                    });

                    $(document).on("change", "#chk-overflowBeds", function () {

                        if ($(this).is(":checked")) {
                            $(".overflowBed").not(".legend").show();
                        }
                        else {
                            $(".overflowBed").not(".legend").hide();
                        }
                    });

                    $(document).on("change", "#chk-InactiveBeds", function () {

                        if ($(this).is(":checked")) {
                            $(".inactiveBed").not(".legend").show();
                        }
                        else {
                            $(".inactiveBed").not(".legend").hide();
                        }
                    });

                    $(document).on("change", "#chk-OccupiedRooms", function () {

                        var availableRooms = $(".activeBed").parents(".room");
                        if ($(this).is(":checked")) {
                            $(".room").not(".legend").not(availableRooms).show();
                        }
                        else {
                            $(".room").not(".legend").not(availableRooms).hide();
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   This function searches the text of client buttons for matching search
                    //*   query.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".searchButton", function () {

                        $(".selected-booked").removeClass("selected-booked");
                        var array = $(".clientButton_booked");
                        var q = $("#search-box").val().toLowerCase();

                        array.slice(index).each(function () {

                            var text = $(this).attr("data-label").toLowerCase();

                            if (text.search(q) >= 0) {

                                client = $(this);

                                $('html, body').stop(true, true).animate({
                                    scrollTop: client.parent().parent().parent(".room").offset().top
                                }, 1000);

                                flag = true;
                                index = ++index % array.length;
                                client.trigger("click");//.addClass("selected-booked");

                                return false;
                            }

                            index = ++index % array.length;
                        });
                    });


                    //MPT - 654495 - Make sure the dropdown is set to the appropriate Select2 behaviour with the AllowClear when visible
                    $(document).on('wb-updated.wb-tabs', '#tablesView', function () {

                        //init_hifis will set up the appropriate style, but need to be trigger once the tab is visible to update the dropdown style and config
                        init_hifis();
                    });

                }

            }, // END OnReady

        }, // END ApplyOnLoad


        //****************************************************************************************************************
        //*   IndexView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {

            // MP - Move getCurrentAdmissionDetails() to HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails()

            // MP - Move appendClientDivsToBeds() to HIFIS_Admissions.SharedFunction.Utility_Functions.appendClientDivsToBeds()
            
            // MP - Move createPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover()
            
            // MP - Move unifyDivHeights() to HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights()
            
            // MP - Move moveToolBar() to HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar()
            
            // MP - Move removeProcessingPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover()
            
            // MP - Move clientFamilyCheck() to HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck()
           
            // MP - Move getShelterInfo() to HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo()
            

            clientStateValidation: function (event, clientStateId) {

                //var archivedInt = archivedInt;
                //var deceasedInt = deceasedInt;

                if (clientStateId == archivedInt || clientStateId == deceasedInt) {

                    displayNotification('alert', '', "<p>" + BookInWithWrongStatusMsg + "</p>");
                    event.preventDefault();

                    if (event.stopPropagation) {

                        event.stopPropagation();
                    }
                    else if (window.event) {

                        window.event.cancelBubble = true;
                    }
                    return false; // cancel the event
                }
            },


        }, // END Utility_Functions


    }, // END IndexView

    NewReservationView: {

        ApplyOnLoad: {

            OnReady: function () {

                if (ValidatePath('Admissions')) {

                    if ($("#ClientIDs") != null && $("#ClientIDs") != undefined) {

                        clientIDs = $("#ClientIDs");
                    }

                    $(function () {


                        //$(clientIDs).on('select2:select', function (e) {
                        //
                        //    if ($("#ClientIDs").val() != null) {
                        //
                        //        //console.log("4265: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                        //        HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(e.params.data.id, e.params.data.text);
                        //    }
                        //});

                        $(".cd-top").hide();
                        var clients = clients;

                        // IF THERE ARE PRE-POPULATED CLIENTS IN THE VIEWMODEL
                        if (clients != "") {

                            // display index pages form
                            $("#admissionFormDiv").fadeIn(800);
                            $("#tablesView").fadeOut(300);
                            $("#bedsView").fadeOut(300);

                            // IF INTAKE IS NOT A RESERVATION
                            if ($("#IsReservation").val() === "False" || $("#IsReservation").val() === "false") {

                                $(clientIDs).children("option").each(function () {

                                    //console.log("4429: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                                    HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                                });

                                // get the current admission details which will prevent the use of a booked in bed
                                HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                                $("h3#page-title").html(label_NewBookIn);

                            }
                            else {

                                // hide unused form controls
                                $("#wake").hide();
                                $("#intox").hide();
                                $("#latePass").hide();

                                if ($("#StayID").val() === "") {

                                    // append client object buttons to the toolbar
                                    $(clientIDs).children("option").each(function () {

                                        var htmlString = "<div class='clientButton btn btn-primary' data-clientid='" + $(this).attr("value") + "'>";
                                        htmlString += "<span class='glyphicon glyphicon-user'></span>&nbsp&nbsp" + $(this).text().trim() + "</div>";

                                        $("#clientToolBar").append(htmlString);
                                    });
                                }

                                if ($("#IsReservation").val() === "True" || $("#IsReservation").val() === "true") {

                                    $("h3#page-title").html(label_viewTitle_EditReservation);
                                }
                                else {

                                    $("h3#page-title").html(label_NewReservation);
                                }
                            }

                            //$("#ClientIDs").attr("disabled", true);

                        }
                        else {

                            // display index page normally
                            $("#bedsView").fadeOut(300);
                            $("#admissionFormDiv").fadeIn(800);

                        }// END IF


                        // Filter Bed Availability list
                        $(document).on("change", "#details-panel3 #GeoRegionID", function () {

                            var table = $('#availabilityTable').DataTable();
                            table.ajax.url(URL_Admission_SheltersAdmissionsStatsJson + $('#GeoRegionID').val()).load();
                        });


                        // find all client object buttons within an active bed to change display
                        if ($(".clientButton").parent().parent(".activeBed").attr("data-reset") === "booked") {

                            $(".clientButton").parent().parent(".activeBed").addClass("requested-bed").removeClass(".activeBed").removeClass(".booked-bed-res");
                        }
                        else {

                            $(".clientButton").parent().parent(".activeBed").addClass("requested-bed").removeClass(".activeBed");

                        }


                        // initialize the popover display of the beds
                        $(".bedButton").popover({

                            html: true,
                            container: "body",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });

                        // Modals
                        //$(".modal").hide().css("display", "normal");


                        // window scroll check
                        $(window).scroll(function () {

                            if ($(this).scrollTop() > 100 && !$("#admissionFormDiv").is(":visible") && !$("#tablesView").is(":visible")) {

                                $(".cd-top").fadeIn();
                            }
                            else {

                                $(".cd-top").fadeOut();
                            }
                        });


                        //Click event to scroll to top
                        $(document).on("click", ".cd-top", function () {

                            $("html, body").animate({ scrollTop: 0 }, 800);
                            return false;
                        });

                        // call function to fix toolbar when scrolling
                        HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar();

                    }); // END ON READY FUNCTION


                    $(document).on("wb-ready.wb", function (event) {
                        // Show page!
                        //$("#container").show();

                    });


                    $(document).on("wb-ready.wb-tables", ".wb-tables", function (event) {

                        $("#loader-div").addClass("hide").css({ "margin-left": "250px", "margin-top": "100px" });
                        $("#container").css('margin-left', '');
                    });


                    //***************************************************************************
                    //*
                    //*   Draw event for the DataTables plugin. Since the tables data loads after
                    //*   the JavaScript loads, the buttons within the tables need to be initia-
                    //*   lized here.
                    //*
                    //****************************************************************************
                    $(document).on("wb-updated.wb-tables", ".wb-tables", function (event, settings) {

                        initButtons();
                        var currentOrg = session_currentOrg;

                        for (var i = 0; i < $("#availabilityTable > tbody > tr > td").length; i += 4) {

                            var element = $("#availabilityTable > tbody > tr > td").eq(i);
                            if (element.text() === currentOrg) {

                                element.parent("tr").css("font-weight", "bolder");
                            }
                        }

                        $(".info-pop").popover({

                            html: true,
                            container: "body",
                            content: function () {
                                return HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo($(this).attr("data-id"));
                            },
                            placement: "left",
                            trigger: "focus",
                            template: "<div class=\"popover styled\"><div class=\"arrow styled\"></div><div class=\"popover-inner styled\"><h3 class=\"popover-title styled\"></h3><div class=\"popover-content styled\"><p></p></div></div></div>",
                        });;
                    });

                    //***************************************************************************
                    //*
                    //*   Submit event for the intake form. This event triggers when the user
                    //*   clicks the next button of the admissions form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#showBedsButton", function (event) {
                     if ($("#admissionsForm").valid() && $("#ClientIDs").val() != null && $("#ReservationDateStart").val() != null) {

                            if (session_BedDisplayExpanded == "False") {

                                $(".smallTileButton").trigger("click");
                            }
                            else {

                                $(".largeTileButton").trigger("click");
                            }
                        }

                        $("#book-in-controls").show();
                        $("#backBtn").hide();

                        if ($("#admissionsForm").valid()) {

                            var isReso = $("#IsReservation").val();

                            if (isReso == "false" || isReso == "False") {

                                $("h3#page-title").html(label_BookIn);
                            }
                            else {

                                $("h3#page-title").html(label_Reservation);
                            }
                        }
                       // event.preventDefault();
                    });


                    //***************************************************************************
                    //*
                    //*   Click event which posts the admission details to be inserted into the
                    //*   database. This page displays after the above submit event which validates
                    //*   the form.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#confirmBtn", function () {

                        HIFIS_Admissions.SharedFunction.Utility_Functions.saveClientsInBeds(URL_Admission_Reservations);                        
                    });


                    //***************************************************************************
                    //*
                    //*   Allows the control panels client search control to be initiated with
                    //*   the return key.
                    //*
                    //****************************************************************************
                    $(document).keypress(function (e) {

                        if (e.which == 13 && $("#search-box:focus").length > 0) {

                            $(".searchButton").trigger("click");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   This click event initiates the service call to move a client to another
                    //*   bed
                    //*
                    //****************************************************************************
                    $(document).on("click", "#modalYesButton", function () {

                        $.ajax({

                            url: URL_Admission_ChangeClientBed,
                            type: "GET",
                            data: {
                                id: selectedBookedInClient.attr("data-stay"),
                                room: selectedBookedInClient.parents().parents().parents().attr("data-room-id"),
                                bed: selectedBookedInClient.parents().parents().attr("data-bed-id")
                            },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false); // calling this function displays the current admission details in the graphical view
                            selectedBookedInClient = null;
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            //$("#bookedInTable").DataTable().ajax.reload();
                            //$("#reservationsTable").DataTable().ajax.reload();

                        });

                    });


                    //***************************************************************************
                    //*
                    //*   This click event closes any open modal. This acts like a cancel button.
                    //*
                    //****************************************************************************
                    $(document).on("click", ".modalCloseButton", function () {

                        // calling this function displays the current admission details in the graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);
                        selectedBookedInClient = null;
                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This click event will trigger a click event for the required bed view
                    //*   button which will reload the data for the current beds.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#refresh-beds", function () {

                        if ($(selectedToolBarBtn).attr("id") === "smallViewBtn") {
                            $(".smallTileButton").trigger("click");
                        }
                        else {
                            $(".largeTileButton").trigger("click");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on an available bed which will select this bed for the new
                    //*   admission. First off, it checks if there is a selected booked in client,
                    //*   in which case it means the user is trying to move a booked in client to
                    //*   this bed rather than be part of a new admission. Secondly, it checks if
                    //*   the event target is an existing client within the bed, in which case the
                    //*   event stops and only fires an event on the client button. In any other
                    //*   case, the event is fired and the selected client is moved to this bed as
                    //*   part of a new admission process.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .activeBed", function (event) {

                        // if an already booked in client is selected
                        if (selectedBookedInClient != null) {

                            $(this).children(".bedContent").html(selectedBookedInClient); // display client within bed

                            // if the user is in the small icons view then hide the client buttons
                            if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                $(".bedContent").children().hide();

                            // show the confirm move modal to confirm whether the user wants to move the client or not
                            $("#move-confirm").show();

                        }
                        else if ($(".clientButton").length > 0) {

                            if (selectedClient == null) {// if a client is not selected then the event selects the first matching element.
                                selectedClient = $(".clientButton").first();
                            }

                            // check if this client is within a requested bed and reset the bed so it is available
                            var requestedBed = selectedClient.parents().parents(".requested-bed");     // get the selected client's currently selected bed
                            if (requestedBed.length > 0) {
                                
                                HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover(requestedBed);                                 // remove existing popover details for a processing request
                                if (requestedBed.attr("data-reset") === "booked") {

                                    requestedBed.removeClass("requested-bed").addClass("activeBed").addClass("booked-bed-res");       // reset the bed back to an active bed
                                }
                                else {

                                    requestedBed.removeClass("requested-bed").addClass("activeBed");       // reset the bed back to an active bed
                                }
                            }

                            // we can now write the client div to this new .activeBed element
                            $(this).children(".bedContent").html(selectedClient);

                            // if the user is in the small icon view then hide the client button
                            if (selectedToolBarBtn.attr("id") == "smallViewBtn")
                                $(".bedContent").children().hide();

                            // append info to the popover display
                            var content = $(this).attr("data-content");
                            content += "<p class='process'><strong>" + label_Processing + "</strong>&nbsp&nbsp" + selectedClient.text().trim() + "</p>"
                            $(this).attr("data-content", content);

                            // change background color and selection types of bedButtons for all of the beds that contain a client admission request
                            if ($(this).attr("data-reset") === "booked") {

                                $(this).addClass("requested-bed").removeClass("activeBed").removeClass("booked-bed-res");
                            }
                            else {

                                $(this).addClass("requested-bed").removeClass("activeBed");
                            }

                            // within an if in case a null value exists
                            if (selectedClient.length > 0) {

                                selectedClient.removeClass("selected-client"); // reset
                                displayNotification('info', '', "<p>" + selectedClient.text().trim() + "</p>");
                            }

                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a requested bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .requested-bed", function (event) {

                        // stops the event if click is on a client button within an active bed
                        if (!$(event.target).is(".clientButton")) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover($(this));

                            var clientButton = $(this).children().children(".clientButton");
                            $("#clientToolBar").append(clientButton);
                            clientButton.show();

                            if (selectedClient != null) {

                                selectedClient.removeClass("selected-client");
                            }

                            if ($(this).attr("data-reset") === "booked") {

                                $(this).removeClass("requested-bed").addClass("activeBed").addClass("booked-bed-res");
                            }
                            else {

                                $(this).removeClass("requested-bed").addClass("activeBed");
                            }

                            selectedClient = null;
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is part of a new admission.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton", function (event) {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on a client that is already booked in. This allows the user
                    //*   to move the client to another bed.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#bedsView .clientButton_booked", function (event) {

                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");

                        if ($(this).is(".selected-booked")) {

                            $(this).removeClass("selected-booked");
                            selectedBookedInClient = null;
                        }
                        else {

                            selectedBookedInClient = $(this);
                            $(".clientButton_booked").removeClass("selected-booked");
                            $(this).addClass("selected-booked");
                        }
                    });


                    //***************************************************************************
                    //*
                    //*   Click event on the client toolbar that is delegated to the clientButton.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#toolbar .clientButton", function (event) {

                        if ($(this).is(".selected-client")) {

                            $(this).removeClass("selected-client");
                            selectedClient = null;
                        }
                        else {

                            selectedClient = $(this);
                            $(".clientButton").removeClass("selected-client");
                            $(this).addClass("selected-client");
                        }
                    });

                    //***************************************************************************
                    //*
                    //*   Select event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(clientIDs).on("select2:select", function (e) {

                        if ($("#IsReservation").val() == "false" || $("#IsReservation").val() == "False") {

                            //console.log("5018: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(e.params.data.id, e.params.data.text);
                        }
                        else if ($(".clientButton[data-clientid='" + e.params.data.id + "']").length == 0) {

                            var htmlString = "<div class='clientButton btn btn-primary' data-clientid='" + e.params.data.id + "'>";
                            htmlString += "<span class='glyphicon glyphicon-user'></span>&nbsp&nbsp" + e.params.data.text + "</div>";

                            $("#clientToolBar").append(htmlString);
                        }
                        else { }

                    });


                    //***************************************************************************
                    //*
                    //*   Unselect event on the client IDs multi-select/auto-complete control.
                    //*
                    //****************************************************************************
                    $(clientIDs).on("select2:unselect", function (e) {

                        var clientObject = $(".clientButton[data-clientid='" + e.params.data.id + "']");
                        clientObject.parent().parent(".bedButton").removeClass("requested-bed");
                        clientObject.remove();
                        $("#ClientIDs option[value='" + e.params.data.id + "']").remove();

                        if ($(clientIDs).val() != null && $(clientIDs).val().length == 1) {

                            HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck($(clientIDs).val().toString());
                        }
                        else {

                            $("#familyBtn").addClass("hide");

                            if ($(clientIDs).val() == null) {

                                $("#ClientIDs > option").remove();
                            }
                        }

                    });


                    //***************************************************************************
                    //*
                    //*   Selects family for a book in by placing them as selected options in the
                    //*   multi-select control for client ids.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#familyBtn", function () {

                        $("#ClientIDs > option").remove();
                        $(clientIDs).val("").trigger("change");
                        $("#clientToolBar").html("");
                        // add clients to the options list

                        for (var key in family) {

                            if (family.hasOwnProperty(key)) {

                                $(clientIDs).append($("<option>", { value: key, text: family[key] }));
                                $("select#ClientIDs option[value='" + key + "']").prop("selected", true).parent().trigger("change");
                            }
                        }

                        // check if clients are already booked in
                        $(clientIDs).children("option").each(function () {

                            //console.log("5087: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
                            HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn($(this).attr("value"), $(this).text().trim());
                        });
                    });


                    //***************************************************************************
                    //*
                    //*   Get stay details to display to the user.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#tablesView .display-btn", function () {

                        var displayModal = $("#display-stay");
                        var id = $(this).attr("data-id");
                        var client = $(this).attr("data-client");

                        $("#printBtn").attr("href", URL_Admission_Details + id); // sets the print url to the right stay id
                        $("#clientAddmissionsBtn").attr("href", URL_Admission_ClientAdmissions + client); // sets the client url to the right client id

                        displayModal.find(".modal-body").html($("#loader-div").removeClass("hide"));
                        displayModal.show();

                        $.ajax({

                            url: URL_Admission_DisplayBookedInStay,
                            type: "GET",
                            data: { "id": id },

                        }).done(function (data) {

                            displayModal.find(".modal-body").html($("#loader-div"));
                            displayModal.find(".modal-body").append(data.Result);
                            $("#loader-div").addClass("hide");

                        }).fail(function () {

                            //console.log("4977: label_GetStayInformation: " + label_GetStayInformation);
                            alert(label_GetStayInformation);
                            displayModal.hide();
                        });

                    });


                    //***************************************************************************
                    //*
                    //*   When a user clicks on the print button within the display modal we want
                    //*   to open the display in a new tab but also close the modal for smoother
                    //*   interaction.
                    //*
                    //****************************************************************************
                    $(document).on("click", "#printBtn", function () {

                        $(".modal").hide();
                    });


                    //***************************************************************************
                    //*
                    //*   Display state events.
                    //*
                    //****************************************************************************
                    // starts a new book-in
                    $(document).on("click", "#tablesView #book-in-btn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(false);

                        $("h3#page-title").html(label_NewBookIn);
                    });


                    // starts a new reservation
                    $(document).on("click", "#tablesView #reserve-btn", function () {

                        $("#ClientIDs").attr("disabled", false);

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm(true);

                        $("h3#page-title").html(label_NewReservation);
                    });


                    // brings you to the graphical view to manage booked in clients
                    $(document).on("click", "#tablesView .manage-btn", function () {

                        if (session_BedDisplayExpanded == "False") {

                            $(".largeTileButton").trigger("click");
                        }
                        else {

                            $(".smallTileButton").trigger("click");
                        }

                        $("#book-in-controls").hide();
                        $("#backBtn").show();
                        $("#IsReservation").val("false");
                        $("#search-box").trigger("focus");

                        $("h3#page-title").html(label_ManageRoomsBeds);
                    });


                    // displays the modal to confirm deletion of a reservation
                    $(document).on("click", "#tablesView .deleteButton", function (event) {

                        $("#delete-confirm").show();
                        deleteID = $(this).attr("data-stayid");
                        event.preventDefault();
                    });


                    // refresh the bed availability table
                    $(document).on("click", "#tablesView #refresh-stats", function () {

                        $("#availabilityTable").DataTable().ajax.reload();
                    });


                    $(document).on("wb-updated.wb-tabs", ".wb-tabs", function (event, $newPanel) {

                        $('#GeoRegionID').select2();
                    });


                    // removes a reservation from the list
                    $(document).on("click", "#modalDeleteButton", function () {

                        $.ajax({

                            url: URL_Admission_DeleteReservation,
                            type: "GET",
                            data: { "id": deleteID },

                        }).done(function (data) {

                            $(".modal").hide();
                            HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);
                            $("#reservationsTable").DataTable().ajax.reload();
                            displayNotification('success', '', "<p>" + label_DefaultDataSavedMessage + "</p>");
                            $(".bedContent").removeClass("glyphicon-flag").removeClass("glyphicon-exclamation-sign").addClass("glyphicon-bed");
                        });
                    });


                    // goes back to the admission form from the manage rooms and beds view
                    $(document).on("click", "#backToFormBtn", function () {

                        $("#admissionFormDiv").fadeIn(800);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        var isReso = $("#IsReservation").val();
                        if (isReso == "false" || isReso == "False") {

                            $("h3#page-title").html(label_NewBookIn);
                        }
                        else {

                            $("h3#page-title").html(label_NewReservation);
                        }
                    });


                    // goes back to the tables view from the manage rooms and beds view
                    $(document).on("click", "#backBtn", function () {

                        $("#tablesView").fadeIn(800);
                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeOut(300);

                        selectedBookedInClient = null; // reset, if any, selected clients that are booked in.

                        $("#bookedInTable").DataTable().ajax.reload();
                        $("#reservationsTable").DataTable().ajax.reload();

                        $("h3#page-title").html(label_Admissions);
                    });


                    // displays the graphical view as small icons
                    $(document).on("click", ".smallTileButton", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(true, false);

                        $(".bedContent").children().hide(); // since this is the small icon view then hide the content so it does not overflow
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        var lastRoom = $("div.body").children(".row").last().children(".room");
                        if (lastRoom.length != 1) {
                            $(".room").removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        }
                        else {
                            $(".room").not(lastRoom).removeClass("col-xs-12").removeClass("col-sm-12").removeClass("col-md-12").removeClass("col-lg-12");
                        }
                        $(".bed").css("width", "35px").css("height", "30px");

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    // displays the graphical view as large icons
                    $(".largeTileButton").on("click", function () {

                        selectedBookedInClient = null;
                        $(".selected-booked").removeClass("selected-booked");
                        selectedClient = null;
                        $(".selected-client").removeClass("selected-client");
                        $("div.body").hide(); // hides the content of the entire graphical view
                        HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails(false, false);

                        $(".clientButton").show();
                        selectedToolBarBtn = $(this);

                        $("#admissionFormDiv").fadeOut(300);
                        $("#tablesView").fadeOut(300);
                        $("#bedsView").fadeIn(800);

                        $(".room").addClass("col-md-12").addClass("col-lg-12").addClass("col-sm-12").addClass("col-xs-12");
                        $(".bed").css("width", "157px").css("height", "90px");//.removeClass("noText")

                        HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights();
                    });


                    //***************************************************************************
                    //*
                    //*   Booking control panel.
                    //*
                    //****************************************************************************
                    $(".bookinControlPanel").on({
                        mouseenter: function () {
                            if ($(this).is(".closed"))
                                $(this).stop(true, true).animate({ left: "+=250px" }, 500).removeClass("closed").addClass("open");
                        },
                        mouseleave: function () {
                            if ($(this).is(".open"))
                                $(this).stop(true, true).animate({ left: "-=250px" }, 500).removeClass("open").addClass("closed");
                        }
                    });

                    $(document).on("change", "#chk-OccupiedBeds", function () {
                        if ($(this).is(":checked"))
                            $(".booked-bed-res").not(".legend").show();
                        else
                            $(".booked-bed-res").not(".legend").hide();
                    });

                    $(document).on("change", "#chk-UnoccupiedBeds", function () {
                        if ($(this).is(":checked"))
                            $(".activeBed").not(".legend").show();
                        else
                            $(".activeBed").not(".legend").hide();
                    });

                    $(document).on("change", "#chk-overflowBeds", function () {
                        if ($(this).is(":checked"))
                            $(".overflowBed").not(".legend").show();
                        else
                            $(".overflowBed").not(".legend").hide();
                    });

                    $(document).on("change", "#chk-InactiveBeds", function () {
                        if ($(this).is(":checked"))
                            $(".inactiveBed").not(".legend").show();
                        else
                            $(".inactiveBed").not(".legend").hide();
                    });

                    $(document).on("change", "#chk-OccupiedRooms", function () {
                        var availableRooms = $(".activeBed").parents(".room");
                        if ($(this).is(":checked"))
                            $(".room").not(".legend").not(availableRooms).show();
                        else
                            $(".room").not(".legend").not(availableRooms).hide();
                    });


                    //***************************************************************************
                    //*
                    //*   This function searches the text of client buttons for matching search
                    //*   query.
                    //*
                    //****************************************************************************
                    $(document).on("click",".searchButton", function () {

                        index = 0
                        flag = false;

                        $(".selected-booked").removeClass("selected-booked");

                        var array = $(".clientButton_booked");
                        var q = $("#search-box").val().toLowerCase();

                        array.slice(index).each(function () {

                            var text = $(this).attr("data-label").toLowerCase();
                            if (text.search(q) >= 0) {

                                client = $(this);
                                $('html, body').stop(true, true).animate({

                                    scrollTop: client.parent().parent().parent(".room").offset().top
                                }, 1000);

                                flag = true;
                                index = ++index % array.length;
                                client.trigger("click");//.addClass("selected-booked");
                                return false;
                            }

                            index = ++index % array.length;
                        });
                    });

                }

            }, // END OnReady

        }, // END ApplyOnLoad


        ///****************************************************************************************************************
        //*   NewReservationView -- UTILITY FUNCTIONS
        //****************************************************************************************************************
        Utility_Functions: {


            // MP - Move getCurrentAdmissionDetails() to HIFIS_Admissions.SharedFunction.Utility_Functions.getCurrentAdmissionDetails()
           
            // MP - Move appendClientDivsToBeds() to HIFIS_Admissions.SharedFunction.Utility_Functions.appendClientDivsToBeds()
           
            // MP - Move createPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.createPopover()
           
            // MP - Move unifyDivHeights() to HIFIS_Admissions.SharedFunction.Utility_Functions.unifyDivHeights()
            
            // MP - Move getNewForm() to HIFIS_Admissions.SharedFunction.Utility_Functions.getNewForm()
            
            // MP - Move isClientBookedIn() to HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn()
            
            // MP - Move isServiceRestricted() to HIFIS_Admissions.SharedFunction.Utility_Functions.isServiceRestricted()
            
            // MP - Move moveToolBar() to HIFIS_Admissions.SharedFunction.Utility_Functions.moveToolBar()
            
            // MP - Move removeProcessingPopover() to HIFIS_Admissions.SharedFunction.Utility_Functions.removeProcessingPopover()
            
            // MP - Move clientFamilyCheck() to HIFIS_Admissions.SharedFunction.Utility_Functions.clientFamilyCheck()
            
            // MP - Move getShelterInfo() to HIFIS_Admissions.SharedFunction.Utility_Functions.getShelterInfo()
           

        }, // END Utility_Functions

//        if($("#ClientIDs").val() != null && $("#ReservationDateStart").val() != null && $("#ReasonForServiceID").val() != null) {
//            var id = $('#ClientIDs option:last')[0].value;
//var text = $('#ClientIDs option:last')[0].text;
//if ($("#IsReservation").val() == "true" || $("#IsReservation").val() == "True") {

//    //console.log("172: HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn() was call");
//    HIFIS_Admissions.SharedFunction.Utility_Functions.isClientBookedIn(id, text);
//}
//}
                        

    }, // END NewReservationView



});


$(document).on("ready", function () {

    HIFIS_Admissions.Init();

});

