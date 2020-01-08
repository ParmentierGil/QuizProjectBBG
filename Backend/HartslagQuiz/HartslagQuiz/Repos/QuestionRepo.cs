using HartslagQuiz.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HartslagQuiz.Repos
{
    class QuestionRepo
    {
        static public async Task PostQuestions()
        {
            List<Question> questions;
            try
            {
                var assembly = IntrospectionExtensions.GetTypeInfo(typeof(Question)).Assembly;
                Stream stream = assembly.GetManifestResourceStream("HartslagQuiz.Assets.vragenantwoorden.json");
                string text = "";
                using (var reader = new System.IO.StreamReader(stream))
                {
                    text = reader.ReadToEnd();
                }
                questions  = JsonConvert.DeserializeObject<List<Question>>(text);
            }
            catch (Exception ex)
            {
                throw ex;
            }


            foreach (Question question in questions)
            {
                using (SqlConnection con = new SqlConnection(Secret.ServerString))
                {
                    await con.OpenAsync();
                    using (SqlCommand command = new SqlCommand())
                    {
                        command.Connection = con;

                        //string sqlcheck = $"Select QuestionId from Questions where QuestionText = '{question.QuestionText.Replace("\'","\'\'")}'";
                        //command.CommandText = sqlcheck;
                        //string id;

                        //try
                        //{
                        //    SqlDataReader reader = await command.ExecuteReaderAsync();
                        //    while (reader.Read())
                        //    {
                        //        id = reader["QuestionId"].ToString();

                        //        if (id == null)
                        //        {
                                    string sql = $"INSERT INTO Questions (QuestionId, QuestionText, CorrectAnswer, WrongAnswer1, WrongAnswer2, WrongAnswer3) VALUES ('{Guid.NewGuid()}', '{question.QuestionText.Replace("\'", "\'\'")}', '{question.CorrectAnswer}', '{question.WrongAnswer1}', '{question.WrongAnswer2}', '{question.WrongAnswer3}');";
                                    Console.WriteLine(sql);

                                    command.CommandText = sql;

                                    try
                                    {
                                        await command.ExecuteNonQueryAsync();
                                    }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
            }
        }
    }
}
