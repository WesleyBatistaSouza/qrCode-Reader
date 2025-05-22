const scanner = new Html5Qrcode("reader");
let redirecionado = false;
let scannerAtivo = false;

const startScanCode = document.getElementById("code");

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
    resultadoQrCode.innerHTML += `${item.codigo}<br>`;
  });
});

function iniciarScannerCode() {
  redirecionado = false;
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
  scanner.clear();
  redirecionado = false;
}

let formConfig = {
  baseUrl: "",
  entryCodigo: "",
};

const salvarFormBtn = document.getElementById("salvar-form");

salvarFormBtn.addEventListener("click", () => {
  const urlInput = document.getElementById("form-url").value;

  try {
    const url = new URL(urlInput);
    const params = new URLSearchParams(url.search);

    formConfig.baseUrl = url.origin + url.pathname;
    const entryKeys = [];
    for (const [key] of params.entries()) {
      if (key.startsWith("entry.")) {
        entryKeys.push(key);
      }
    }

    if (entryKeys.length === 0) {
      alert("URL inválida: nenhum parâmetro 'entry.xxx' encontrado.");
      return;
    }

    formConfig.entryCodigo = entryKeys[0];

    localStorage.setItem("formConfig", JSON.stringify(formConfig));
    alert("Formulário salvo com sucesso!");
  } catch (error) {
    alert("URL inválida!");
    console.error(error);
  }
});

function onScann(qrData) {
  if (redirecionado) return;
  redirecionado = true;

  const beep = document.getElementById("beep-sound");
  beep.play();

  const codigo = qrData;
  const status = document.getElementById("status");

  const formConfigStorage =
    JSON.parse(localStorage.getItem("formConfig")) || {};
  const baseUrl = formConfigStorage.baseUrl;
  const entryCodigo = formConfigStorage.entryCodigo;
  console.log("Base URL:", baseUrl);
  console.log("Entry Código:", entryCodigo);
  const formURLCode = `${baseUrl}?usp=pp_url&${entryCodigo}=${encodeURIComponent(
    codigo
  )}`;
  console.log("Form URL:", formURLCode);

  const timestamp = Date.now();
  let saveQrData = JSON.parse(localStorage.getItem("qrCodeData")) || [];

  saveQrData.push({
    codigo: codigo,
    timestamp: timestamp,
  });

  if (saveQrData.length > 2) {
    saveQrData = saveQrData.slice(-2);
  }

  localStorage.setItem("qrCodeData", JSON.stringify(saveQrData));

  const resultadoQrCode = document.getElementById("result");
  resultadoQrCode.innerHTML = "";

  saveQrData.forEach((item) => {
    resultadoQrCode.innerHTML += `${item.codigo}<br>`;
  });

  const success = "Lido com sucesso! Contém somente Código";
  status.innerHTML = success;
  status.style.color = "green";

  const formWindow = window.open(formURLCode, "_blank");
  if (formWindow) {
    formWindow.opener = null;
    formWindow.focus();
  } else {
    alert("Por favor, permita pop-ups para este site.");
  }

  pararScanner();
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