using Microsoft.AspNetCore.SignalR;

namespace MbSample.Hubs
{
    public class WeatherHub : Hub
    {
        public async Task SendWeatherUpdate(WeatherForecast forecast)
        {
            await Clients.All.SendAsync("WeatherUpdated", forecast);
        }
    }
}
