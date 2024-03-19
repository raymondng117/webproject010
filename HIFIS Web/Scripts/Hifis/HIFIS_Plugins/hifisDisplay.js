

(function ($) {

    var opts;

    $.fn.hifisDisplay = function ( displaySelector, options ) {

        opts = $.extend({}, $.fn.hifisDisplay.defaults, options);

        // Iterate and reformat each matched element.
        return this.each(function () {

            var elem = $(this);

            if (!elem.is(":input"))
                throw "Only form inputs are supported.";

            if (!displaySelector)
                throw "Must pass a selector for the element(s) you want the value displayed in.";

            var patt = new RegExp("[#, .]");
            if (!patt.test(displaySelector))
                displaySelector = "#" + displaySelector;

            if (!$.fn.hifisDisplay.defaults.formatType)
                $.fn.hifisDisplay.defaults.formatType = getFormatType(elem);

            // Call our format function.
            var markup = $.fn.hifisDisplay.format(elem);

            $(displaySelector).html(markup);
        });
    };

    var getFormatType = function ( elem ) {
        var formatType;
        
        formatType = elem.attr("type");
        if (!formatType)
            formatType = elem.prop("tagName").toLowerCase();

        if (formatType.indexOf("select") > -1)
            if (elem.prop("multiple"))
                formatType = "multi-select";
        
        return formatType;
    }

    $.fn.hifisDisplay.defaults = {
        emptyValue: "", // The value to display if no value exists
        formatType: "",  // Date, Time, Text, List ( Leave blank to auto-determine ) 
        language: "en", // en or fr
    };

    // Define our format function.
    $.fn.hifisDisplay.format = function (elem) {

        var markup;

        switch ($.fn.hifisDisplay.defaults.formatType) {
            case "text":
                markup = $.fn.hifisDisplay.format_text(elem);
                break;
            case "textarea":
                markup = $.fn.hifisDisplay.format_textarea(elem);
                break;
            case "select":
                markup = $.fn.hifisDisplay.format_select(elem);
                break;
            case "multi-select":
                markup = $.fn.hifisDisplay.format_multiselect(elem);
                break;
            case "date":
                markup = $.fn.hifisDisplay.format_date(elem);
                break;
            case "datetime":
                markup = $.fn.hifisDisplay.format_datetime(elem);
                break;
            case "number":
                markup = $.fn.hifisDisplay.format_number(elem);
                break;            
            case "radio":
                markup = $.fn.hifisDisplay.format_radio(elem);
                break;
            case "checkbox":
                markup = $.fn.hifisDisplay.format_checkbox(elem);
                break;            
            case "email":
                markup = $.fn.hifisDisplay.format_email(elem);
                break;
            case "file":
                markup = $.fn.hifisDisplay.format_file(elem);
                break;
            case "image":
                markup = $.fn.hifisDisplay.format_image(elem);
                break;
            default:                
                break;
        }

        return markup;
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_text = function (elem) {
        return elem.val();
    };

    // Define our format_textarea function.
    $.fn.hifisDisplay.format_textarea = function (elem) {
        return elem.val();
    };

    // Define our format_select function.
    $.fn.hifisDisplay.format_select = function (elem) {
        return elem.find("option:selected").text();
    };

    // Define our format_select function.
    $.fn.hifisDisplay.format_multiselect = function (elem) {

        var markup = "";

        elem.find("option:selected").each(function () {
            markup += (this.text + ", ");
        });

        return $.trim(markup).slice(0, -1);
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_date = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_datetime = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_number = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_radio = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_checkbox = function (elem) {

        var yes = "Yes";
        var no = "No";

        if (opts.language === "fr") {
            yes = "Oui";
            no = "Non";
        }

        return elem.is(':checked') ? yes : no;
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_email = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_file = function (elem) {
        return elem.val();
    };

    // Define our format_text function.
    $.fn.hifisDisplay.format_image = function (elem) {
        return elem.val();
    };

}(jQuery));

