
function getLookupOrRollup(ddName)
{
    var selectedValue = parseInt($('option:selected', $(ddName)).attr('data-rollup') == "" ? $(ddName).val() : $('option:selected', $(ddName)).attr('data-rollup'));
    //alert(selectedValue);
    return selectedValue;
};






