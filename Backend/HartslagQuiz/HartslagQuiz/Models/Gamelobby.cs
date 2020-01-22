//using com.shephertz.app42.gaming.multiplayer.client;
//using com.shephertz.app42.gaming.multiplayer.client.events;
//using System;
//using System.Collections.Generic;
//using System.Text;
//using System.Threading.Tasks;

//namespace HartslagQuiz.Models
//{
//    public class Gamelobby
//    {
//        public WarpClient MyGame { get; set; }
//        public Room ActiveRoom { get; set; }
//        public Quizmaster GameQuizMaster { get; set; }
//        public ConnectionListener GameConListener { get; set; }
//        public ZoneRequestListener GameZoneRequestListener { get; set; }

//        public Gamelobby(Quizmaster quizmaster)
//        {
//            GameQuizMaster = quizmaster;

//            WarpClient.initialize(Secret.GameServerAPIKey, Secret.GameServerAPIPassword);
//            MyGame = WarpClient.GetInstance();

//            GameConListener = new ConnectionListener(this);
//            GameZoneRequestListener = new ZoneRequestListener(this);
//            MyGame.AddConnectionRequestListener(GameConListener);
//            MyGame.AddZoneRequestListener(GameZoneRequestListener);

//            MyGame.Connect(quizmaster.QuizmasterName);
//            MyGame.SetGeo("EU");
//        }

//        internal void ConnectDone()
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
