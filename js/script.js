function onScanSuccess(qrData) {
        document.getElementById("status").innerText =
          "QR Code detectado! Redirecionando...";

        const [codigo, localizador] = qrData.split(";");

        // Redireciona para o Google Forms com os dados
        const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSdfgQWERTYUIOPASDFGHJKLJKLJKLJKLJKLJKLJKL/viewform?usp=pp_url&entry.1234567890=${codigo}&entry.0987654321=${localizador}`;

        window.location.href = formURL;
      }

      new Html5Qrcode("reader").start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        onScanSuccess
      );