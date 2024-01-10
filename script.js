let pdfDoc;

document.addEventListener('DOMContentLoaded', async function () {
    var qrCodeValue = getParameterValue('qr_code');
    var comprador = getParameterValue('comprador');

    try {
        var pdfBytes = await fetch('INGRESSO_PAC.pdf').then(res => res.arrayBuffer());
        var qrCodeImage = await generateQRCodeImage(qrCodeValue);

        pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

        var modifiedPdfBytes = await createPDFWithQRCode(comprador, qrCodeImage);
        displayPDF(modifiedPdfBytes);
    } catch (error) {
        console.error('Erro ao criar PDF:', error);
    }
});

function getParameterValue(parameterName) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

async function generateQRCodeImage(qrCodeValue) {
    var qrCode = new QRCode(document.createElement('div'));
    qrCode.makeCode(qrCodeValue);

    var qrCodeImage = await pdfDoc.embedPng(qrCode._el.firstChild.toDataURL());

    return qrCodeImage;
}

async function createPDFWithQRCode(comprador, qrCodeImage) {
    var page = pdfDoc.getPage(0);

    var qrCodeX = 50;
    var qrCodeY = 450;
    var qrCodeWidth = 120;
    var qrCodeHeight = 120;

    page.drawImage(qrCodeImage, {
        x: qrCodeX,
        y: qrCodeY,
        width: qrCodeWidth,
        height: qrCodeHeight,
    });

    var font = await pdfDoc.embedFont(PDFLib.Font.Helvetica);
    var textX = 50;
    var textY = 500;
    page.drawText('Comprador: ' + comprador, { x: textX, y: textY, font });

    var modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
}

function displayPDF(pdfBytes) {
    var pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    var viewLink = document.createElement('a');
    viewLink.href = URL.createObjectURL(pdfBlob);
    viewLink.target = '_blank';
    viewLink.innerText = 'Visualizar PDF';

    document.body.appendChild(viewLink);

    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'seu_ingresso.pdf';
    downloadLink.innerText = 'Baixar PDF';

    document.getElementById('downloadPdf').addEventListener('click', function () {
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}
