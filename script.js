let qrScanner;
let flashlightEnabled = false;
let currentCameraId = null;
let cameraList = [];
let cameraIndex = 0;

// Function to start the QR scanner with a specific camera
function startScanner(cameraId = null) {
    if (qrScanner) {
        qrScanner.clear();
    }

    qrScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    
    qrScanner.render((decodedText) => {
        handleScanResult(decodedText);
    }, cameraId ? { deviceId: { exact: cameraId } } : undefined);
}

// Handle scan result based on device type
function handleScanResult(decodedText) {
    if (window.innerWidth < 768) {
        window.open(decodedText, "_blank"); // Mobile: Open link in new tab
    } else {
        document.getElementById("result").innerText = decodedText; // PC: Show link
        document.getElementById("pc-result").style.display = "block";
    }
}

// Function to toggle flashlight
function toggleFlashlight() {
    const videoElement = document.querySelector("video");
    const track = videoElement?.srcObject?.getVideoTracks()[0];

    if (track && track.getCapabilities().torch) {
        track.applyConstraints({ advanced: [{ torch: !flashlightEnabled }] });
        flashlightEnabled = !flashlightEnabled;
    } else {
        alert("Flashlight not supported on this device.");
    }
}

// Function to get available cameras
async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        cameraList = devices.filter(device => device.kind === "videoinput");

        if (cameraList.length > 0) {
            currentCameraId = cameraList[0].deviceId;
            startScanner(currentCameraId);
        }
    } catch (error) {
        console.error("Error getting cameras:", error);
    }
}

// Function to switch cameras
function switchCamera() {
    if (cameraList.length > 1) {
        cameraIndex = (cameraIndex + 1) % cameraList.length;
        currentCameraId = cameraList[cameraIndex].deviceId;
        startScanner(currentCameraId);
    } else {
        alert("No multiple cameras detected.");
    }
}

// Function to scan QR from file
function scanFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        Html5Qrcode.scanFile(file, true)
            .then(decodedText => {
                handleScanResult(decodedText);
            })
            .catch(() => alert("Could not scan QR code from image."));
    };
    reader.readAsDataURL(file);
}

// Function to copy scanned result
function copyResult() {
    const text = document.getElementById("result").innerText;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard: " + text);
}

// Initialize camera selection on mobile
if (window.innerWidth < 768) {
    getCameras();
}

function updateFileName(event) {
    const fileInput = event.target;
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file chosen";
    document.getElementById("file-name").innerText = fileName;
            }
        
