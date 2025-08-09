import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  rainfall: number | null;
}

interface DailyForecast {
  dt: number; // timestamp
  temp: { day: number };
  humidity: number;
  rain?: number;
}

const calculateRisk = (temp: number, humidity: number, rainfall = 0) => {
  let risk = 0;
  if (temp >= 20 && temp <= 26) risk += 30;
  if (humidity > 70) risk += 40;
  if (rainfall > 2) risk += 30;
  return Math.min(risk, 100);
};

const DiseasePrediction = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    humidity: null,
    rainfall: null,
  });
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current weather only (less restricted API)
  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = "4a53fa6493a16955995fcc2fe189256d"; // your API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();

      setWeather({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] ?? 0,
      });

      // Clear forecast since we don’t have it here
      setDailyForecast([]);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching weather");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  }, []);

  // Prepare chart data & options — only if dailyForecast exists
  const chartData = {
    labels: dailyForecast.map((day) =>
      new Date(day.dt * 1000).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: dailyForecast.map((day) => day.temp.day),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        yAxisID: "y",
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: dailyForecast.map((day) => day.humidity),
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        yAxisID: "y1",
        tension: 0.3,
      },
      {
        label: "Disease Risk (%)",
        data: dailyForecast.map((day) =>
          calculateRisk(day.temp.day, day.humidity, day.rain ?? 0)
        ),
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        yAxisID: "y2",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Temperature (°C)" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Humidity (%)" },
      },
      y2: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Disease Risk (%)" },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Prediction</h1>

      {loading && <p>Loading weather data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {weather.temperature?.toFixed(1)}°C
                </div>
                <p className="text-xs text-muted-foreground">
                  Optimal range: 20-26°C
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Humidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.humidity}%</div>
                <p
                  className={`text-xs text-muted-foreground ${
                    weather.humidity && weather.humidity > 70
                      ? "text-amber-500"
                      : ""
                  }`}
                >
                  {weather.humidity && weather.humidity > 70
                    ? "Above ideal range"
                    : "Within ideal range"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rainfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weather.rainfall} mm</div>
                <p className="text-xs text-muted-foreground">Last 1 hour</p>
              </CardContent>
            </Card>
          </div>

          {/* Show forecast chart only if we have data */}
          {/*dailyForecast.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Disease Risk Forecast</CardTitle>
                <CardDescription>
                  7-day prediction based on weather patterns and historical data
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <p className="text-center text-gray-500">
                  7-day forecast data not available with current API plan.
                </p>
              </CardContent>
            </Card>
          )*/}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Alerts</CardTitle>
                <CardDescription>
                  Current conditions that may lead to disease outbreaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weather.humidity && weather.humidity > 70 && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTitle className="text-amber-800">
                        Blight Risk Elevated
                      </AlertTitle>
                      <AlertDescription className="text-amber-700">
                        High humidity levels detected. Consider preventative
                        measures.
                      </AlertDescription>
                    </Alert>
                  )}
                  {weather.temperature &&
                    (weather.temperature < 20 || weather.temperature > 26) && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertTitle className="text-green-800">
                          Rust Risk Low
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                          Current temperature range is unfavorable for rust
                          development.
                        </AlertDescription>
                      </Alert>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>
                  Preventative measures based on current predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Badge variant="outline">High Priority</Badge>
                    <div>
                      <p className="font-medium">Apply fungicide treatment</p>
                      <p className="text-sm text-muted-foreground">
                        Recommended for northern fields within 48 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Badge variant="outline">Medium Priority</Badge>
                    <div>
                      <p className="font-medium">Increase airflow in greenhouse</p>
                      <p className="text-sm text-muted-foreground">
                        Reduce humidity levels to prevent mildew formation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Badge variant="outline">Low Priority</Badge>
                    <div>
                      <p className="font-medium">Monitor western fields</p>
                      <p className="text-sm text-muted-foreground">
                        Continue regular observation for early signs
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DiseasePrediction;
