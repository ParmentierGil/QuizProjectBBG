using com.shephertz.app42.gaming.multiplayer.client;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HartslagQuiz.Models
{
    public class Gamelobby
    {
        public WarpClient MyGame { get; set; }
        public List<Room> ActiveRooms { get; set; }
        public Quizmaster GameQuizMaster { get; set; }
        public ConnectionListener GameConListener { get; set; }
        public ZoneRequestListener GameZoneRequestListener { get; set; }


        public Gamelobby(Quizmaster quizmaster)
        {
            GameQuizMaster = quizmaster;
            ActiveRooms = new List<Room>();

            WarpClient.initialize(Secret.GameServerAPIKey, Secret.GameServerAPIPassword);
            MyGame = WarpClient.GetInstance();

            GameConListener = new ConnectionListener(this);
            GameZoneRequestListener = new ZoneRequestListener(this);
            MyGame.AddConnectionRequestListener(GameConListener);
            MyGame.AddZoneRequestListener(GameZoneRequestListener);

            MyGame.Connect(quizmaster.QuizmasterName);
            MyGame.SetGeo("EU");
        }

        public void Exit()
        {
            foreach(Room r in ActiveRooms)
            {
                MyGame.DeleteRoom(r.RoomId);
            }  
        }

        public void connectDone()
        {
            try
            {
                Room newRoom = new Room();
                ActiveRooms.Add(newRoom);
                MyGame.CreateRoom(newRoom.RoomName, GameQuizMaster.QuizmasterName, 10, null);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        public void createRoomDone(RoomData roomdata)
        {
            foreach(Room r in ActiveRooms)
            {
                if (r.RoomName == roomdata.getName())
                {
                    r.RoomId = roomdata.getId();
                }
            }
            Console.WriteLine("Room Created, players can now join");
        }


        public void deleteRoomDone()
        {
            bool stillActiveRooms = false;
            foreach(Room r in ActiveRooms)
            {
                if (r.Active = true)
                {
                    stillActiveRooms = true;
                }
            }

            if (!stillActiveRooms)
            {
                MyGame.Disconnect();
            }    
        }

        public void GetAllRoomsDone(string[] roomids)
        {
            foreach(string s in roomids)
            {

            }
        }
    }
}
