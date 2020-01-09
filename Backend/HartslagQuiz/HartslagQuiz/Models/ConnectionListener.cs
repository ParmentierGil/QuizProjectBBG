using com.shephertz.app42.gaming.multiplayer.client.command;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class ConnectionListener : com.shephertz.app42.gaming.multiplayer.client.listener.ConnectionRequestListener
    {
        public Gamelobby ActiveGamelobby { get; set; }

        public ConnectionListener(Gamelobby gamelobby)
        {
            ActiveGamelobby = gamelobby;
        }

        public void onConnectDone(ConnectEvent eventObj)
        {
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                Console.WriteLine("connection success2");
                ActiveGamelobby.connectDone();
            }
            else
            {
                Console.WriteLine("connection fail");
            }
        }
        public void onDisconnectDone(ConnectEvent eventObj)
        {
            Console.WriteLine("Succesfully Disconnected");
        }
        public void onInitUDPDone(byte result)
        {
            throw new NotImplementedException();
        }
    }
}
