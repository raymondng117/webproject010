var HIFIS_CaseManagement = (HIFIS_CaseManagement ? (function () { alert("HIFIS_CaseManagement already exists.") })() : {

    Init: function () {

        console.log("HIFIS_CaseManagement.js is ready!");

        // MPT - 251794 - Case Sessions expended hours issue


        // ***** Default setup on loading *****

        //Default the Total disabled at the page load (Will be enabled again when Goal are selected)
        $('#ExpendedTime_Total input').attr('disabled', true);

        //Append all section at the start
        HIFIS_CaseManagement.SessionFeature.MultiGoal.SetExpendedTimeSectionPerGoal();



        // ***** Event handling *****

        $(document).on('change', '#ExpendedTime_ChckBox_EquallySplit', function () {

            var sectionToValidate = '';
            //If is not checked, Keep Total section disabled and individual section visible
            if ($('#ExpendedTime_ChckBox_EquallySplit').is(':not(:checked)')) {

                $('#ExpendedTime_Total input').attr('disabled', true);
                $('#ExpendedTime_AddSection').show();

                //Adjust time depending on ChckBox value and time input values
                HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
                //Adjust error display and "Save" enable/disable
                HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_AddSection');
            }
            else {

                $('#ExpendedTime_Total input').attr('disabled', false);
                $('#ExpendedTime_AddSection').hide();

                //Adjust time depending on ChckBox value and time input values
                HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
                //Adjust error display and "Save" enable/disable
                HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_Total');
            }

        });

        $(document).on('change', '#SelectedGoalCaseIDs', function (event, selector, data) {
            
            //Update the hidden list of selection
            $('#GoalSelectedList').val($(this).val());
            HIFIS_CaseManagement.SessionFeature.MultiGoal.RemoveOrAddIndividualExpendedTimeSection();
        });


        // ***** Validation and dynamic adjustement *****

        $(document).on('blur', '#ExpendedTime_AddSection input[id*="Hours_"]', function () {
            HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
            HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_AddSection');
        });

        $(document).on('blur', '#ExpendedTime_AddSection input[id*="Minutes_"]', function () {
            HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
            HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_AddSection');
        });


        $(document).on('blur', '#Hours_Total', function () {
            HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
            HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_Total');
        });

        $(document).on('blur', '#Minutes_Total', function () {
            HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
            HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_Total');
        });



        //******* Saving behavior/handling *******

        $(document).on('click', '#NewMultiGoalMeeting_SaveBtn', function (event) {
            event.preventDefault();
            HIFIS_CaseManagement.SessionFeature.MultiGoal.PromptWarningModalWhenNoExpendedTimeWasEntered();
        });

        $(document).on('click', '#NewMultiGoalMeeting_SaveBtn_Confirm', function (event) {
            $('#NewMultiGoalMeeting').submit();
            //Make sure the modal is close in case the form was not valid on the server side
            $('#NewMultiGoalMeeting_CloseModalBtn').click();

        });


    },

    SessionFeature: {

        MultiGoal: {

            SetExpendedTimeSectionPerGoal: function () {

                var template = $('#ExpendedTimeTemplate').clone();
                //Full list of Goal to add and keep hidden
                var fullOptionGoalList = $('#SelectedGoalCaseIDs option:not([value=""])');
                var hoursInputList = "";
                var minutesInputList = "";


                //Generate the initial section but keep hidden until Goals are selected
                for (var i = 0; i < (fullOptionGoalList.length) ; i++) {

                    //Adjust index of id for that specific section with the encrypted SelectedGoalID
                    var currentTemplate = template.html().replace('{0}', '_' + fullOptionGoalList[i].value);

                    //Add the name of the goal to the title section AND Adjust index of each input to keep id unique
                    currentTemplate = $(currentTemplate).html().replace('{1}', '"' + fullOptionGoalList[i].text + '"')
                        .replaceAll('Hours_{0}', 'Hours_' + fullOptionGoalList[i].value)
                        .replaceAll('Minutes_{0}', 'Minutes_' + fullOptionGoalList[i].value);

                    $('#ExpendedTime_AddSection').append($(currentTemplate));

                    //Set hidden list values to default
                    hoursInputList += '0';
                    minutesInputList += '0';

                    if (i < (fullOptionGoalList.length -1)) {
                        hoursInputList += ',';
                        minutesInputList += ',';
                    }
                }

                $('#HoursInputList').val(hoursInputList);
                $('#MinutesInputList').val(minutesInputList);
            },

            AdjustTotalExpendedTime: function () {

                var totalHours = 0;
                var totalMinutes = 0;
                var hoursInputList = "";
                var minutesInputList = "";

                if ($('#ExpendedTime_ChckBox_EquallySplit').is(':not(:checked)')) {

                    //var totalHours = 0;
                    $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Hours_"]').each(function (index, value) {
                        totalHours += parseInt(value.value);
                    })

                    //var totalMinutes = 0;
                    $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Minutes_"]').each(function (index, value) {
                        totalMinutes += parseInt(value.value);
                    })

                    var timeConvertResult = HIFIS_CaseManagement.TimeFeatures.timeConvert(totalMinutes).split(',');

                    totalHours += parseInt(timeConvertResult[0]);
                    totalMinutes = parseInt(timeConvertResult[1]);

                    $('#Hours_Total').val(totalHours);
                    $('#Minutes_Total').val(totalMinutes);


                    //Update hidden list that will be include in viewModel
                    $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Hours_"]').each(function (index, value) {

                        hoursInputList += value.value;
                        if (index < ($('#ExpendedTime_AddSection input[id*="Hours_"]').length - 1)) {
                            hoursInputList += ',';
                        }
                    });

                    $('#HoursInputList').val(hoursInputList);

                    //Update hidden list that will be include in viewModel
                    $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Minutes_"]').each(function (index, value) {

                        minutesInputList += value.value;
                        if (index < ($('#ExpendedTime_AddSection input[id*="Minutes_"]').length - 1)) {
                            minutesInputList += ',';
                        }
                    });

                    $('#MinutesInputList').val(minutesInputList);
                }
                else {

                    totalHours += parseInt($('#Hours_Total').val());
                    var timeConvertResult = HIFIS_CaseManagement.TimeFeatures.timeConvert($('#Minutes_Total').val()).split(',');

                    totalHours += parseInt(timeConvertResult[0]);
                    totalMinutes = parseInt(timeConvertResult[1]);

                    $('#HoursInputList').val(totalHours);
                    $('#MinutesInputList').val(totalMinutes);
                }

                //If error were display in total section remove them after the convert
                HIFIS_CaseManagement.SessionFeature.MultiGoal.ValidateMinuteAndHourValues('ExpendedTime_Total');

            },

            RemoveOrAddIndividualExpendedTimeSection: function () {

                //List of only selected goal
                var selectedGoalList = $('#SelectedGoalCaseIDs option:selected:not([value=""])');
                //Full list of Goal to add and keep hidden
                var fullOptionGoalList = $('#SelectedGoalCaseIDs option:not([value=""])');

                var selectedGoalListMap = selectedGoalList.each(function () { $(this).val() })
                    .map(function () {
                        return $(this).val();
                    })
                    .get()
                    .join(',');


                var fullOptionGoalListMap = fullOptionGoalList.each(function () { $(this).val() })
                    .map(function () {
                        return $(this).val();
                    })
                    .get()
                    .join(',');


                //Toggle display of each individual section
                if (selectedGoalList.length > 0 && $('#ExpendedTime_ChckBox_EquallySplit').is(':not(:checked)')) {

                    //If is hidden, make it visible
                    $('#ExpendedTime_AddSection').show();

                    for (var i = 0; i < $(fullOptionGoalListMap.split(',')).length; i++) {

                        if (selectedGoalListMap.indexOf($(fullOptionGoalListMap.split(','))[i]) != -1) {
                            $('#ExpendedTime_Goal_' + $(fullOptionGoalListMap.split(','))[i]).attr('hidden', false);
                        }
                        else {
                            $('#ExpendedTime_Goal_' + $(fullOptionGoalListMap.split(','))[i]).attr('hidden', true);
                        }
                    }
                }
                else {

                    //If any individual section are still shown, hide them.
                    if ($('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden)').length > 0) {

                        $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden)').each(function (index, value) {
                            $(value).attr('hidden', true);
                        });
                    }

                    $('#ExpendedTime_AddSection').hide();
                }

                //Update total depending on individual section shown
                HIFIS_CaseManagement.SessionFeature.MultiGoal.AdjustTotalExpendedTime();
            },

            ValidateMinuteAndHourValues: function (sectionId) {

                var hasMinuteError = false;
                var hasHourError = false;
                if (sectionId == 'ExpendedTime_AddSection') {

                    //Check Hours validation for individual section 
                    $('#ExpendedTime_AddSection :not(:hidden) .hourError').each(function (index, value) {

                        //Fetch id of corresponding minutes input
                        var id = $(value).attr('data-valmsg-for');

                        var hourValue = $('#' + id).val();
                        if (hourValue < 0 || hourValue.indexOf('.') >= 0) {

                            hasHourError = true;

                            var message = $('#' + id).attr('data-val-regex');
                            var errorSpanElem = $('<span id="' + id + '-error" class="">' + message + '</span>');

                            //Only append error message if not already existing
                            if ($('#' + id + '-error').length == 0) {

                                $(this).append(errorSpanElem);
                                $(this).addClass('field-validation-error');
                                $(this).removeClass('field-validation-valid');
                            }

                            $('#' + id).addClass('alert-danger');
                        }
                        else {

                            if ($('#' + id + '-error').length > 0) {

                                $('span #' + id + '-error').remove();
                                $(this).removeClass('field-validation-error');
                                $(this).addClass('field-validation-valid');
                            }
                            $('#' + id).removeClass('alert-danger');
                        }

                    }); // end foreach hours


                    //Check Minutes validation for individual section
                    $('#ExpendedTime_AddSection :not(:hidden) .minuteError').each(function (index, value) {

                        //Fetch id of corresponding minutes input
                        var id = $(value).attr('data-valmsg-for');

                        var minuteValue = $('#' + id).val();
                        if ((minuteValue > 60 || minuteValue < 0) || minuteValue.indexOf('.') >= 0) {

                            hasMinuteError = true;

                            var message = $('#' + id).attr('data-val-range');
                            var errorSpanElem = $('<span id="' + id + '-error" class="">' + message + '</span>');

                            //Only append error message if not already existing
                            if ($('#' + id + '-error').length == 0) {

                                $(this).append(errorSpanElem);
                                $(this).addClass('field-validation-error');
                                $(this).removeClass('field-validation-valid');
                            }

                            $('#' + id).addClass('alert-danger');
                        }
                        else {

                            if ($('#' + id + '-error').length > 0) {

                                $('span #' + id + '-error').remove();
                                $(this).removeClass('field-validation-error');
                                $(this).addClass('field-validation-valid');
                            }

                            $('#' + id).removeClass('alert-danger');
                        }

                    }); //end foreach minutes

                }
                else if (sectionId == 'ExpendedTime_Total') {

                    //Validate Hours_Total
                    var hourMessage = $('#Hours_Total').attr('data-val-regex');
                    var hourErrorSpanElem = $('<span id="Hours_Total-error" class="">' + hourMessage + '</span>');

                    var hourValue = $('#Hours_Total').val();
                    if (hourValue < 0 || hourValue.indexOf('.') >= 0) {

                        hasHourError = true;
                        if ($('span #Hours_Total-error').length == 0) {

                            $('span[data-valmsg-for="Hours_Total"]').append(hourErrorSpanElem);
                            $('span[data-valmsg-for="Hours_Total"]').addClass('field-validation-error');
                            $('span[data-valmsg-for="Hours_Total"]').removeClass('field-validation-valid');
                        }

                        $('#Hours_Total').addClass('alert-danger');
                    }
                    else {

                        if($('span #Hours_Total-error').length > 0){

                            $('#Hours_Total-error').remove();
                            $('#Hours_Total').removeClass('field-validation-error');
                            $('#Hours_Total').addClass('field-validation-valid');
                        }

                        $('#Hours_Total').removeClass('alert-danger');
                    }

                    //Validate Minutes_Total
                    var minuteMessage = $('#Minutes_Total').attr('data-val-range');
                    var minuteErrorSpanElem = $('<span id="Minutes_Total-error" class="">' + minuteMessage + '</span>');

                    var minuteValue = $('#Minutes_Total').val();
                    if ((minuteValue > 60 || minuteValue < 0) || minuteValue.indexOf('.') >= 0) {

                        hasMinuteError = true;
                        //If already shown don't add more error
                        if ($('span #Minutes_Total-error').length == 0) {

                            $('span[data-valmsg-for="Minutes_Total"]').append(minuteErrorSpanElem);
                            $('span[data-valmsg-for="Minutes_Total"]').addClass('field-validation-error');
                            $('span[data-valmsg-for="Minutes_Total"]').removeClass('field-validation-valid');
                        }

                        $('#Minutes_Total').addClass('alert-danger');
                    }
                    else {

                        if ($('span #Minutes_Total-error').length > 0) {

                            $('#Minutes_Total-error').remove();
                            $('#Minutes_Total').removeClass('field-validation-error');
                            $('#Minutes_Total').addClass('field-validation-valid');
                        }
                        
                        $('#Minutes_Total').removeClass('alert-danger');
                    }

                }
                else {
                    //No other specific case to catch for now
                }
                
                if (hasMinuteError || hasHourError) {

                    $('#NewMultiGoalMeeting_SaveBtn').attr('disabled', true);
                }
                else {

                    $('#NewMultiGoalMeeting_SaveBtn').attr('disabled', false);
                }
            },
            
            PromptWarningModalWhenNoExpendedTimeWasEntered: function () {

                var hasZeroValue = false;
                var hoursList = $('#HoursInputList').val();
                var minutesList = $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Minutes_"]');

                if ($('#ExpendedTime_ChckBox_EquallySplit').is(':not(:checked)')) {

                    //Validate that at least minute or Hours was selected for each individual section
                    //if not then display the warning Modal before continuing
                    for (var i = 0; i < $('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden)').length; i++) {

                        if ($($('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Hours_"]')[i]).val() == 0
                                && $($('#ExpendedTime_AddSection div[id*="ExpendedTime_Goal"]:not(:hidden) input[id*="Minutes_"]')[i]).val() == 0) {
                            hasZeroValue = true;
                        }
                    }
                }
                else {

                    if ($('#Minutes_Total').val() == 0 && $('#Hours_Total').val() == 0) {
                        hasZeroValue = true;
                    }
                }


                if (hasZeroValue) {
                    //Open the Modal
                    $('#ExpendedTime_WarningModal').trigger("open.wb-lbx", [
                        [{
                            src: "#ExpendedTime_WarningModal",
                            type: "inline"
                        }], true]);

                }
                else {

                    //Force prompt the save of the form
                    $('#NewMultiGoalMeeting_SaveBtn_Confirm').click();
                }
           }
        }
    },

    TimeFeatures: {

        //https://www.w3resource.com/javascript-exercises/javascript-date-exercise-13.php
        timeConvert: function (n){
            var num = n;
            var hours = (num / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            return rhours + "," + rminutes;
        }
    }

});

$(document).on("ready", function () {
    HIFIS_CaseManagement.Init();
});