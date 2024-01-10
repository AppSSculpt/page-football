// Certifique-se de incluir a biblioteca pdf-lib no seu projeto
// Você pode encontrá-la em https://github.com/Hopding/pdf-lib

document.addEventListener('DOMContentLoaded', function () {
    var qrCodeValue = getParameterValue('qr_code');
    var comprador = getParameterValue('comprador');

    createPDF(comprador, qrCodeValue).then(function (pdfBytes) {
        savePDF(pdfBytes);
    });
});

function getParameterValue(parameterName) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

async function createPDF(comprador, qrCodeValue) {
    // Substitua 'INGRESSO PAC 2.pdf' pelo nome do seu modelo de ingresso
    var pdfBytes = await fetch('INGRESSO PAC 2.pdf').then(res => res.arrayBuffer());
    var pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    // Crie uma nova página no PDF
    var page = pdfDoc.addPage();

    // Defina a fonte e o tamanho do texto
    var font = await pdfDoc.embedFont(PDFLib.Font.Helvetica);
    page.drawText('Comprador: ' + comprador, { x: 50, y: 500, font });
    page.drawText('QR Code: ' + qrCodeValue, { x: 50, y: 450, font });

    // Salve as modificações no PDF
    var modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
}

function savePDF(pdfBytes) {
    var pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'seu_ingresso.pdf';
    downloadLink.click();
}
