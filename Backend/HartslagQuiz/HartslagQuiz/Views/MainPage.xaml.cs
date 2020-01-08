using com.shephertz.app42.gaming.multiplayer.client;
using HartslagQuiz.Models;
using HartslagQuiz.Repos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;

namespace HartslagQuiz.Views
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
            Quizmaster quizmaster = new Quizmaster();
            Gamelobby ActiveGame = new Gamelobby(quizmaster);

            if (ActiveGame.MyGame.GetConnectionState() == WarpConnectionState.CONNECTED)
            {
                Console.WriteLine("We're done now");
            }   
        }

        private async Task TestRepo()
        {
            //await QuestionRepo.PostQuestions();
        }
    }
}
