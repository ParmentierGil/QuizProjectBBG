using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;
using Plugin.BLE.Abstractions.Exceptions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace HartslagQuiz.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ConnectToBluetoothDevicePage : ContentPage
    {
        IBluetoothLE ble;
        IAdapter adapter;
        ObservableCollection<IDevice> deviceList;
        public ConnectToBluetoothDevicePage()
        {
            InitializeComponent();
            ble = CrossBluetoothLE.Current;
            adapter = CrossBluetoothLE.Current.Adapter;
            deviceList = new ObservableCollection<IDevice>();
            BindingContext = deviceList;
            lvwDevices.ItemsSource = deviceList;
        }

        private async void btnScan_Clicked(object sender, EventArgs e)
        {
            deviceList.Clear();
            adapter.DeviceDiscovered += (s, a) =>
            {
                if (a.Device.Name != null)
                {
                    deviceList.Add(a.Device);
                }
            };
            await adapter.StartScanningForDevicesAsync();
        }

        private async void lvwDevices_ItemSelected(object sender, SelectedItemChangedEventArgs e)
        {
            IDevice selected = lvwDevices.SelectedItem as IDevice;

            if (selected != null)
            {
                try
                {
                    await adapter.ConnectToDeviceAsync(selected);
                    lblConnectionMessage.Text = "Verbonden met de Polar hartslagmeter";
                    lblConnectionMessage.TextColor = Color.Green;
                    Navigation.PushAsync(new EnterLobbyPage(selected));
                }
                catch (DeviceConnectionException ex)
                {
                    lblConnectionMessage.Text = "Kon niet verbinden met de Polar hartslagmeter. Probeer opnieuw.";
                    lblConnectionMessage.TextColor = Color.Red;
                }
            }
        }
    }
}