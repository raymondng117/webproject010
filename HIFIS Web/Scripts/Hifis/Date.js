
function AddDatePickers() {
    var datePickerIndex = document.querySelectorAll('.dateInitCompleted').length;
    $('input[type="date"]:not([readonly])').each(function () {
        datePickerIndex = datePickerIndex + 1;

        $(this).wrap("<div style='width:160px;' class='input-group date align-left dateInitCompleted' id='datePicker" + datePickerIndex + "'></div>");
        $(this).after("<span class='input-group-addon'><span class='glyphicon glyphicon-calendar'></span></span>");
        $(this).attr("data-date-format", "YYYY-MM-DD");
        $(this).attr("type", "text");

        //var loc = $('input[data-locale]').data('locale');
        if ($('input[data-locale]').data('locale') == 'en-CA')
        {
            $("#datePicker" + datePickerIndex).datetimepicker({
                pickTime: false,
                language: 'en'
            });
        }
        else
        {
            $("#datePicker" + datePickerIndex).datetimepicker({
                pickTime: false,
                language: 'fr-ca'
            });
        }
    });

    // Hide the wet calendars if the date field is readonly.
    $(document).on("wb-ready.wb-date", "input[type=date][readonly]", function (event) {
        $(this).siblings('.input-group-btn').hide();
    });
    
}