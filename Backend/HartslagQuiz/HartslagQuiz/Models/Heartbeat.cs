using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    class Heartbeat
    {
        public int HeartRate { get; set; }
        public DateTime Time { get; set; }

        public Heartbeat(int heartrate, DateTime time)
        {
            HeartRate = heartrate;
            Time = time;
        }
    }
}
