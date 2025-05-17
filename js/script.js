
 const scanner = new Html5Qrcode("reader");
    let redirecionado = false;

    function onScann(qrData) {
      if (redirecionado) return;

      const [codigo, posicao] = qrData.split(";");

      if (!codigo || !posicao) {
        console.error("Formato do QR Code inválido.");
        return;
      }

      document.getElementById("status").innerText = "QR Code detectado! Redirecionando...";

      const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${codigo}&entry.121876877=${posicao}`;

      console.log("QR Code detectado:", qrData);
      console.log("Código:", codigo);
      console.log("Posição:", posicao);
      console.log("Redirecionando para:", formURL);

      redirecionado = true;

      scanner.stop().then(() => {
        console.log("Leitura do QR Code parada.");
        window.location.href = formURL;
      }).catch(err => {
        console.error("Erro ao parar o scanner:", err);
        window.location.href = formURL;
      });
    }

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      onScann
    ).catch(err => console.error("Erro ao iniciar o scanner:", err));