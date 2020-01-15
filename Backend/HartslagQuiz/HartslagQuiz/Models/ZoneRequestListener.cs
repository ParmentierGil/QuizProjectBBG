using com.shephertz.app42.gaming.multiplayer.client.command;
using com.shephertz.app42.gaming.multiplayer.client.events;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class ZoneRequestListener : com.shephertz.app42.gaming.multiplayer.client.listener.ZoneRequestListener
    {
        public User Listener { get; set; }
        public ZoneRequestListener(User user)
        {
            Listener = user;
        }
        public void onCreateRoomDone(RoomEvent eventObj)
        {
            Quizmaster quizmaster = Listener as Quizmaster;
            if (eventObj.getResult() == WarpResponseResultCode.SUCCESS)
            {
                Console.WriteLine("Room Created");
                quizmaster.CreateRoomDone(eventObj.getData());
            }
            else
            {
                var result = eventObj.getResult();
                Console.WriteLine("Failed to create room");
            }
        }

        public void onDeleteRoomDone(RoomEvent eventObj)
        {
            Quizmaster quizmaster = Listener as Quizmaster;
            Console.WriteLine("Succesfully deleted room");

            quizmaster.ActiveRoom.Active = false;
            quizmaster.DeleteRoomDone();
        }

        public void onGetAllRoomsDone(AllRoomsEvent eventObj)
        {
            string[] roomIds = eventObj.getRoomIds();

            Player p = Listener as Player;
        }

        public void onGetLiveUserInfoDone(LiveUserInfoEvent eventObj)
        {
            throw new NotImplementedException();
        }

        public void onGetMatchedRoomsDone(MatchedRoomsEvent matchedRoomsEvent)
        {
            Player p = Listener as Player;
            p.GetRoomWithProperties(matchedRoomsEvent);
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
