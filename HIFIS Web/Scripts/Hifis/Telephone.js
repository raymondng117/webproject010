function AddTelephoneMask() {
    $('[type=tel]').mask("(999) 999-9999", { placeholder: " " }).blur(function () { $(this).valid(); });
}