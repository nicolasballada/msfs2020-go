"use strict";

let hud;
let ws;
let last_report = {};


let open_in_google_maps = (lat, lon) => {
  let url = `https://www.google.com/maps/@${lat},${lon},14z`;
  window.open(url, '_blank');
}

let open_skyvector = (lat, lon) => {
  let url = `https://skyvector.com/?ll=${lat},${lon}&chart=301&zoom=1`;
  window.open(url, '_blank');
}

let open_skyvector_ifrLo = (lat, lon) => {
  let url = `https://skyvector.com/?ll=${lat},${lon}&chart=302&zoom=3`;
  window.open(url, '_blank');
}

let open_skyvector_ifrHi = (lat, lon) => {
  let url = `https://skyvector.com/?ll=${lat},${lon}&chart=304&zoom=1`;
  window.open(url, '_blank');
}

let copyLongLat = () => {
  let lat = last_report.latitude;
  let long = last_report.longitude;

  navigator.clipboard.writeText(`${lat} ${long}`);
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
    case 'skyvVFR':
      open_skyvector(lat, lon);
      break;
    case 'skyvLo':
      open_skyvector_ifrLo(lat, lon);
      break;
    case 'skyvHi':
      open_skyvector_ifrHi(lat, lon);
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
    let alt = msg.altitude;
    let speed = msg.airspeed_true;
    let flaps = msg.flaps;
    let eTrim = msg.trim;
    let rTrim = msg.rudder_trim;
    let modETrim = parseFloat(eTrim);
    let modRTrim = parseFloat(rTrim);
    let modFlaps = parseFloat(flaps);
    modETrim = modETrim + 100;
    modRTrim = modRTrim + 100;

    /* if (modETrim < 109) {
      eTrim = `&nbsp;&nbsp;${eTrim}`;
    } else if (modETrim === 100) {
      etrim = eTrim
    } else if (modETrim > 91) {
      eTrim = `&nbsp;&nbsp; ${eTrim}`;
    } else if (modETrim > 1) {
      eTrim = `&nbsp; ${eTrim}`;
    } else if (modETrim < 199) {
      eTrim = `&nbsp;${eTrim}`;
    } else {
      eTrim = eTrim;
    }

    if (modRTrim < 109) {
      rTrim = `&nbsp;&nbsp;${rTrim}`;
    } else if (modRTrim === 100) {
      rtrim = rTrim
    } else if (modRTrim > 91) {
      rTrim = `&nbsp;&nbsp;+${rTrim}`;
    } else if (modRTrim > 1) {
      rTrim = `&nbsp;+${rTrim}`;
    } else if (modRTrim < 199) {
      rTrim = `&nbsp;${rTrim}`;
    } else {
      rTrim = rTrim;
    } */

    if (modETrim >= 46 && modETrim <= 80) {
      hud.etrim.style.borderColor = '#36911A';
    } else {
      hud.etrim.style.borderColor = '#cccccc';
    }
    if (modRTrim >= 150) {
      hud.rtrim.style.borderColor = '#36911A';
    } else {
      hud.rtrim.style.borderColor = '#cccccc';
    }
    if (modFlaps === 0) {
      hud.flaps.style.color = '#b0b0b0';
    } else if (modFlaps === 10) {
      hud.flaps.style.color = '#2448ff';
    } else if (modFlaps === 20) {
      hud.flaps.style.color = '#80c6ff';
    } else if (modFlaps === 35) {
      hud.flaps.style.color = '#ffffff';
    } else {
      hud.flaps.style.color = '#fffce6';
    }

    hud.altitude.innerHTML = alt;
    hud.airspeed_true.innerHTML = speed;
    hud.flaps.innerHTML = flaps;
    hud.trim.innerHTML = eTrim;
    hud.rudder_trim.innerHTML = rTrim;
    hud.etrim.value = modETrim;
    hud.rtrim.value = modRTrim;
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
    etrim: document.getElementById("etrim"),
    rudder_trim: document.getElementById("rudder_trim_value"),
    rtrim: document.getElementById("rtrim"),
  };
  updateHUD();
});

window.onload = (event) => {
  hud = {
    altitude: document.getElementById("altitude_value"),
    airspeed_true: document.getElementById("airspeed_true_value"),
    flaps: document.getElementById("flaps_value"),
    trim: document.getElementById("trim_value"),
    etrim: document.getElementById("etrim"),
    rudder_trim: document.getElementById("rudder_trim_value"),
    rtrim: document.getElementById("rtrim"),
  };
  updateHUD();
};