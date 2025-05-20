const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", fileQrCode);

function fileQrCode() {
  const file = fileInput.files[0];
  if (!file) return alert("Selecione um arquivo.");

  const formData = new FormData();
  formData.append("imagem_qr", file);

  fetch("http://localhost:5500/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Texto extraído do QR Code:", data.texto);
      console.log("Código:", data.codigo);
      console.log("Localizador:", data.localizador);

      const novoItem = {
        texto: data.texto,
        codigo: data.codigo,
        localizador: data.localizador,
        posicao: data.posicao,
      };

      const armazenamento = localStorage.getItem("armazem");
      let armazem = [];

      if (armazenamento) {
        armazem = JSON.parse(armazenamento);
      }

      armazem.push(novoItem);
      localStorage.setItem("armazem", JSON.stringify(armazem));

      console.log("Armazém atualizado:", armazem);
    })
    .catch((err) => {
      console.error("Erro na requisição:", err);
    });
}
