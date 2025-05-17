function onScann(qrData) {
    const [codigo, posicao] = qrData.split(';');
    
    if(!codigo || !posicao) {
        console.error('Formato do QR Code inválido.');
        
    }
    console.log('QR Code detectado:', qrData);
    console.log('Código:', codigo);
    console.log('Posição:', posicao);

    document.getElementById('status').innerText = 'QR Code detectado! Redirecionando...';
    const formURL = `https://docs.google.com/forms/d/e/1FAIpQLSc252C0y10xv_MSFQTR8zN1niY6g7C_N7sweVk7GffBHArkKg/viewform?usp=pp_url&entry.1877566771=${codigo}&entry.121876877=${posicao}`;

    setTimeout(() => {
        console.log('Redirecionando para:', formURL);
        window.location.href = formURL;
    })
}

new Html5Qrcode("reader").start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScann
)