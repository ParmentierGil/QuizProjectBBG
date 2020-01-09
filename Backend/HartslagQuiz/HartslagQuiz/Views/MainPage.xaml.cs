using com.shephertz.app42.gaming.multiplayer.client;
using HartslagQuiz.Models;
using HartslagQuiz.Repos;
using Newtonsoft.Json;
using Plugin.BLE;
using Plugin.BLE.Abstractions.Contracts;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace HartslagQuiz.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class MainPage : ContentPage
    {
        Gamelobby ActiveGame;
        Quizmaster ActiveQuizmaster;

        IBluetoothLE ble;
        IAdapter adapter;
        ObservableCollection<IDevice> deviceList;
        public MainPage()
        {

            InitializeComponent();
            Bluetooth();
        }

        private void Bluetooth()
        {
            ble = CrossBluetoothLE.Current;
            adapter = CrossBluetoothLE.Current.Adapter;
            deviceList = new ObservableCollection<IDevice>();
        }

        private void btnLeave_Clicked(object sender, EventArgs e)
        {
            ActiveGame.Exit();
        }

        private void btnMakeLobby_Clicked(object sender, EventArgs e)
        {
            ActiveQuizmaster = new Quizmaster();
            ActiveGame = new Gamelobby(ActiveQuizmaster);
            while (ActiveGame.ActiveRoom == null)
            {
                Console.WriteLine("Waiting for room to be made");
            }
            RoomCode.Text = ActiveGame.ActiveRoom.JoinCode.ToString();
        }

        private void Button_Clicked(object sender, EventArgs e)
        {

        }

        private async void btnScan_Clicked(object sender, EventArgs e)
        {
            deviceList.Clear();
            adapter.DeviceDiscovered += (s, a) =>
            {
                deviceList.Add(a.Device);
            };
            await adapter.StartScanningForDevicesAsync();
            
        }
    }
}
