// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDbA-xi8tM5Zvyxn-S1fqDj2gy3CXZi-04",
  authDomain: "test-41d64.firebaseapp.com",
  databaseURL: "https://test-41d64-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-41d64",
  storageBucket: "test-41d64.firebasestorage.app",
  messagingSenderId: "255764597948",
  appId: "1:255764597948:web:eedcc54ab6703d497954b9",
  measurementId: "G-VQT3ZHCX9R"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.database();

let currentPen = "chuongcuu";
const body = document.getElementById("farmBody");
const timeInput = document.getElementById("timePicker");
const imgTime = document.getElementById("imgTime");

// Start App
function startApp() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("mainPage").style.display = "block";
  body.style.backgroundImage = "url('chuongcuu.jpg')";
  document.getElementById("cuuControls").style.display = "flex";
  document.getElementById("gaControls").style.display = "none";
}

// Back
function goBack() {
  document.getElementById("startPage").style.display = "flex";
  document.getElementById("mainPage").style.display = "none";
  body.style.backgroundImage = "url('mainbackground.jpg')";
}

// Switch pen
function switchPen(type) {
  currentPen = `chuong${type}`;
  body.style.backgroundImage = `url('${currentPen}.jpg')`;
  document.getElementById("cuuControls").style.display = type === "cuu" ? "flex" : "none";
  document.getElementById("gaControls").style.display = type === "ga" ? "flex" : "none";
  loadData(currentPen);
}

// Update day/night image
function updateImageByTime(timeStr) {
  const hour = parseInt(timeStr.split(":")[0]);
  imgTime.src = (hour >= 6 && hour < 18) ? "ngay.gif" : "dem.gif";
}

// Load data from Firebase
function loadData(pen) {
   // Đọc dữ liệu môi trường từ node riêng
   db.ref("/moitruonghientai/temperature").on("value", snap => {
    document.getElementById("temperature").innerText = snap.val();
  });
  db.ref("/moitruonghientai/humidity").on("value", snap => {
    document.getElementById("humidity").innerText = snap.val();
  });
  db.ref("/moitruonghientai/gas").on("value", snap => {
    document.getElementById("gas").innerText = snap.val();
  });

  const penSuffix = pen === "chuongga" ? "Ga" : "Cuu";

  ["light", "door", "music"].forEach(device => {
    db.ref(`/${pen}/${device}`).once("value", snap => {
      const isOn = snap.val() === 1;
      const imgId = `img${device.charAt(0).toUpperCase() + device.slice(1)}${penSuffix}`;
      const imgSrc = {
        light: isOn ? "den1.gif" : "den.png",
        door: isOn ? "door1.gif" : "door.png",
        music: isOn ? "nhac1.gif" : "nhac.png"
      }[device];
      document.getElementById(imgId).src = imgSrc;
    });
  });
}

// Toggle device per pen
function toggleDevice(device, isOn) {
  const pen = currentPen;
  const value = isOn ? 1 : 0;
  db.ref(`/${pen}/${device}`).set(value);

  const penSuffix = pen === "chuongga" ? "Ga" : "Cuu";

  const imgId = `img${device.charAt(0).toUpperCase() + device.slice(1)}${penSuffix}`;
  const imgSrc = {
    light: isOn ? "den1.gif" : "den.png",
    door: isOn ? "door1.gif" : "door.png",
    music: isOn ? "nhac1.gif" : "nhac.png"
  }[device];

  document.getElementById(imgId).src = imgSrc;
}

// Auto set time image
window.addEventListener("load", () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${mins}`;
  timeInput.value = timeStr;
  updateImageByTime(timeStr);
  loadData("chuongcuu"); // Default load
});

timeInput.addEventListener("change", function () {
  updateImageByTime(this.value);
});


    

