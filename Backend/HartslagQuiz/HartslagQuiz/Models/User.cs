using com.shephertz.app42.gaming.multiplayer.client;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace HartslagQuiz.Models
{
    public abstract class User
    {
        public WarpClient MyGame { get; set; }

        virtual public Room ActiveRoom { get; set; }

        public ConnectionListener GameConListener { get; set; }
        public ZoneRequestListener GameZoneRequestListener { get; set; }

        public abstract void ConnectDone();
    }
}
