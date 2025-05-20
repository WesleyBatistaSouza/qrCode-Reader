const scanner = new Html5Qrcode("reader");
let redirecionado = false;

window.addEventListener("load", () => {
  const historico = JSON.parse(localStorage.getItem("qrCodeData")) || [];
  console.log("Histórico de QR Codes:", historico);
});

window.addEventListener("DOMContentLoaded", () => {
  const resultadoQrCode = document.getElementById("result");
  let saveQrData = JSON.parse(localStorage.getItem("qrCodeData")) || [];
  const agora = Date.now();
  saveQrData = saveQrData.filter(
    (item) => agora - item.timestamp <= 3 * 60 * 1000
  );
  localStorage.setItem("qrCodeData", JSON.stringify(saveQrData));
  resultadoQrCode.innerHTML = "";
  saveQrData.forEach((item) => {
    resultadoQrCode.innerHTML += `${item.codigo} - ${item.posicao} <br>`;
  });
});

function onScann(qrData) {
  if (redirecionado) return;
  redirecionado = true;

  const [codigo, posicao] = qrData.split(";");
  const status = document.getElementById("status");

  const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${encodeURIComponent(
    codigo
  )}&entry.121876877=${encodeURIComponent(posicao)}`;

  const formURLCode = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${encodeURIComponent(
    codigo
  )}`;

  const timestamp = Date.now();

  // Salva o código lido no localStorage
  let saveQrData = JSON.parse(localStorage.getItem("qrCodeData")) || [];

  saveQrData.push({
    codigo: codigo,
    posicao: posicao,
    timestamp: timestamp,
  });

  if (saveQrData.length > 2) {
    console.log("Limite de 3 QR Codes atingido. Removendo o mais antigo.");
    saveQrData = saveQrData.slice(-2); 
  }

  localStorage.setItem("qrCodeData", JSON.stringify(saveQrData));
  console.log("Dados salvos:", saveQrData);

  const resultadoQrCode = document.getElementById("result");
  resultadoQrCode.innerHTML = "";

  saveQrData.forEach((item) => {
    const itemPosicao = item.posicao;
    if(itemPosicao === undefined) {
      resultadoQrCode.innerHTML += `${item.codigo} - sem posição <br>`;
    } else {
      resultadoQrCode.innerHTML += `${item.codigo} - ${item.posicao} <br>`;
    }
  });

  if (posicao) {
    const success = "Lido com sucesso! Contém Código e Posição.";
    status.innerHTML = success;
    status.style.color = "green";

    if (success) {
      status.innerHTML = "Já foi enviado! Deseja ler um novo QR Code?";
      status.style.color = "#111";
    }

    async function openForm() {
      const formWindow = window.open(formURL, "_blank");

      if (formWindow) {
        formWindow.opener = null;
      } else {
        alert("Por favor, permita pop-ups para este site.");
      }
      if (formWindow) {
        formWindow.focus();
      } else {
        alert("Por favor, permita pop-ups para este site.");
      }
    }
    openForm();

    scanner
      .stop()
      .then(() => {
        redirecionado = false;
        console.log("Scanner stopped.");
      })
      .catch((err) => {
        console.error("Erro ao parar o scanner:", err);
      });
    scanner.clear();
    redirecionado = false;
  } else {
    const success = "Lido com sucesso! Contém somente Código";
    status.innerHTML = success;
    status.style.color = "green";

    if (success) {
      status.innerHTML = "Já foi enviado! Deseja ler um novo QR Code?";
      status.style.color = "brown";
    }

    const formWindow = window.open(formURLCode, "_blank");
    if (formWindow) {
      formWindow.opener = null;
    }

    scanner
      .stop()
      .then(() => {
        redirecionado = false;
        console.log("Scanner stopped.");
      })
      .catch((err) => {
        console.error("Erro ao parar o scanner:", err);
      });
    scanner.clear();
    redirecionado = false;
  }
}

const buttonStartScan = document.getElementById("startScan");
const buttonStopScan = document.getElementById("stopScan");

buttonStartScan.addEventListener("click", () => {
  scanner
    .start({ facingMode: "environment" }, { fps: 10, qrbox: 450 }, onScann)
    .catch((err) => console.error("Erro ao iniciar o scanner:", err));
});

buttonStopScan.addEventListener("click", () => {
  scanner
    .stop()
    .then(() => {
      redirecionado = false;
      console.log("Scanner stopped.");
    })
    .catch((err) => {
      console.error("Erro ao parar o scanner:", err);
    });
  scanner.clear();
  redirecionado = false;
});
