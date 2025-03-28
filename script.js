let video = document.getElementById("video");
let switchCameraBtn = document.getElementById("switchCamera");
let flashlightBtn = document.getElementById("toggleFlashlight");
let restartScannerBtn = document.getElementById("restartScanner");
let qrText = document.getElementById("qrText");
let qrResult = document.getElementById("qrResult");
let copyLinkBtn = document.getElementById("copyLink");

let currentCamera = "environment"; // Default to back camera
let stream = null;

// Start camera with back camera
async function startCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentCamera }
    });

    video.srcObject = stream;
}

// Switch camera
switchCameraBtn.onclick = () => {
    currentCamera = currentCamera === "environment" ? "user" : "environment";
    startCamera();
};

// QR Code Scanner
async function scanQRCode() {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });

            if (code) {
                qrResult.style.display = "block";
                qrText.innerText = code.data;

                if (window.innerWidth < 768) {
                    window.open(code.data, "_blank");
                }
            }
        }
    }, 500);
}

// Flashlight toggle
flashlightBtn.onclick = async () => {
    let track = stream.getVideoTracks()[0];
    let capabilities = track.getCapabilities();

    if (capabilities.torch) {
        let settings = track.getSettings();
        let constraints = { advanced: [{ torch: !settings.torch }] };
        await track.applyConstraints(constraints);
    }
};

// Restart scanner
restartScannerBtn.onclick = () => {
    startCamera();
};

// Copy link button
copyLinkBtn.onclick = () => {
    navigator.clipboard.writeText(qrText.innerText);
    alert("Link copied!");
};

// Start everything
startCamera();
scanQRCode();
