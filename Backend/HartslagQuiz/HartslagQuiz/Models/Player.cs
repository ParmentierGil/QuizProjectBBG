using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    class Player
    {
        public string Username { get; set; }
        public Heartbeat HeartbeatLatest { get; set; }
        public List<Heartbeat> HeartbeatHistory { get; set; }
        public int Score { get; set; }

        public Player(string username)
        {
            Username = username;
        }
    }
}
