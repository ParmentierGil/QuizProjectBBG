using HartslagQuiz.Models;
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
    public partial class EnterNamePage : ContentPage
    {
        Player CurrentPlayer;
        public EnterNamePage(Player player)
        {
            InitializeComponent();
            CurrentPlayer = player;
        }

        private void GoToBluetoothPage_Clicked(object sender, EventArgs e)
        {
            if (nameEntry.Text != null)
            {
                CurrentPlayer.Username = nameEntry.Text;
                Navigation.PushAsync(new ConnectToBluetoothDevicePage(CurrentPlayer));
            }
        }
    }
}