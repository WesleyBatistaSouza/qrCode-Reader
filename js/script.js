const scanner = new Html5Qrcode("reader");
let redirecionado = false;

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

  if (posicao) {
    status.innerHTML = "Lido com sucesso! Contém Código e Posição.";
    status.style.color = "green";

    console.log("Código lido com sucesso!");
    console.log("Código:", codigo);
    console.log("Posição:", posicao);

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
    status.innerHTML = "Lido com sucesso! Contém somente Código";
    status.style.color = "green";

    console.log("Código lido com sucesso!");
    console.log("Código:", codigo);
    console.log("Posição:", posicao);

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
// scanner
//   .start({ facingMode: "environment" }, { fps: 10, qrbox: 450 }, onScann)
//   .catch((err) => console.error("Erro ao iniciar o scanner:", err));
