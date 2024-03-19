
var dateMask = '    -  -  '; //TODO: update if date mask changes
var defaultDateValidator = $.validator.methods['date']; //default jquery date validator

$.validator.setDefaults({
    ignore: [":hidden:not([type=select], [type=textarea])"]
});

//Adapters

//overriding date validator
function date(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;

    return (value == dateMask || defaultDateValidator.call(this, value, element, params));
}

// overiding range and number validators so it also works with french culture - Chris
// taken from (http://rebuildall.umbraworks.net/rebuildall/2011/03/02/jQuery_validate_and_the_comma_decimal_separator)
$.validator.methods.range = function (value, element, param) {
    if (value != undefined) {
        var globalizedValue = value.replace(",", ".");
    }
    return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
}
//$.validator.methods.number = function (value, element) {
//    return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
//}
// above code with redone regexp - Chris
$.validator.methods.number = function (value, element) {
    return this.optional(element) || /-?\d+(?:[\.,]\d+)?/.test(value);
}

//includes checking for date mask
function isEmptyDateValue(value) {
    return (!value || value === dateMask);
}

// Neither are Zero
function neitherarezero(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;
    var othernumberID = $(element).attr('data-val-neitherarezero-othernumber');
    var othernumberValue = $('#' + othernumberID).first().val();
    
    return (value > 0 || othernumberValue > 0);
}

//Date greater than
function dategreaterthan(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;

    //JS Date ctor doesn't create object with correct value if '-' is used as a separator, it has difficulty determining format.
    var formattedValue = value.replace(/-/g, "/");
    var valueDate = new Date(formattedValue);    
    var otherdateID = $(element).attr('data-val-dategreaterthan-otherdate');
    var otherdateString = $('#' + otherdateID).first().val();
    var formattedOther = otherdateString.replace(/-/g, "/");
    var valueOther = new Date(formattedOther);

    return (isEmptyDateValue(value) || valueDate >= valueOther);
}

//Date not in range
function datenotinrange(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;

    //JS Date ctor doesn't create object with correct value if '-' is used as a separator, it has difficulty determining format.
    var formattedValue = value.replace(/-/g, "/");
    var valueDate = new Date(formattedValue);

    var mindateID = $(element).attr('data-val-datenotinrange-mindate');
    var mindateString = $('#' + mindateID).first().val();
    var formattedMindate = mindateString.replace(/-/g, "/");
    var valueMindate = new Date(formattedMindate);

    var maxdateID = $(element).attr('data-val-datenotinrange-maxdate');
    var maxdateString = $('#' + maxdateID).first().val();
    var formattedMaxdate = maxdateString.replace(/-/g, "/");
    var valueMaxdate = new Date(formattedMaxdate);

    //Return true if date value is empty OR 
    //Date is less than min and max date OR
    //Date is greater than min and max date OR
    //Date is greater than max with no min specified OR
    //Date is less than min with no max specified

    return (isEmptyDateValue(value) ||
        (valueDate < valueMindate && valueDate < valueMaxdate) ||
        (valueDate > valueMindate && valueDate > valueMaxdate) ||
        (mindateString === "" && valueDate > valueMaxdate) ||
        (valueDate < valueMindate && maxdateString === ""));
}

//Date not in past
function datenotpast(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;

    var date = new Date();
    value = value.replace(/-/g, "/");

    if ($(element).attr('data-val-datenotpast-validatetimenotinpast') == 'True') {

        var time = $('#' + $(element).attr('id') + '_TimeOfDay').val();

        if (time == '' || time == null || time == NaN) {
            return false;
        }

        //English time is based on 12h based
        if ($('html').attr('lang') == 'en') {

            time = timeConvert(time);
            value = new Date(value + " " + time);
        }
        else {

            value = new Date(value + " " + time);
        }

        var mydate = new Date(value);

        return (isEmptyDateValue(value) || mydate >= date);
    }
    else {

        value = value + " 23:59:59";
        var mydate = new Date(value);

        return (isEmptyDateValue(value) || mydate >= date);
    }
}

// Date not in future
function datenotfuture(value, element, params) {
    if ($(element).attr('type') == 'hidden')
        return true;
    var date = new Date();

    value = value.replace(/-/g, "/");
    //value = value + " 23:59:59";
    mydate = new Date(value);

    return (isEmptyDateValue(value) || mydate <= date);
}

