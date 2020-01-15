using HartslagQuiz.Models;
using HartslagQuiz.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace HartslagQuiz.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class EnterRoomPage : ContentPage
    {
        Player CurrentPlayer;
        EnterRoomViewModel pageViewModel;
        public EnterRoomPage(Player player)
        {
            InitializeComponent();
            CurrentPlayer = player;
            pageViewModel = new EnterRoomViewModel(CurrentPlayer);
            BindingContext = pageViewModel;
            CurrentPlayer.ConnectToGameserver();
        }
    }
}