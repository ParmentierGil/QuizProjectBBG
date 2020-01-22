function isWebBLEAvailable() {
  if (!navigator.bluetooth) {
    console.log('Not available!');
    return false;
  }
  return true;
}

function handleHeartRateMeasurementCharacteristic(characteristic) {
  return characteristic.startNotifications().then(char => {
    characteristic.addEventListener('characteristicvaluechanged', onHeartRateChanged);
  });
}

function onHeartRateChanged(event) {
  const characteristic = event.target;
  console.log(parseHeartRate(characteristic.value));
  // document.querySelector('#HeartRate').innerHTML = parseHeartRate(characteristic.value).heartRate;
  // geef hartslag weer
}

function parseHeartRate(data) {
  const flags = data.getUint8(0);
  const rate16Bits = flags & 0x1;
  const result = {};
  let index = 1;
  if (rate16Bits) {
    result.heartRate = data.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  } else {
    result.heartRate = data.getUint8(index);
    index += 1;
  }

  return result;
}

function getDeviceInfo() {
  let chosenHeartRateService = null;
  console.log('Requesting device info');
  navigator.bluetooth
    .requestDevice({
      filters: [
        {
          services: ['heart_rate']
        }
      ]
    })
    .then(device => device.gatt.connect())

    .then(server => server.getPrimaryService('heart_rate'))
    .then(service => {
      chosenHeartRateService = service;
      Promise.all(service.getCharacteristic(service.getCharacteristic('heart_rate_measurement').then(handleHeartRateMeasurementCharacteristic)));
    })
    .then(ShowButton);
}
function ShowButton() {
  document.getElementById('Volgende').style.display = 'block';
  document.getElementById('Zoekweg').style.display = 'none';
}
document.querySelector('form').addEventListener('submit', function(event) {
  event.stopPropagation();
  event.preventDefault();

  if (isWebBLEAvailable) {
    getDeviceInfo();
  }
});
