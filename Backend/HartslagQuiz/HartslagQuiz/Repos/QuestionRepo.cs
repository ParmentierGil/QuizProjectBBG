using HartslagQuiz.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace HartslagQuiz.Repos
{
    class QuestionRepo
    {
        public async Task PostQuestion(Question question)
        {

            using (SqlConnection con = new SqlConnection(Secret.ServerString)
            {
                await con.OpenAsync();
                using (SqlCommand command = new SqlCommand())
                {

                }
            }
        }
    }
}
