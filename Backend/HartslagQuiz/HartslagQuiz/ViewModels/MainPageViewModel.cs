using HartslagQuiz.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Text;

namespace HartslagQuiz.ViewModels
{
    class MainPageViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        void OnPropertyChanged([CallerMemberName] string name = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }

        public Quizmaster CurrentQuizmaster { get; set; }

        private string _joinCode;
        public string JoinCode
        {
            get { return _joinCode; }
            set 
            { 
                _joinCode = value;
                OnPropertyChanged();
            }
        }


        public MainPageViewModel(Quizmaster quizmaster)
        {
            CurrentQuizmaster = quizmaster;
            CurrentQuizmaster.PropertyChanged += Quizmaster_PropertyChanged;

            JoinCode = "Wachten voor spelcode";
        }

        private void Quizmaster_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "ActiveRoom")
            {
                JoinCode = CurrentQuizmaster.JoinCode;
            }
        }
    }
}
