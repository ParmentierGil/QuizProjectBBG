using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Room
    {
        static public int RoomCount = 1;

        public string RoomId { get; set; }
        public string RoomName { get; set; }
        public bool Active { get; set; }

        public Room()
        {
            RoomName = "Room" + RoomCount;
            RoomCount += 1;
            Active = true;
        }
    }
}
