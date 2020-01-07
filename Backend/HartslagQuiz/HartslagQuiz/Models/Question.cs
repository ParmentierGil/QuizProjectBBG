using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    class Question
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; }
        public string CorrectAnswer { get; set; }
        public string WrongAnswer1 { get; set; }
        public string WrongAnswer2 { get; set; }
        public string WrongAnswer3 { get; set; }
    }
}
