using HartslagQuiz.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace HartslagQuiz.ViewModels
{
    class EnterRoomViewModel : INotifyPropertyChanged
    {
        public EnterRoomViewModel(Player player)
        {
            CurrentPlayer = player;
            LatestHeartbeat = CurrentPlayer.HeartbeatLatest.HeartRate;
            JoinRoomCommand = new Command(JoinRoom, () => IsConnected);

            CurrentPlayer.PropertyChanged += Player_PropertyChanged;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        void OnPropertyChanged([CallerMemberName] string name = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public Player CurrentPlayer { get; set; }

        private int _latestHeartbeat;

        public int LatestHeartbeat
        {
            get { return _latestHeartbeat; }
            set 
            { 
                _latestHeartbeat = value;
                OnPropertyChanged();
            }
        }

        private bool _isConnected = false;
        public bool IsConnected
        {
            get { return _isConnected; }
            set
            {
                try
                {
                    _isConnected = value;
                    OnPropertyChanged();
                    Application.Current.Dispatcher.BeginInvokeOnMainThread( () => 
                    {
                        JoinRoomCommand.ChangeCanExecute();
                    });
                    
                }
                catch (Exception ex)
                {
                    Console.Write(ex.ToString());
                }               
            }
        }

        private string _joinCode;
        public string JoinCode
        {
            get
            {
                return _joinCode;
            }
            set
            {
                _joinCode = value;
                OnPropertyChanged();
            }
        }
        public Command JoinRoomCommand { get; private set; }

        private void Player_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "HeartbeatLatest")
            {
                LatestHeartbeat = CurrentPlayer.HeartbeatLatest.HeartRate;
            }
            else if (e.PropertyName == "IsConnected") 
            {
                IsConnected = CurrentPlayer.IsConnected;
            }
        }

        void JoinRoom()
        {
            LatestHeartbeat = 9999;
            if (JoinCode != null || JoinCode.Length == 4)
            {
                Dictionary<string, object> props = new Dictionary<string, object>()
                {
                    {"JoinCode", JoinCode }
                };
                //CurrentPlayer.MyGame.GetRoomWithProperties(props);
            }
            else
            {
                Console.WriteLine("Room code incorrect");
            }
        }        
       
    }
}
