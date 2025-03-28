let video = document.getElementById("video");
let switchCameraBtn = document.getElementById("switchCamera");
let flashlightBtn = document.getElementById("toggleFlashlight");
let restartScannerBtn = document.getElementById("restartScanner");
let qrText = document.getElementById("qrText");
let qrResult = document.getElementById("qrResult");
let copyLinkBtn = document.getElementById("copyLink");
let permissionBox = document.getElementById("permissionBox");
let grantPermissionBtn = document.getElementById("grantPermission");

let currentCamera = "environment"; // Default to back camera
let stream = null;

// Check camera permission
async function checkCameraAccess() {
    try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        let hasCamera = devices.some(device => device.kind === "videoinput");

        if (!hasCamera) {
            alert("No camera found on this device.");
            return;
        }

        let mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStream.getTracks().forEach(track => track.stop());

        permissionBox.style.display = "none"; // Hide permission box
        startCamera();
    } catch (err) {
        console.warn("Camera access denied.");
        permissionBox.style.display = "block"; // Show permission request UI
    }
}

// Request camera permission
async function requestCameraPermission() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        permissionBox.style.display = "none"; // Hide permission box
        startCamera();
    } catch (err) {
        alert("Camera access denied. Please allow it in browser settings.");
    }
}

// Start camera
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
flashlightBtn
