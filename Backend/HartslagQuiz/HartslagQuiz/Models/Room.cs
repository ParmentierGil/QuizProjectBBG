using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Room
    {
        public string RoomId { get; set; }
        public string RoomName { get; set; }
        public int JoinCode { get; set; }
        public bool Active { get; set; }

        public Room()
        {
            JoinCode = new Random().Next(1000, 9999);
            RoomName = "Room" + JoinCode;
        }
    }
}
