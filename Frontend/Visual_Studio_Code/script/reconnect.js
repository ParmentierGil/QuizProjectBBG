

function connect() {
  exponentialBackoff(
    3 /* max retries */,
    2 /* seconds delay */,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      bluetoothDevice.gatt.connect();
    },
    function success() {
      console.log('> Bluetooth Device connected. Try disconnect it now.');
      console.log(bluetoothDevice);
    },
    function fail() {
      time('Failed to reconnect.');
    }
  );
}
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry()
    .then(result => success(result))
    .catch(_ => {
      if (max === 0) {
        return fail();
      }
      time('Retrying in ' + delay + 's... (' + max + ' tries left)');
      setTimeout(function() {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    });
}

function time(text) {
  console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}

const init = function() {
  connect();
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('loaded');
  init();
});
