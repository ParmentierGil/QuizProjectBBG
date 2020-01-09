using HartslagQuiz.Models;
using Plugin.BLE.Abstractions.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace HartslagQuiz.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EnterLobbyPage : ContentPage
    {
        IDevice HeartbeatSensor;
        public EnterLobbyPage(IDevice connecteddevice)
        {
            HeartbeatSensor = connecteddevice;
            InitializeComponent();
            ReadHeartbeatData();
        }

        private async void ReadHeartbeatData()
        {
            var services = await HeartbeatSensor.GetServicesAsync();
            foreach (var service in services)
            {
                if (service.Name == "Heart Rate")
                {
                    var chars = await service.GetCharacteristicsAsync();
                    bool canr = chars[0].CanRead;
                    var descs = await chars[0].GetDescriptorsAsync();
                    bool canw = chars[0].CanWrite;
                    await chars[0].StartUpdatesAsync();
                    chars[0].ValueUpdated += (s, e) =>
                    {
                        Heartbeat hb = new Heartbeat(e.ToString().Length, DateTime.Now);
                    };
                }
            }
        }
    }
}