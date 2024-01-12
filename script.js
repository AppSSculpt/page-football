function createQRCode(qrCodeValue) {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: qrCodeValue,
        width: 120,
        height: 120,
    });
}
  // Adiciona um ouvinte de clique ao link de download
  document.getElementById('downloadCustomImage').addEventListener('click', function() {
    var btn = this;
    btn.classList.add('downloading');
    
    // Simula a geração e download da imagem (substitua isso pelo seu código de geração de QR Code)

    setTimeout(function() {
        btn.classList.remove('downloading');
    }, 3000);
});

// Simula a criação da imagem personalizada e download
function createCustomImageAndDownload() {
    var container = document.querySelector(".custom-qrcode-container");
    
    html2canvas(container).then(function(canvas) {
        var customImage = new Image();
        customImage.src = canvas.toDataURL("image/png");

        var downloadLink = document.createElement("a");
        downloadLink.href = customImage.src;
        downloadLink.download = comprador + "_ingresso.png";

        downloadLink.click();
    });
}

var downloadButton = document.getElementById("downloadCustomImage");
if (downloadButton) {
    downloadButton.addEventListener("click", createCustomImageAndDownload);
}

// Obtém os parâmetros da URL (simula a obtenção dos dados do QR Code e do comprador)
var urlParams = new URLSearchParams(window.location.search);
var qrCodeValue = urlParams.get("qr_code");
var comprador = urlParams.get("comprador");

createQRCode(qrCodeValue);

// Insere o código e nome do comprador nos elementos HTML
document.getElementById('comprador').textContent = "" + comprador;
