function autoWidth(containerSelector) {
    var $elements = (containerSelector ? $(containerSelector + ' .autowidth') : $(".autowidth"));
    // Get all label widths:
    var widths = $elements.map(function () {
        return $(this).width();
    }).get();

    // find max label width:
    var maxWidth = Math.max.apply(Math, widths);

    // set every labels width to the highest
    $elements.map(function () {
        $(this)
        //            .css('display', 'inline-block')
            .width(maxWidth + 20);
    });
}

function setAutoWidth(containerSelector, addedWidth) {
    var $elements = (containerSelector ? $(containerSelector + ' .autowidth') : $(".autowidth"));
    // Get all label widths:
    var widths = $elements.map(function () {
        return $(this).width();
    }).get();

    // find max label width:
    var maxWidth = Math.max.apply(Math, widths);

    // set every labels width to the highest
    $elements.map(function () {
        $(this)
        .width(maxWidth + addedWidth);
    });
}

function autoWidthBoot(containerSelector) {
    var $elements = $(containerSelector + ' label.col-sm-2:not(.autowidth)');

    // Get all label widths:
    var labelLength = $elements.map(function () {
        return $(this).text().length;
    }).get();

    // find max label width:
    var maxLength = Math.max.apply(Math, labelLength);

    var colSize;
    var colSizeDiv;
    var offsetSize;    

    if (maxLength < 14) {
        colSize = "col-sm-2";
        colSizeDiv = "col-sm-10";
        offsetSize = "col-sm-offset-2";
    }
    else if (maxLength < 25) {
        colSize = "col-sm-3";
        colSizeDiv = "col-sm-9";
        offsetSize = "col-sm-offset-3";        
    }
    else if (maxLength < 44) {
        colSize = "col-sm-4";
        colSizeDiv = "col-sm-8";
        offsetSize = "col-sm-offset-4";        
    }
    else if (maxLength < 50) {
        colSize = "col-sm-5";
        colSizeDiv = "col-sm-7";
        offsetSize = "col-sm-offset-5";
    }
    else {
        colSize = "col-sm-6";
        colSizeDiv = "col-sm-6";
        offsetSize = "col-sm-offset-6";
    }

    // set every labels width to the highest
    $elements.map(function () {
        if (colSize !== "col-sm-2") {
            $(this).removeClass("col-sm-2").addClass(colSize).parent().find(".col-sm-10").removeClass("col-sm-10").addClass(colSizeDiv);

            $(".col-sm-offset-2").removeClass("col-sm-offset-2 col-sm-10").addClass(offsetSize + " " + colSizeDiv);
        }
    });
}
