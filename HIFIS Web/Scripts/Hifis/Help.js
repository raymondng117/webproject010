//The script block below is for toggling, and retrieving the field help when the help toggles button is clicked

/* Creates the popover and clickable span for the field help to be populated into. dataResult is an associative array of key/Value pairs */
function createHelpButton(dataResult) {
    for (var i in dataResult) {
        var className = document.getElementsByClassName("hlp-" + dataResult[i].Key);
        var helpSpan = '<span class="mrgn-lft-sm field-help" data-placement="top" data-toggle="popover" data-content="' + dataResult[i].Value + '"><i class="glyphicon glyphicon glyphicon-question-sign"></i></span>';
        $(className).append(helpSpan);
    }
    $('.field-help').popover(); // Initialize the popover for the field-help span.
}

$('#helpToggle').hide();                // Hide the Help Toggle on page load.
var helpButtonActive = false;           // Set bool value of clicked button to false
var labelArray = new Array();           // Array of all of the HifisLabelFor on the current view
var dataHolder = null;                  // Holder object for storing the field help data after the first ajax call.
var previouslyClickedHelpButton = null; // String which holds a previous clicked button. 

/* Get an array of all HifisLabelFor on the view with the class custom-help. */
$(".custom-help").each(function (index, element) {
    var labelName = $(this).attr("data-fieldLabelKey");
    labelArray.push(labelName);
});

/* Since the Bootstrap target=focus is currently broken, these next two items allow the popover to be hidden when clicked outside of the popover */
$('.custom-help').click(function (e) {
    e.stopPropagation();

    var currentHelpButton = "hlp-" + $(this).attr("data-fieldLabelKey")
    if (currentHelpButton != previouslyClickedHelpButton) {
        if (previouslyClickedHelpButton == null) {
            previouslyClickedHelpButton = "hlp-" + $(this).attr("data-fieldLabelKey");
        }
        else {
            $('.' + previouslyClickedHelpButton + ' .field-help').popover('hide');
            previouslyClickedHelpButton = currentHelpButton;
        }
    }
});

//$(document).click(function (e) {
//    if (($('.popover').has(e.target).length == 0)) {
//        $('.field-help').popover('hide');
//    }
//});

/* Show the help toggle if editors labels exists. */
if (labelArray.length > 0) {
    $('#helpToggle').show();
}

/* Click event fired when the help toggle button is clicked. */
$('#helpToggle').click(function (e) {
    if (helpButtonActive) {
        $('.field-help').popover('destroy');    // Destroy all popovers.
        $('.field-help').remove();              // Remove the clickable span.
        $('#helpToggle').removeClass("active"); // Remove the active class from the toggle button.
        helpButtonActive = false;               // Reset the bool to false so we know the help is inactive.
    }
    else {
        helpButtonActive = true; // Set the bool to true so we know the help is active.
        if (dataHolder != null) {
            createHelpButton(dataHolder);
        }
        else {
            $('#helpToggle').addClass("active"); // Add the active class from the toggle button.
            $(function () {
                /* Even though we can't click the button, we should still double check and make sure we have elements in the array. *
                * We then go and get the field help for any elements that have help.                                                */
                if (labelArray.length > 0) {
                    $.ajax({
                        type: "GET",
                        traditional: true,
                        dataType: "json",
                        url: window.helpURL,
                        data: { fieldArray: labelArray, uniq_param: (new Date()).getTime() }
                    })
                    .done(function (data) {
                        dataHolder = data.Result;  // Put result into dataHolder object so we only ever make one ajax call even if the button is clicked multiple times.
                        createHelpButton(dataHolder);
                    });
                }
            });
        }
    }
});