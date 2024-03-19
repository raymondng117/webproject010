
function init_loaders() {

    $('[data-loader="True"]')
            .after(function () {
                var loader_size = $(this).attr("data-loader-size");

                if (loader_size == null) {
                    loader_size = 30;
                }

                var loaderString = '<img class="inlineLoader" src="' + window.rootUrl + 'Content/images/Loaders/loader-' + loader_size + '.gif" alt="Loading..." style="display:none;" />';

                var man_star = $(this).parent().find(".mandatory-star");

                if (man_star.length) {

                    man_star.after(loaderString);

                    return false;
                }
                return loaderString;
            });
}
window.showLoader = function (selector) {
    $(selector).parent().find(".inlineLoader").show();
}
window.hideLoader = function (selector) {
    $(selector).parent().find(".inlineLoader").hide();
}
    
