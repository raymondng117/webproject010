$(document).ready(function () {
    init_YesAndNo();
});

function init_YesAndNo() {
    $(".YesAndNo").parent().removeClass("form-control");
    $(".YesAndNo").bootstrapSwitch();
}
