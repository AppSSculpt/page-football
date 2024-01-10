<!-- Adicione este script -->
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function() {
        // Obtém os parâmetros da URL (simula a obtenção dos dados do QR Code e do comprador)
        var urlParams = new URLSearchParams(window.location.search);
        var qrCodeValue = urlParams.get("qr_code");
        var comprador = urlParams.get("comprador");

        // Crie uma instância do objeto QRCode com os parâmetros adequados
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            text: qrCodeValue,
            width: 120,
            height: 120,
        });

        // Adiciona um ouvinte de clique ao botão de download
        document.getElementById('downloadCustomImage').addEventListener('click', function() {
            // Crie uma instância do objeto jsPDF
            const pdf = new jsPDF();

            // Obtém a imagem do QR Code
            const qrcodeImage = document.getElementById("qrcode");

            // Adiciona a imagem ao PDF
            pdf.addImage(qrcodeImage, 'JPEG', 10, 10, 90, 90);

            // Adiciona texto ou outros elementos ao PDF, se necessário
            pdf.text(10, 110, "Comprador: " + comprador);

            // Salva o PDF ou exibe no navegador
            pdf.save('seu_ingresso.pdf');
        });
    });
</script>
