"use strict";

let hud;
let ws;
let last_report = {};


let open_in_google_maps = (lat, lon) => {
  let url = `https://www.google.com/maps/@${lat},${lon}m/data=!3m1!1e3`;
  window.open(url, '_blank');
}

let open_skyvector = (lat, lon) => {
  let url = `https://skyvector.com/?ll=${lat},${lon}&chart=301&zoom=3`;
  window.open(url, '_blank');
}

let openIn = (service) => {
  let lat = last_report.latitude;
  let lon = last_report.longitude;

  if (lat === undefined || lat === 'undefined') {
    console.log(`latitude value: ${lat}`);
    lat = 1.1;
  }
  if (lon === undefined || lon === 'undefined') {
    console.log(`longtiude value: ${lon}`);
    lon = 1.1;
  }

  switch (service) {
    case 'skyv':
      open_skyvector(lat, lon);
      break;
    case 'gmaps':
      open_in_google_maps(lat, lon);
      break;
    default:
      console.log(service);
  }
}

let updateHUD = (msg) => {
  if (msg) {
    hud.altitude.innerText = msg.altitude;
    hud.airspeed_true.innerText = msg.airspeed_true;
    hud.flaps.innerText = msg.flaps;
    hud.trim.innerText = msg.trim;
    hud.rudder_trim.innerText = msg.rudder_trim
  } else {
    console.log(msg);
  }
}

ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws`);
ws.onopen = () => {
  console.log("ws open");
  console.log(`ws://${window.location.hostname}:${window.location.port}/ws`);
};
ws.onclose = () => {
  console.log("ws close");
};
ws.onmessage = (e) => {
  let msg = JSON.parse(e.data);
  //console.log("ws data", msg);
  last_report = msg;
  updateHUD(msg);
};

document.addEventListener("DOMContentLoaded", (event) => {
  hud = {
    altitude: document.getElementById("altitude_value"),
    airspeed_true: document.getElementById("airspeed_true_value"),
    flaps: document.getElementById("flaps_value"),
    trim: document.getElementById("trim_value"),
    rudder_trim: document.getElementById("rudder_trim_value"),
  };
  updateHUD();
});

window.onload = (event) => {
  hud = {
    altitude: document.getElementById("altitude_value"),
    airspeed_true: document.getElementById("airspeed_true_value"),
    flaps: document.getElementById("flaps_value"),
    trim: document.getElementById("trim_value"),
    rudder_trim: document.getElementById("rudder_trim_value"),
  };
  updateHUD();
};