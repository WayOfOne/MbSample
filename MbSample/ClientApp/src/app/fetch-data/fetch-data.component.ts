import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogLevel, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit { 
  public forecasts: WeatherForecast[] = [];
  private hubConnection: HubConnection;
  private baseUrl: string;
  private http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    http.get<WeatherForecast[]>(baseUrl + 'weatherforecast').subscribe(result => {
      this.forecasts = result;
    }, error => console.error(error));

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7064/weatherhub`)
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection.start().then(() => {
      console.log('Connection started');
    }).catch(err => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('WeatherUpdated', (data) => {
      console.log("Received new weather data:", data);
      // Handle the updated weather data here
      this.forecasts.push(data)
    });
  }

  ngOnInit() { 
 
  }

  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(err => console.error(err));
    }
  }

  addWeatherForecast() {
    const newForecast: WeatherForecast = {
      date: new Date().toISOString(), // Set to the current date for demonstration
      temperatureC: Math.floor(Math.random() * 100), // Random temperature for demonstration
      temperatureF: Math.floor(Math.random() * 100), // Random temperature for demonstration
      summary: 'Random Summary' // Set a static summary for demonstration
    };

    this.http.post<WeatherForecast>(`${this.baseUrl}weatherforecast`, newForecast)
      .subscribe(
        result => {
          console.log('Weather forecast added:', result);
          // You can also update your local forecasts array here if needed.
        },
        error => {
          console.error('Error adding weather forecast:', error);
        }
      );
  }

}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
