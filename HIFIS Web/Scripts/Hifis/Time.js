
function TimePicker() {
    var timePickerIndex = 0;
    $('input[realtype="time"]:not([readonly])').each(function () {
        timePickerIndex = timePickerIndex + 1;

        if (!$(this).parent().hasClass("timePickerWrapper")) {
            $(this).wrap("<div style='width:160px;' class='input-group date align-left timePickerWrapper' id='timePicker" + timePickerIndex + "'></div>");
            $(this).after("<span class='input-group-addon'><span class='glyphicon glyphicon-time'></span></span>");

            if ($('input[data-locale]').data('locale') == 'en-CA') {
                $("#timePicker" + timePickerIndex).datetimepicker({
                    pickDate: false,
                    language: 'en'
                });
            }
            else {
                $("#timePicker" + timePickerIndex).datetimepicker({
                    pickDate: false,
                    language: 'fr-ca'
                });
            }
        }
    });
}
