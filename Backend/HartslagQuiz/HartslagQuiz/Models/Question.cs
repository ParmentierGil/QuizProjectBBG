using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    class Question
    {
        public Guid Id { get; set; }

        [JsonProperty(PropertyName = "Vraag")]
        public string QuestionText { get; set; }

        [JsonProperty(PropertyName = "A")]
        public string CorrectAnswer { get; set; }

        [JsonProperty(PropertyName = "B")]
        public string WrongAnswer1 { get; set; }

        [JsonProperty(PropertyName = "C")]
        public string WrongAnswer2 { get; set; }

        [JsonProperty(PropertyName = "D")]
        public string WrongAnswer3 { get; set; }
    }
}
