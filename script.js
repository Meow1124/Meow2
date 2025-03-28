// Start QR scanner immediately on mobile
function startScanner() {
    const qrScanner = new Html5Qrcode("reader");

    qrScanner.start(
        { facingMode: "environment" }, // Use the back camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            handleScanResult(decodedText);
        }
    );
}

// Handle scan result (Auto Redirect on Mobile)
function handleScanResult(decodedText) {
    if (window.innerWidth < 768) {
        window.open(decodedText, "_blank"); // Mobile: Open link in new tab
    } else {
        document.getElementById("result").value = decodedText; // PC: Show link
        document.getElementById("pc-result").style.display = "block";
    }
}

// Scan QR code from an uploaded file
function scanFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const qrScanner = new Html5Qrcode("reader");
    qrScanner.scanFile(file, true)
        .then((decodedText) => {
            handleScanResult(decodedText);
        })
        .catch((error) => {
            alert("QR Code not detected. Try another image.");
        });
}

// Copy link to clipboard (PC mode)
function copyLink() {
    const resultInput = document.getElementById("result");
    resultInput.select();
    document.execCommand("copy");
    alert("Link copied!");
}
