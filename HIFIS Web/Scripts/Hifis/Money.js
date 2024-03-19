function AddMoneyMask() {
    //$('.money').addClass("form-control");

    $('.money, .moneyNegative').each(function () {

        //prevents money mask from adding every time init hifis is called
        if ($(this).prev('div.input-group-addon').text() !== "$") {
            $(this).before('<div class="input-group-addon">$</div>');
        }
    });

    $('.money').maskMoney({
        thousands: ''
    });

    $('.moneyNegative').maskMoney({
        allowNegative: true
    });
}