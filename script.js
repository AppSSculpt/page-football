document.addEventListener('DOMContentLoaded', function () {
    var qrCodeValue = getParameterValue('qr_code');
    var comprador = getParameterValue('comprador');

    createQRCode(qrCodeValue);
    document.getElementById('comprador').textContent = comprador;

    document.getElementById('downloadPdf').addEventListener('click', function () {
        var btn = this;
        btn.classList.add('downloading');

        createPDF().then(function () {
            btn.classList.remove('downloading');
        });
    });
});

function getParameterValue(parameterName) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

function createQRCode(qrCodeValue) {
    var qrcode = new QRCode(document.getElementById('qrcode'), {
        text: qrCodeValue,
        width: 120,
        height: 120,
    });
}

function createPDF() {
    return new Promise(function (resolve, reject) {
        var container = document.getElementById('qrcode-container');
        var options = { scale: 2 };

        html2pdf().from(container).set(options).outputPdf().then(function (pdf) {
            savePDF(pdf);
            resolve();
        }).catch(function (error) {
            console.error('Error creating PDF:', error);
            reject(error);
        });
    });
}

function savePDF(pdf) {
    var pdfBlob = new Blob([pdf], { type: 'application/pdf' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'seu_ingresso.pdf';
    downloadLink.click();
}
