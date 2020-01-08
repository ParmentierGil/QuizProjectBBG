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
            InitializeGameServer();
            //TestRepo();      
        }

        private void InitializeGameServer()
        {
            WarpClient.initialize("934647c97c9f269851eada6fcad0abe58508c1abbb62487d77c7a0b0fa19305a", "07ab110a3e745c47511145c5b97ef69dfd78628f45b84b7aabae844c3d78c2bb");
            WarpClient myGame = WarpClient.GetInstance();
            myGame.AddConnectionRequestListener(new GameServerConListener());
            myGame.Connect("TestUserName");
            myGame.Disconnect();
        }

        private async Task TestRepo()
        {
            //await QuestionRepo.PostQuestions();
        }
    }
}
