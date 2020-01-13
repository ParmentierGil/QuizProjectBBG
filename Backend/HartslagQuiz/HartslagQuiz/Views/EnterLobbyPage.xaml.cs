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
        Player Tester;
        public Heartbeat HeartRate
        {
            get { return HeartRate; }
            set
            {
                HeartRate = value;
                OnPropertyChanged(nameof(HeartRate)); // Notify that there was a change on this property
            }
        }
        public EnterLobbyPage(IDevice connecteddevice)
        {
            InitializeComponent();
            BindingContext = this;
            Tester = new Player("tester", connecteddevice);
            HeartRate = Tester.HeartbeatLatest;
            lblHeartbeat.Text = HeartRate.HeartRate.ToString();
        }

    }
}