function setFileInputValue(fileInput) {
    var fileName = fileInput.val();
    var maxLength = 25;
    var idx;


	// Modern browser (chrome & safari)
    if (fileName.substr(0, 12) === "C:\\fakepath\\") {
    	fileName = fileName.substr(12);
    }

	// Legacy browsers
	// Unix-based path
    idx = fileName.lastIndexOf("/");
    if (idx >= 0) {
    	fileName = fileName.substr(idx + 1);
    }

	// Windows-based path
    idx = fileName.lastIndexOf("\\");
    if (idx >= 0) {
    	fileName = fileName.substr(idx + 1);
    }

    if (fileName.length > maxLength) {
        fileName = fileName.substring(0, maxLength) + "...";
    }

    fileInput.siblings("span.file-content-setter").attr('data-content-after', fileName);

    updateFileInputSize(fileInput);
}

function updateFileInputSize(fileInput) {
    var inputWidth = fileInput.width();
    var containerWidth = fileInput.closest(".input-group").parent().width();

    if (inputWidth < containerWidth) {
        fileInput.siblings("span.file-content-setter").css("width", inputWidth + "px");
    } else {
        fileInput.siblings("span.file-content-setter").css("width", containerWidth + "px");
    }
}