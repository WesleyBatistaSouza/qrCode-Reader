const scanner = new Html5Qrcode("reader");
let ultimaPosicaoLida = null;
let redirecionado = false;
let scannerAtivo = false;

const startScanCode = document.getElementById("code");
// const startScanPosition = document.getElementById("posicao");

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

function iniciarScannerCode() {
  scanner
    .start({ facingMode: "environment" }, { fps: 10, qrbox: 450 }, onScann)
    .then(() => {
      console.log("Scanner iniciado.");
      scannerAtivo = true;
    })
    .catch((err) => {
      console.error("Erro ao iniciar o scanner:", err);
    });
}
function iniciarScannerPosicao() {
  scanner
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 450 },
      onScanPosition
    )
    .then(() => {
      console.log("Scanner iniciado.");
      scannerAtivo = true;
    })
    .catch((err) => {
      console.error("Erro ao iniciar o scanner:", err);
    });
}

function pararScanner() {
  scanner
    .stop()
    .then(() => {
      console.log("Scanner parado.");
      scannerAtivo = false;
    })
    .catch((err) => {
      console.error("Erro ao parar o scanner:", err);
    });

  startScanCode.innerHTML = "Ler Código";
  startScanCode.style.backgroundColor = "#008000";

  // startScanPosition.innerHTML = "Ler Código";
  // startScanPosition.style.backgroundColor = "#008000";
}



function onScanPosition(posicaoLida) {
  const status = document.getElementById("status");

  const padraoPosicao = /^[A-Z][0-9][A-Z][0-9]$/;

  if (!padraoPosicao.test(posicaoLida)) {
    status.innerHTML = "Posição inválida!";
    status.style.color = "red";
    return "";
  }

  const success = `Posição lida com sucesso! - ${posicaoLida}`;
  status.innerHTML = success;
  status.style.color = "green";

  return posicaoLida;
}

function onScann(qrData) {
  if (redirecionado) return;
  redirecionado = true;
  const dataPosition = onScanPosition(ultimaPosicaoLida);
  const dataCode = qrData;

  const codigoPosicao = `${dataCode};${dataPosition}`;
  const codigoPosicaoSeparado = codigoPosicao.split(";");

  const codigo = codigoPosicaoSeparado[0];
  const posicao = codigoPosicaoSeparado[1];

  const status = document.getElementById("status");

  const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${encodeURIComponent(
    codigo
  )}&entry.121876877=${encodeURIComponent(posicao)}`;

  // https://docs.google.com/forms/d/e/1FAIpQLScq4IFGy7ag2vgMk-_TP90wDPkRdp-zclxDS3gQ9L37D982_w/viewform?usp=pp_url&entry.1257467549=35050922

  const formURLCode = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${encodeURIComponent(
    codigo
  )}`;

  const timestamp = Date.now();

  let saveQrData = JSON.parse(localStorage.getItem("qrCodeData")) || [];

  saveQrData.push({
    codigo: codigo,
    posicao: posicao,
    timestamp: timestamp,
  });

  console.log("Chegou", saveQrData);
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
    const itemCodigo = item.codigo;

    if (itemPosicao === "") {
      
      resultadoQrCode.innerHTML += `${itemCodigo} - sem posição <br>`;
    } else {
      resultadoQrCode.innerHTML += `${itemCodigo} - ${itemPosicao} <br>`;
    }
  });

  if (posicao) {
    const success = "Lido e enviado com sucesso! Deseja ler um novo QR Code?";
    status.innerHTML = success;
    status.style.color = "green";

    const loadingContainer = document.getElementById("loadingContainer");
loadingContainer.classList.remove("hidden");
    setTimeout(() => {
      loadingContainer.classList.add("hidden");
    }, 5000);

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

    pararScanner();
  } else {
    const success = "Lido com sucesso! Contém somente Código";
    status.innerHTML = success;
    status.style.color = "green";

    const formWindow = window.open(formURLCode, "_blank");
    if (formWindow) {
      formWindow.opener = null;
    }
    pararScanner();
  }
}

startScanCode.addEventListener("click", () => {
  if (scannerAtivo) {
    startScanCode.innerHTML = "Ler Código";
    startScanCode.style.backgroundColor = "#008000";
    pararScanner();
  } else {
    startScanCode.innerHTML = "Parar Scanner";
    startScanCode.style.backgroundColor = "#ff1c1c";
    iniciarScannerCode();
  }
});

// startScanPosition.addEventListener("click", () => {
//   if (scannerAtivo) {
//     startScanPosition.innerHTML = "Ler Código";
//     startScanPosition.style.backgroundColor = "#008000";
//     pararScanner();
//   } else {
//     startScanPosition.innerHTML = "Parar Scanner";
//     startScanPosition.style.backgroundColor = "#ff1c1c";
//     iniciarScannerPosicao();
//   }
// });
