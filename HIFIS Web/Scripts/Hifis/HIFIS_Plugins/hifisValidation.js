

(function ($) {

    $.fn.hifisValidation = function () {

        $(this).removeData("validator");
        $(this).removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse(this);

        return this;
    };

}(jQuery));



