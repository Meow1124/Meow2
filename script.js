let video = document.getElementById("video");
let switchCameraBtn = document.getElementById("switchCamera");
let flashlightBtn = document.getElementById("toggleFlashlight");
let restartScannerBtn = document.getElementById("restartScanner");
let qrText = document.getElementById("qrText");
let qrResult = document.getElementById("qrResult");
let permissionBox = document.getElementById("permissionBox");
let grantPermissionBtn = document.getElementById("grantPermission");

let currentCamera = "environment"; // Default to back camera
let stream = null;

// Function to check camera permission
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

        // Permission granted
        permissionBox.style.display = "none"; // Hide permission button
        startCamera();
    } catch (err) {
        console.warn("Camera access denied or not yet requested.");
        permissionBox.style.display = "block"; // Show permission button
    }
}

// Function to request camera permission
async function requestCameraPermission() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Hide permission request box after permission is granted
        permissionBox.style.display = "none";
        startCamera();
    } catch (err) {
        alert("Camera access denied. Please enable it in browser settings.");
    }
}

// Function to start camera
async function startCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentCamera }
    });

    video.srcObject = stream;
}

// Switch camera button functionality
switchCameraBtn.onclick = () => {
    currentCamera = currentCamera === "environment" ? "user" : "environment";
    startCamera();
};

// Handle permission request button click
grantPermissionBtn.onclick = () => {
    requestCameraPermission();
};

// Initialize permission check when the page loads
window.onload = () => {
    checkCameraAccess();
};
