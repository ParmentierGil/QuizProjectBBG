using Plugin.BLE.Abstractions.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace HartslagQuiz.Models
{
    public class Player
    {
        public string Username { get; set; }
        public Heartbeat HeartbeatLatest { get; set; }
        public List<Heartbeat> HeartbeatHistory { get; set; }
        public int Score { get; set; }
        public IDevice Sensor { get; set; }

        public Player(string username, IDevice sensor)
        {
            Username = username;
            Sensor = sensor;
            StartReadingHeartRate();
        }

        private async void StartReadingHeartRate()
        {
            var services = await Sensor.GetServicesAsync();
            foreach (var service in services)
            {
                if (service.Name == "Heart Rate")
                {
                    var chars = await service.GetCharacteristicsAsync();
                    bool canr = chars[0].CanRead;
                    var descs = await chars[0].GetDescriptorsAsync();
                    bool canw = chars[0].CanWrite;
                    await chars[0].StartUpdatesAsync();
                    Heartbeat hb;
                    chars[0].ValueUpdated += (s, e) =>
                    {
                        hb = new Heartbeat(e.Characteristic.Value[1], DateTime.Now);
                        HeartbeatHistory.Add(HeartbeatLatest);
                        HeartbeatLatest = hb;
                        Console.WriteLine("Hartslag: " + hb.HeartRate);
                    };
                }
            }
        }
    }
}
