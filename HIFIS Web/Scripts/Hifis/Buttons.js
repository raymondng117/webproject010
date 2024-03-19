function initButtons() {
    $(".cancelButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-remove'></span>&nbsp");
    $(".saveButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-floppy-disk'></span>&nbsp");
    $(".editButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-pencil alt=Edit'></span>&nbsp");
    $(".clearButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-ban-circle'></span>&nbsp");
    $(".editDDButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-list-alt'></span>&nbsp");
    $(".uploadButton").not('.btn').addClass("btn btn-default").prepend("<span class='fa fa-upload'></span>&nbsp");
    $(".downloadButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-download-alt'></span>&nbsp");
    $(".checkrepupdate").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-refresh'></span>&nbsp");
    $(".downloadrepmarket").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-cloud-download'></span>&nbsp");
    
    $(".searchButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-search'></span>&nbsp");
    $(".homeButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-home'></span>&nbsp");
    $(".loginButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-log-in'></span>&nbsp");
    $(".logoutButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-log-out'></span>&nbsp");
    $(".duplicateButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-duplicate'></span>&nbsp");

    $(".alertButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-exclamation-sign'></span>&nbsp");
    $(".moveRightButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-arrow-right'></span>&nbsp");
    $(".manageButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-cog'></span>&nbsp");

    $(".contactButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-earphone'></span>&nbsp");
    $(".clientButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-user'></span>&nbsp");

    $(".replyButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-share'></span>&nbsp");
    $(".forwardButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-arrow-right'></span>&nbsp");
    $(".sendButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-send'></span>&nbsp");

    $(".expressButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-fast-forward'></span>&nbsp");
    $(".printButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-print'></span>&nbsp");
    $(".prevButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-arrow-left'></span>&nbsp");
    $(".newWindow").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-new-window'></span&nbsp>");
    $(".viewButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-tasks'></span>&nbsp");
    $(".documentButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-file'></span>&nbsp");

    $(".noteButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-book '></span>&nbsp");
    $(".archivedButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-hdd'></span>&nbsp");
    $(".downloadButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-download-alt'></span>&nbsp");

    $(".lockButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-lock'></span>&nbsp");
    $(".displayButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-picture'></span>&nbsp");
    $(".deleteButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-trash'></span>&nbsp");
    $(".deleteMessageButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-trash'></span>&nbsp");
    $(".deleteCommentReviewButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-trash'></span>&nbsp");
    $(".closeButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-remove'></span>&nbsp");
    
    $(".filterButton").not('.btn').addClass("btn btn-default").prepend("<span class='fa fa-filter'></span>&nbsp");
    $(".orderButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-sort'></span>&nbsp");
    $(".customTablesButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-th-list'></span>&nbsp");
    $(".listButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-list-alt'></span>&nbsp");
    $(".addButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-plus-sign'></span>&nbsp");

    // Naming conflict with Bing Maps v8 which is also using "addButton" class name
    $(".addBingButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-plus-sign'></span>&nbsp");

    $(".reloadButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-refresh'></span>&nbsp");

    $(".minusButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-minus-sign'></span>&nbsp");
    $(".cloneButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-th-large'></span>&nbsp");
    $(".warningButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-warning-sign'></span>&nbsp");

    $(".helpInfoButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon glyphicon-info-sign'></span>&nbsp");
    $(".helpButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-question-sign'></span>&nbsp");

    $(".upButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-arrow-up'></span>&nbsp");
    $(".expandButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-fullscreen'></span>&nbsp");

    // Stays
    $(".bookInButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-log-in'></span>&nbsp");
    $(".bookOutButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-log-out'></span>&nbsp");
    $(".reserveButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-export'></span>&nbsp");

    // location
    $(".locationButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-map-marker'></span>&nbsp");


    // Stays graphical toggle
    $(".smallTileButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-th'></span>&nbsp");
    $(".largeTileButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-th-large'></span>&nbsp");
    $(".stayTablesButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-list-alt'></span>&nbsp");
    $(".stayFormButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-th-list'></span>&nbsp");
    $(".bookInFamilyButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-stats'></span>&nbsp");
    $(".refreshButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-refresh'></span>&nbsp");
    $(".nextButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-circle-arrow-right'></span>&nbsp");
    $(".backButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-circle-arrow-left'></span>&nbsp");

    $(".printButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-print'></span>&nbsp");
    $(".clientsButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-user'></span>&nbsp");
    $(".familyButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-user'></span>&nbsp");

    $(".chainButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-link'></span>&nbsp");

    $(".back-to-top").not('.btn').addClass("btn btn-warning").prepend("<span class='glyphicon glyphicon-arrow-up mrgn-tp-xs'></span>&nbsp");

    $(".randomButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-random mrgn-tp-xs'></span>&nbsp");

    $(".excelButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-stats mrgn-tp-xs'></span>&nbsp");
    
    $('.multipleSelectFilterButton').not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-filter'></span>");

    $('.eyeButton').not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-eye-open'></span>");

    $(".toggleButton").not('.btn').addClass("btn btn-default").prepend("<span class='fa fa-toggle-on mrgn-tp-xs'></span>&nbsp");

    $(".followUpButton").not('.btn').addClass("btn btn-default").prepend("<span class='fa fa-sticky-note'></span>&nbsp");

    $(".optionHButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-option-horizontal'></span>&nbsp");

    $(".playButton").not('.btn').addClass("btn btn-default").prepend("<span class='glyphicon glyphicon-play '></span>&nbsp");

    //Keep these on bottom
    $(".selectAllButton").not('.btn').addClass("btn btn-default");
    $('input[type="submit"]').not('.btn').addClass("btn btn-default");
    $('input[type="button"]').not('.btn').addClass("btn btn-default");
    $('button').not('.btn').addClass("btn btn-default");    

    $(".noText").each(function () {
        $(this)
        .attr('title', $(this).text())
        .attr('data-toggle', 'tooltip')
        .attr('data-placement', 'top')
        .attr('data-trigger', 'hover')
        .addClass("btn-sm")
        .tooltip({ container: 'body' });
    });

    $(".noText").on('click', function () {
        $(this).tooltip('hide');
    });

    $(".noText").contents().filter(function () {        
        return this.nodeType === 3;
    }).remove();

    $(".noTextPls").each(function () {
        $(this).addClass("btn-sm");
    });

    $(".ToolTipText").each(function () {
        $(this).tooltip({ container: 'body', html: true });
    });
}

function initRadioButtons() {
    $('label.radio-button').click(function (e) { document.location = $(e.target).find('a').attr('href'); });
}

function selectAllOptions() {
    var selectList = $(this).siblings('select');

    selectList.children('option').each(function (index, element) {
        if (element.value !== "") {            
            if (element.text == "Stay") {
                $(".stay-required").siblings(".glyphicon-star").removeClass("hide");
                $("#IsStayIncluded").attr("value", "True");
                $("#MaxBedsPerPeriod").parents(".form-group").show();
            }

            $(this).prop("selected", true).parent().trigger("change");
        }
    });
}

function deselectAllOptions() {
    var selectList = $(this).siblings('select');

    selectList.children('option').each(function (index, element) {
        if (element.value !== "") {
            if (element.text == "Stay") {
                $(".stay-required").siblings(".glyphicon-star").addClass("hide");
                $("#IsStayIncluded").attr("value", "False");
                $("#MaxBedsPerPeriod").parents(".form-group").hide();
            }

            $(this).prop("selected", false).parent().trigger("change");
        }
    });
}
