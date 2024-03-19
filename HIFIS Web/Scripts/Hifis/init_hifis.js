// Because we sometime dynamically populate the Select2 lists, the length of the longest
// list item may vary so we need to re-initialize the control to correct the width.
// In addition, we use Select2's for auto complete controls where the length of values is unknown
// until a value is selected - also, the initilaizer is unique to each autocomplete as it has
// to be bound to a specific ajax url. So, we hold the initilizers in the following array, and
// call them whenever a Select2 item select event fires. Essentially, this whole thing to correct
// their width, if anyone ever find a better way to get Select2 to resize itself dynamically after
// after a value is selected, then feel free to depricate this approach!
var select2InitFunctions = new Array();

$(function () {
    init_hifis();
});

function doSelect2Init() {

    for (var selectIndex = 0; selectIndex < select2InitFunctions.length; selectIndex++) {
        setTimeout(select2InitFunctions[selectIndex]());
    }

    //select2InitFunctions.forEach(function (callback) {
    //    try {
    //        callback();
    //    }
    //    catch (err) {

    //    }
    //});
}

function init_hifis() {
    //Initialize button styles
    initButtons();

    $('.selectAllButton').click(selectAllOptions);
    $('.deselectAllButton').click(deselectAllOptions);

    //Initialize auto width
    autoWidth('.displayView');
    autoWidthBoot('.container');

    //Adds styles for the timepickers
    if (!isMobileBrowser()) {
        TimePicker();
    }

    //Add mask to tele phones
    AddTelephoneMask();

    //Add Money mask
    AddMoneyMask();

    //initialize loaders in page
    init_loaders();

    //Add date pickers
    if (!isMobileBrowser()) {
        AddDatePickers();
    }

    //initialize Yes/No toggles
    init_YesAndNo();


    //All event bindings should be placed in this bizzle - JdV, RL
    if (!$("body").hasClass("HIFISInit")) {


        //Add the HIFISInit class to ensure that events are only binded once when init_hifis() is called
        $("body").addClass("HIFISInit");

        $(document).on("wb-ready.wb", function (event) {
            //console.log(event);
            //alert("wb-ready.wb");
            initSelect2();
        });

        var initSelect2 = function () {
            if (!isMobileBrowser()) {
                var dataTableSelect = $(".dataTables_length").children("label").children("select");

                //try {
                //    $('select.select2-init').not(".autocomplete").not(dataTableSelect).select2("destroy");
                //}
                //catch (err) {
                //}

                $("select").not("[multiple]").not(".autocomplete").not(dataTableSelect).select2(
                {
                    allowClear: true,
                    placeholder: $("#DropdownPlaceholder").val(),
                    dropdownAutoWidth: true
                });
                $("select[multiple]").not(".autocomplete").not(dataTableSelect).select2(
                {
                    allowClear: false,
                    placeholder: $("#DropdownPlaceholder").val(),
                    dropdownAutoWidth: true
                });

            }
        }

        // Finally, we add the non autocomplete ones to the array so that they can
        // re-initialize dynamically too!
        select2InitFunctions.push(initSelect2);


        //This fixes an issue with WET tabs that causes datatables filter to loos focous when nested in a WET tab
        //https://github.com/wet-boew/wet-boew/issues/7385
        $(".wb-tabs").on("wb-ready.wb-tabs", function (event) {
            $(".wb-tabs").removeClass("wb-eqht wb-eqht-inited");
        });

        // If there are any lightbox modals on the page, override this magnific function for select2 inputs.
        $(document).on("wb-ready.wb-lbx", function (event) {
            $.magnificPopup.instance._onFocusIn = function (e) {
                // Do nothing if target element is select2 input
                if ($(e.target).hasClass('select2-search__field')) {
                    return true;
                }
                // Else call parent method
                $.magnificPopup.proto._onFocusIn.call(this, e);
            };
        });

        $('select').on('select2:select', function (evt) {
            doSelect2Init();
        });

        $(document).on('shown.bs.tab shown.bs.collapse', function (e) {
            doSelect2Init();
        });

        $(document).on('click', '.onTheFlyButton', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var id = $(this).attr("data-target");
            $(id).modal('show');

            $.ajax({

                url: $(this).attr("href"),
                type: 'GET',
                success: function (data) {

                    $(id).find(".modal-content").html(data);
                    $(id).find(".modal-header").focus();
                }

            });
        });

        $("#ChangeOrgModal").on('hidden.bs.modal', function (e) {
            $("#Password_Modal").val("");
        });

        //This is for the file inputs
        $(document).on('change', "input[type='file'].custom-file-input", function () {
            setFileInputValue($(this));
        });
        $(window).resize(function () {
            $("input[type='file'].custom-file-input").each(function () {
                updateFileInputSize($(this));
            });
        });

        //This is to intercept click events only on client pages
        if ($("#hifis-client-profile").length) {
            $(".lbx-modal.addButton:not(.addConsent)").each(function () {
                interceptClick($(this));
            });
            $(".lbx-modal.editButton").each(function () {
                interceptClick($(this));
            });
            $(".checkConsent").each(function () {
                interceptClick($(this));
            });
        }
    }

    if (isMobileBrowser()) {
        $(".modal-body select.form-control").css("max-width", "250px");
        $("select.form-control").removeClass("form-control");
        $("input[type='date'].form-control").removeClass("form-control");
        $("input[realtype='time'].form-control").prop('type', 'time');
        //$("input[type='time'].form-control").removeClass("form-control");
    }

    // Next we initialize the Select2's that are in the call back array (autocompletes):
    select2InitFunctions.forEach(function (callback) {
        callback();
    });
}

$.xhrPool = [];
$.xhrPool.abortAll = function () {
    $(this).each(function (i, jqXHR) {   //  cycle through list of recorded connection
        jqXHR.abort();  //  aborts connection
        $.xhrPool.splice(i, 1); //  removes from list by index
    });
}

function cancelAllAjaxCall() {

    $.xhrPool.abortAll();
}

function isMobileBrowser() {
    if (/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) {
        // mobile!
        // There is also a ViewBag.Mobile bool that can be examined to see if we are on a mobile!
        return true;
    }
    else {
        return false;
    }
}

function ValidatePath (pathToValidate) {

    if (location.pathname.indexOf(pathToValidate) != -1) {
        return true;
    }
    else {
        return false;
    }
};