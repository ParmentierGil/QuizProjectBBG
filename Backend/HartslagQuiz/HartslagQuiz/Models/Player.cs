using com.shephertz.app42.gaming.multiplayer.client;
using com.shephertz.app42.gaming.multiplayer.client.events;
using Plugin.BLE.Abstractions.Contracts;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Player : User, INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        void OnPropertyChanged([CallerMemberName] string name = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        #region Heartbeat Properties
        private Heartbeat _heartbeatLatest;
        public Heartbeat HeartbeatLatest
        {
            get { return _heartbeatLatest; }
            set 
            { 
                _heartbeatLatest = value;
                OnPropertyChanged();
            }
        }
        public List<Heartbeat> HeartbeatHistory { get; set; }
        #endregion


        #region Defining Properties
        public string Username { get; set; }
        public int Score { get; set; }
        public IDevice Sensor { get; set; }
        #endregion


        #region GameServer Properties
        private bool _isConnected;

        public bool IsConnected
        {
            get { return _isConnected; }
            set 
            {
                _isConnected = value;
                OnPropertyChanged();
            }
        }

        public string[] AllRoomIds { get; set; }
        #endregion


        #region Constructors
        public Player()
        {
            Heartbeat starthb = new Heartbeat(0, DateTime.Now);
            List<Heartbeat> history = new List<Heartbeat>();
            HeartbeatHistory = history;
            HeartbeatHistory.Add(starthb);
            HeartbeatLatest = starthb;
        }
        #endregion


        #region Bluetooth Methods
        public async void StartReadingHeartRate()
        {
            var services = await Sensor.GetServicesAsync();
            foreach (var service in services)
            {
                if (service.Name == "Heart Rate")
                {
                    var chars = await service.GetCharacteristicsAsync();
                    var descs = await chars[0].GetDescriptorsAsync();
                    await chars[0].StartUpdatesAsync();
                    Heartbeat hb;
                    chars[0].ValueUpdated += (s, e) =>
                    {
                        hb = new Heartbeat(e.Characteristic.Value[1], DateTime.Now);
                        HeartbeatHistory.Add(HeartbeatLatest);
                        HeartbeatLatest = hb;
                        Console.WriteLine("Hartslag: " + hb.HeartRate);
                    };
                }
            }
        }
        #endregion

        #region Gameserver Methods
        public void ConnectToGameserver()
        {
            WarpClient.initialize(Secret.GameServerAPIKey, Secret.GameServerAPIPassword);
            MyGame = WarpClient.GetInstance();

            GameConListener = new ConnectionListener(this);
            GameZoneRequestListener = new ZoneRequestListener(this);
            MyGame.AddConnectionRequestListener(GameConListener);
            MyGame.AddZoneRequestListener(GameZoneRequestListener);

            MyGame.Connect(Username);
        }

        public override void ConnectDone()
        {
            IsConnected = true;
        }
        internal void GetRoomWithProperties(MatchedRoomsEvent matchedRoomsEvent)
        {
            Console.WriteLine("Rooms getted");
        }




        #endregion
    }
}
