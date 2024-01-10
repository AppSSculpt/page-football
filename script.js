// Certifique-se de incluir a biblioteca pdf-lib no seu projeto
// Você pode encontrá-la em https://github.com/Hopding/pdf-lib

document.addEventListener('DOMContentLoaded', async function () {
    var qrCodeValue = getParameterValue('qr_code');
    var comprador = getParameterValue('comprador');

    try {
        await createAndDownloadPDF(comprador, qrCodeValue);
    } catch (error) {
        console.error('Erro ao criar PDF:', error);
    }
});

async function createAndDownloadPDF(comprador, qrCodeValue) {
    // Substitua 'INGRESSO_PAC_2.pdf' pelo caminho do seu modelo de ingresso
    var pdfBytes = await fetch('INGRESSO_PAC_2.pdf').then(res => res.arrayBuffer());
    var pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    // Crie uma nova página no PDF
    var page = pdfDoc.addPage();

    // Defina a fonte e o tamanho do texto
    page.drawText('Comprador: ' + comprador, { x: 50, y: 500 });

    // Gere uma imagem QR Code usando a biblioteca online
    var qrCodeImageUrl = await generateQRCodeImageUrl(qrCodeValue);
    var qrCodeImageBytes = await fetch(qrCodeImageUrl).then(res => res.arrayBuffer());

    // Insira a imagem QR Code no PDF
    page.drawImage(qrCodeImageBytes, { x: 50, y: 400, width: 100, height: 100 });

    // Salve as modificações no PDF
    var modifiedPdfBytes = await pdfDoc.save();

    // Baixe automaticamente o PDF
    savePDF(modifiedPdfBytes);
}

async function generateQRCodeImageUrl(qrCodeValue) {
    // Use a biblioteca que você está usando para gerar QR Codes
    // Substitua este trecho de código pela lógica específica da sua biblioteca para gerar QR Codes
    // Este exemplo usa a biblioteca QR Code Generator (https://goqr.me/api/)
    var apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeValue)}&size=100x100`;
    return apiUrl;
}

function savePDF(pdfBytes) {
    var pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    var downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'seu_ingresso.pdf';
    downloadLink.click();
}

function getParameterValue(parameterName) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}
