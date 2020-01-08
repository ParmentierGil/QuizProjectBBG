using com.shephertz.app42.gaming.multiplayer.client.command;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class GameServerConListener : com.shephertz.app42.gaming.multiplayer.client.listener.ConnectionRequestListener
    {
        public GameServerConListener()
        {
        }
        public void onConnectDone(ConnectEvent eventObj)
        {
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                Console.WriteLine("connection success");
            }
            else
            {
                Console.WriteLine("connection fail");
            }
        }
        public void onDisconnectDone(ConnectEvent eventObj)
        {
        }
        public void onInitUDPDone(byte result)
        {
            throw new NotImplementedException();
        }
    }
}
