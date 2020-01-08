using com.shephertz.app42.gaming.multiplayer.client.command;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class GameServerConListener : com.shephertz.app42.gaming.multiplayer.client.listener.ConnectionRequestListener
    {
        public Gamelobby ActiveGamelobby { get; set; }
        public GameServerConListener(Gamelobby gamelobby)
        {
            ActiveGamelobby = gamelobby;
        }
        public void onConnectDone(ConnectEvent eventObj)
        {
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                Console.WriteLine("connection success");
                ActiveGamelobby.connectDone();
            }
            else
            {
                var result = eventObj.getResult();
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

        public void onCreateRoomDone(ConnectEvent eventObj)
        {
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                ActiveGamelobby.createRoomDone();
            }
            else 
            {
                Console.WriteLine("Failed to create room");
            }
        }
    }
}
