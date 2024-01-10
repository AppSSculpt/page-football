document.addEventListener('DOMContentLoaded', async function () {
    var qrCodeValue = getParameterValue('qr_code');
    var comprador = getParameterValue('comprador');

    try {
        var pdfBytes = await fetch('INGRESSO_PAC.pdf').then(res => res.arrayBuffer());
        var qrCodeImage = await generateQRCodeImage(qrCodeValue);

        var modifiedPdfBytes = await createPDFWithQRCode(pdfBytes, comprador, qrCodeImage);
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
    // Use a biblioteca qrcode.js para gerar a imagem do QR Code
    var qrCode = new QRCode(document.createElement('div'));
    qrCode.makeCode(qrCodeValue);

    // Converta a imagem do QR Code para um formato que pode ser usado no PDF
    var qrCodeImage = await pdfDoc.embedPng(qrCode._el.firstChild.toDataURL());

    return qrCodeImage;
}

async function createPDFWithQRCode(pdfBytes, comprador, qrCodeImage) {
    var pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    var page = pdfDoc.getPage(0); // Supondo que o QR Code será adicionado à primeira página

    // Defina a posição e o tamanho do QR Code na página
    var qrCodeX = 50;
    var qrCodeY = 450;
    var qrCodeWidth = 120;
    var qrCodeHeight = 120;

    // Adicione a imagem do QR Code à página do PDF
    page.drawImage(qrCodeImage, {
        x: qrCodeX,
        y: qrCodeY,
        width: qrCodeWidth,
        height: qrCodeHeight,
    });

    // Adicione o nome do comprador ao PDF
    var font = await pdfDoc.embedFont(PDFLib.Font.Helvetica);
    var textX = 50;
    var textY = 500;
    page.drawText('Comprador: ' + comprador, { x: textX, y: textY, font });

    // Salve as modificações no PDF
    var modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
}

function displayPDF(pdfBytes) {
    var pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Visualizar PDF
    var viewLink = document.createElement('a');
    viewLink.href = URL.createObjectURL(pdfBlob);
    viewLink.target = '_blank';
    viewLink.innerText = 'Visualizar PDF';

    // Adicionar link de visualização à página
    document.body.appendChild(viewLink);

    // Download PDF
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'seu_ingresso.pdf';
    downloadLink.innerText = 'Baixar PDF';

    // Adicionar link de download à página
    document.getElementById('downloadPdf').addEventListener('click', function () {
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}
