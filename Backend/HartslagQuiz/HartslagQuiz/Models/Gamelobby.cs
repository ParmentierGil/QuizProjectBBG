using com.shephertz.app42.gaming.multiplayer.client;
using com.shephertz.app42.gaming.multiplayer.client.events;
using Microsoft.AspNetCore.DataProtection;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HartslagQuiz.Models
{
    public class Gamelobby
    {
        public WarpClient MyGame { get; set; }
        public Room ActiveRoom { get; set; }
        public Quizmaster GameQuizMaster { get; set; }
        public ConnectionListener GameConListener { get; set; }
        public ZoneRequestListener GameZoneRequestListener { get; set; }

        public Gamelobby(Quizmaster quizmaster)
        {
            GameQuizMaster = quizmaster;

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
            MyGame.DeleteRoom(ActiveRoom.RoomId);  
        }

        public void connectDone()
        {
            try
            {
                ActiveRoom = new Room();
                MyGame.CreateRoom(ActiveRoom.RoomName, GameQuizMaster.QuizmasterName, 10, null);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        public void createRoomDone(RoomData roomdata)
        {
            ActiveRoom.RoomId = roomdata.getId();
            ActiveRoom.Active = true;

            Console.WriteLine("Room Created, players can now join");
        }


        public void deleteRoomDone()
        {
            if (!ActiveRoom.Active)
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
