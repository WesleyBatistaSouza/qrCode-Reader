const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", fileQrCode);
// document.getElementById("fileInput").addEventListener("change", fileQrCode);

function fileQrCode() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) return alert("Selecione um arquivo.");

  const formData = new FormData();
  formData.append("imagem_qr", file);

  fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Texto extraído do QR Code:", data.texto);
      console.log("Código:", data.codigo);
      console.log("Localizador:", data.localizador);
    })
    .catch((err) => {
      console.error("Erro na requisição:", err);
    });
}