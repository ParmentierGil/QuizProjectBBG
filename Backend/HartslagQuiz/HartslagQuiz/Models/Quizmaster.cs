using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Quizmaster
    {
        public Guid QuizmasterId { get; set; }
        public string QuizmasterName { get; set; }

        public Quizmaster()
        {
            QuizmasterId = Guid.NewGuid();
            QuizmasterName = "quizmaster" + new Random().Next();
        }
    }
}
