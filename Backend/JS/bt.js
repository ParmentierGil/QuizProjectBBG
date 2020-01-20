var App = (function(_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.state = { chartData: [] };
    _this.BLEConnect = _this.BLEConnect.bind(_this);
    return _this;
  }

  _createClass(App, [
    {
      key: 'heartRateChange',
      value: function heartRateChange(event) {
        var value = event.target.value;
        var currentHeartRate = value.getUint8(1);
        var chartData = [].concat(_toConsumableArray(this.state.chartData), [{ time: +Date.now(), heartRate: currentHeartRate }]);
        this.setState({ chartData: chartData });
        console.log('currentHeartRate:', currentHeartRate);
      }
    },
    {
      key: 'BLEConnect',
      value: function BLEConnect() {
        var _this2 = this;

        return navigator.bluetooth
          .requestDevice({ filters: [{ services: ['heart_rate'] }] })
          .then(function(device) {
            return device.gatt.connect();
          })
          .then(function(server) {
            return server.getPrimaryService('heart_rate');
          })
          .then(function(service) {
            return service.getCharacteristic('heart_rate_measurement');
          })
          .then(function(character) {
            _this2.characteristic = character;
            return _this2.characteristic.startNotifications().then(function(_) {
              _this2.characteristic.addEventListener('characteristicvaluechanged', _this2.heartRateChange.bind(_this2));
            });
          })
          .catch(function(e) {
            return console.error(e);
          });
      }
    },
    {
      key: 'render',
      value: function render() {
        var currentHearRate = this.state.chartData[this.state.chartData.length - 1];
        var margins = { left: 100, right: 100, top: 20, bottom: 50 };
        var chartSeries = [
          {
            field: 'heartRate',
            color: '#C20000'
          }
        ];

        return _react2.default.createElement(
          'div',
          { id: 'app' },
          _react2.default.createElement(_RaisedButton2.default, { onClick: this.BLEConnect, label: 'Start Monitoring!', primary: true }),
          currentHearRate && _react2.default.createElement('p', null, 'Current Heart Rate: ', _react2.default.createElement('span', { style: { color: '#C20000' } }, currentHearRate.heartRate)),
          _react2.default.createElement(_reactD3Basic.LineChart, {
            margins: margins,
            data: this.state.chartData,
            width: 1600,
            height: 700,
            chartSeries: chartSeries,
            x: function x(d) {
              return d.time;
            },
            xScale: 'time'
          })
        );
      }
    }
  ]);

  return App;
})(_react.Component);

exports.default = App;