//DOB
function doblimiter(value, element, params) {

    if ($(element).attr('type') == 'hidden')
        return true;
    //Value 150 from @Constants.MIN_DOB_YEAR
    var q = new Date();
    var m = q.getMonth() + 1;
    var d = q.getDay();
    var y = q.getYear() - 150;

    var date = new Date(y, m, d);

    mydate = new Date(value);

    return (isEmptyDateValue(value) || mydate >= date);
}

// function that will be added to jquery validate
function requiredif(value, element, params) {

    var requiredFunction = window[$(element).attr('data-val-requiredif-function')];
    var requiredExpression;
    var elemIDs;

    if (!(typeof requiredFunction === "function")) { // just return rtue to bypass client side validation if the provided parameter is not a function
        //If its not a function, lets see if its a sudo-expression
        requiredExpression = $(element).attr('data-val-requiredif-function');

        if (requiredExpression !== null && requiredExpression !== "" && requiredExpression !== "None") { //If the added function does not exists, use the provided expression to evaluate if field is required

            //Get the susdo element ids
            elemIDs = requiredExpression.match(/#\w+/g);

            //If nothing is there by pass the rest
            if (elemIDs !== null) {

                //Filter out duplicates (duplicates can cause issues in the for loop replace)
                elemIDs = elemIDs.filter(function (elem, pos) {
                    return elemIDs.indexOf(elem) == pos;
                });

                //stored values to be tested
                var elamVals = [];

                //replace sudo ids with selectors
                for (var i = 0; i < elemIDs.length; i++)
                {
                    elamVals[i] = document.querySelector(elemIDs[i]).value;
                    requiredExpression = requiredExpression.split(elemIDs[i]).join("elamVals[" + i + "]");
                }
            }
        }
        else
            return true;
    }

    return (requiredFunction === "None" ||
        (typeof requiredFunction === "function" && !requiredFunction()) ||
        (requiredExpression !== null && requiredExpression !== "" && !eval(requiredExpression)) ||
        $.validator.methods['required'].call(this, value, element, params));
}

function hifismandatoryFN(value, element, params) {

    if (value == null)
        return false;
    else
        return true;
}

//Add all adapters, connections to jquery.validate
var adapters = [
                    { name: 'doblimiter', method: doblimiter },
                    { name: 'dategreaterthan', method: dategreaterthan },
                    { name: 'datenotinrange', method: datenotinrange },
                    { name: 'datenotpast', method: datenotpast },
                    { name: 'datenotfuture', method: datenotfuture },
                    { name: 'requiredif', method: requiredif },
                    { name: 'neitherarezero', method: neitherarezero }
];

//Add extra adapters
for (var i = 0; i < adapters.length; ++i) {
    try {
        $.validator.unobtrusive.adapters.add(adapters[i].name, [], function (options) {
            options.rules[this.name] = true;
            options.messages[this.name] = options.message;
        });

        $.validator.addMethod(adapters[i].name, adapters[i].method, '');
    }
    catch (err) {
        // just ignore for now...
    }
}

//Formaters
function formatDate(date) {
    var format = 'YYYY/MM/DD';

    format = format.replace('MM', date.getMonth() + 1)
        .replace('YYYY', date.getFullYear())
        .replace('DD', date.getDate());

    return format;
}

function timeConvert(timeStamp) {
    const [time, modifier] = timeStamp.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}:00`;
}

$(document).ready(function () {
    //replace default validator to allow mask
    $.validator.addMethod('date', date, '');
    $.validator.addMethod('requiredif', requiredif, '');
    $.validator.addMethod('doblimiter', doblimiter, '');
    $.validator.addMethod('dategreaterthan', dategreaterthan, '');
    $.validator.addMethod('datenotinrange', datenotinrange, '');
    $.validator.addMethod('datenotpast', datenotpast, '');
    $.validator.addMethod('datenotfuture', datenotfuture, '');
    $.validator.addMethod('neitherarezero', neitherarezero, '');

    $('select').on('select2:select', function (e) {
        $(this).valid();
    });

    $('select').on('select2:deselect', function (e) {
        $(this).valid();
    });
});