$(function () {
    var $pictureLoader = $("#pictureLoader");
    var $clientsPicture = $("#clientsPicture");
     
    function setLoaderOn() {
        $pictureLoader.removeClass("off");
        if (!$pictureLoader.hasClass("on")) {
            $("#pictureLoader").addClass("on");
        }
        $clientsPicture.removeClass("on");
        if (!$clientsPicture.hasClass("off")) {
            $clientsPicture.addClass("off");
        }
    }

    function setLoaderOff() {
        $pictureLoader.removeClass("on");
        if (!$pictureLoader.hasClass("off")) {
            $pictureLoader.addClass("off");
        }
        $clientsPicture.removeClass("off");
        if (!$clientsPicture.hasClass("on")) {
            $clientsPicture.addClass("on");
        }
    }

    function showDefaultPicture(genderID) {
        setLoaderOn();
        var pictureSrc = "";
        if (genderID == femaleGenderId) {
            pictureSrc = femalePictureSrc;
        } else {
            pictureSrc = malePictureSrc;
        }

        $("#clientsPicture").on("load", function () {
            setLoaderOff();
        }).attr("src", pictureSrc);
    }

    function showClientPicture(genderID) {
        setLoaderOn();
        var pictureSrc = clientPictureUrl;
        $("#clientsPicture").one("error", function () {
            if (genderID == femaleGenderId) {
                pictureSrc = femalePictureSrc;
            } else {
                pictureSrc = malePictureSrc;
            }
            $("#clientsPicture").attr("src", pictureSrc);
        });
        $("#clientsPicture").on("load", function () {
            $("#clientsPicture").off("error");
            setLoaderOff();
        }).attr("src", pictureSrc);
    }

    if (clientHasPicture) {
        showClientPicture(clientGenderId);
    } else {
        showDefaultPicture(clientGenderId);
    }

    $('#attestationDialog').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

    $('#attestationDialog').modal('toggle');
});