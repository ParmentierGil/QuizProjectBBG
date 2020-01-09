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
        Gamelobby ActiveGame;
        public MainPage()
        {

            InitializeComponent();
            Quizmaster quizmaster = new Quizmaster();
            //ActiveGame = new Gamelobby(quizmaster);

        }

        private void btnLeave_Clicked(object sender, EventArgs e)
        {
            //ActiveGame.Exit();
        }
    }
}
