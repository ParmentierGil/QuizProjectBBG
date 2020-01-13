using com.shephertz.app42.gaming.multiplayer.client.command;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class ZoneRequestListener : com.shephertz.app42.gaming.multiplayer.client.listener.ZoneRequestListener
    {
        public Gamelobby ActiveGamelobby { get; set; }
        public ZoneRequestListener(Gamelobby gamelobby)
        {
            ActiveGamelobby = gamelobby;
        }
        public void onCreateRoomDone(RoomEvent eventObj)
        {
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                Console.WriteLine("Room Created");
                ActiveGamelobby.createRoomDone(eventObj.getData());
            }
            else
            {
                var result = eventObj.getResult();
                Console.WriteLine("Failed to create room");
            }
        }

        public void onDeleteRoomDone(RoomEvent eventObj)
        {
            Console.WriteLine("Succesfully deleted room");

            ActiveGamelobby.ActiveRoom.Active = false;
            ActiveGamelobby.deleteRoomDone();
        }

        public void onGetAllRoomsDone(AllRoomsEvent eventObj)
        {
            string[] roomIds = eventObj.getRoomIds();
        }

        public void onGetLiveUserInfoDone(LiveUserInfoEvent eventObj)
        {
            throw new NotImplementedException();
        }

        public void onGetMatchedRoomsDone(MatchedRoomsEvent matchedRoomsEvent)
        {
            throw new NotImplementedException();
        }

        public void onGetOnlineUsersDone(AllUsersEvent eventObj)
        {
            throw new NotImplementedException();
        }

        public void onSetCustomUserDataDone(LiveUserInfoEvent eventObj)
        {
            throw new NotImplementedException();
        }
    }
}
