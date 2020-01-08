using com.shephertz.app42.gaming.multiplayer.client;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace HartslagQuiz.Models
{
    public class Gamelobby
    {
        public WarpClient MyGame { get; set; }
        public Guid RoomId { get; set; }
        public Quizmaster GameQuizMaster { get; set; }
        public GameServerConListener GameConListener { get; set; }


        public Gamelobby(Quizmaster quizmaster)
        {
            GameQuizMaster = quizmaster;
            WarpClient.initialize(Secret.GameServerAPIKey, Secret.GameServerAPIPassword);
            MyGame = WarpClient.GetInstance();
            GameConListener = new GameServerConListener(this);
            MyGame.AddConnectionRequestListener(GameConListener);
            MyGame.Connect(quizmaster.QuizmasterId.ToString());
        }


        public void connectDone()
        {
            RoomId = Guid.NewGuid();
            MyGame.CreateRoom(RoomId.ToString(), GameQuizMaster.QuizmasterId.ToString(), 10, null);
        }

        public void createRoomDone()
        {
            Console.WriteLine("Room Created, players can now join");
        }

        public void PlayerConnect(string username)
        {
            throw new NotImplementedException();
        }
    }
}
