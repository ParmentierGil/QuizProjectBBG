using com.shephertz.app42.gaming.multiplayer.client;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Quizmaster : User, INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        void OnPropertyChanged([CallerMemberName] string name = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public string QuizmasterName { get; set; }
        public string JoinCode { get; set; }

        override public Room ActiveRoom 
        { 
            get 
            {
                return base.ActiveRoom;
            }
            set
            {
                base.ActiveRoom = value;
                OnPropertyChanged();
            }
        }

        public Quizmaster()
        {
            Random rand = new Random();
            JoinCode = rand.Next(0, 10).ToString() + rand.Next(0, 10).ToString() + rand.Next(0, 10).ToString() + rand.Next(0, 10).ToString();
            QuizmasterName = "quizmaster" + JoinCode;
        }

        public void ConnectToGameServer()
        {
            WarpClient.initialize(Secret.GameServerAPIKey, Secret.GameServerAPIPassword);
            WarpClient.setRecoveryAllowance(60);
            MyGame = WarpClient.GetInstance();

            GameConListener = new ConnectionListener(this);
            GameZoneRequestListener = new ZoneRequestListener(this);
            MyGame.AddConnectionRequestListener(GameConListener);
            MyGame.AddZoneRequestListener(GameZoneRequestListener);

            MyGame.Connect(QuizmasterName);
            MyGame.SetGeo("EU");
        }
        public void Exit()
        {
            MyGame.DeleteRoom(ActiveRoom.RoomId);
        }

        public override void ConnectDone()
        {
            try
            {
                string roomName = "room" + JoinCode;
                Dictionary<string, object> props = new Dictionary<string, object>()
                {
                    { "JoinCode", JoinCode }
                };
                MyGame.CreateRoom(roomName, QuizmasterName, 10, props);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void CreateRoomDone(RoomData roomdata)
        {
            Room room = new Room();
            room.RoomId = roomdata.getId();
            room.RoomName = roomdata.getName();
            room.Active = true;
            ActiveRoom = room;

            Console.WriteLine("Room Created, players can now join");
        }


        public void DeleteRoomDone()
        {
            if (!ActiveRoom.Active)
            {
                MyGame.Disconnect();
            }
        }

        public void GetAllRoomsDone(string[] roomids)
        {
            foreach (string s in roomids)
            {

            }
        }
    }
}
