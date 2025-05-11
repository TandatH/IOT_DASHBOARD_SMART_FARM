// Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyDbA-xi8tM5Zvyxn-S1fqDj2gy3CXZi-04",
  authDomain: "test-41d64.firebaseapp.com",
  databaseURL: "https://test-41d64-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-41d64",
  storageBucket: "test-41d64.appspot.com",
  messagingSenderId: "255764597948",
  appId: "1:255764597948:web:eedcc54ab6703d497954b9",
  measurementId: "G-VQT3ZHCX9R"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.database();

const body = document.getElementById("farmBody");
const timeInput = document.getElementById("timePicker");
const imgTime = document.getElementById("imgTime");

let currentPen = "chuongcuu";  // Chuồng hiện tại
let previousPen = "";          // Chuồng trước đó

// Start App
function startApp() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("mainPage").style.display = "block";
  body.style.backgroundImage = "url('chuongcuu.jpg')";
}

// Back
function goBack() {
  document.getElementById("startPage").style.display = "flex";
  document.getElementById("mainPage").style.display = "none";
  body.style.backgroundImage = "url('mainbackground.jpg')";
}

// Switch pen
function switchPen(type) {
  previousPen = currentPen;
  currentPen = type === "cuu" ? "chuongcuu" : "chuongga";

  // Hủy lắng nghe chuồng cũ
  ["temperature", "humidity", "gas", "light", "door", "music"].forEach(key => {
    db.ref(`/${previousPen}/${key}`).off();
  });

  body.style.backgroundImage = `url('${currentPen}.jpg')`;
  loadData(currentPen);
}

// Update day/night image
function updateImageByTime(timeStr) {
  const hour = parseInt(timeStr.split(":")[0]);
  imgTime.src = (hour >= 6 && hour < 18) ? "ngay.gif" : "dem.gif";
}

// Load data from Firebase
function loadData(pen) {
  db.ref(`/${pen}/temperature`).on("value", snap => {
    document.getElementById("temperature").innerText = snap.val();
  });
  db.ref(`/${pen}/humidity`).on("value", snap => {
    document.getElementById("humidity").innerText = snap.val();
  });
  db.ref(`/${pen}/gas`).on("value", snap => {
    document.getElementById("gas").innerText = snap.val();
  });

  ["light", "door", "music"].forEach(device => {
    db.ref(`/${pen}/${device}`).on("value", snap => {
      const isOn = snap.val() === 1;
      let imgId = "";
      let imgSrc = "";

      if (device === "light") {
        imgId = "imgLight";
        imgSrc = isOn ? "den1.gif" : "den.png";
      } else if (device === "door") {
        imgId = "imgDoor";
        imgSrc = isOn ? "door1.gif" : "door.png";
      } else if (device === "music") {
        imgId = "imgMusic";
        imgSrc = isOn ? "nhac1.gif" : "nhac.png";
      }

      document.getElementById(imgId).src = imgSrc;
    });
  });
}

// Toggle device
function toggleDevice(device, isOn) {
  const value = isOn ? 1 : 0;

  db.ref(`/${currentPen}/${device}`).set(value);

  let imgId = "";
  let imgSrc = "";

  if (device === "light") {
    imgId = "imgLight";
    imgSrc = isOn ? "den1.gif" : "den.png";
  } else if (device === "door") {
    imgId = "imgDoor";
    imgSrc = isOn ? "door1.gif" : "door.png";
  } else if (device === "music") {
    imgId = "imgMusic";
    imgSrc = isOn ? "nhac1.gif" : "nhac.png";
  }

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
  loadData(currentPen); // Load chuồng mặc định
});

timeInput.addEventListener("change", function () {
  updateImageByTime(this.value);
});
