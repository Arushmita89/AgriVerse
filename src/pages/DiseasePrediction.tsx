import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  rainfall: number | null;
}

const DiseasePrediction = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: null,
    humidity: null,
    rainfall: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = "4a53fa6493a16955995fcc2fe189256d"; // replace with your API key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data = await response.json();

      setWeather({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.["1h"] ?? 0, // rainfall in last 1 hour or 0 if no rain data
      });
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
                <div className="text-3xl font-bold">{weather.temperature?.toFixed(1)}°C</div>
                <p className="text-xs text-muted-foreground">Optimal range: 20-26°C</p>
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
                <p className={`text-xs text-muted-foreground ${weather.humidity > 70 ? "text-amber-500" : ""}`}>
                  {weather.humidity > 70 ? "Above ideal range" : "Within ideal range"}
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
                <div className="text-3xl font-bold">{weather.rainfall}mm</div>
                <p className="text-xs text-muted-foreground">Last 1 hour</p>
              </CardContent>
            </Card>
          </div>

          {/* The rest of your component unchanged */}
          <Card>
            <CardHeader>
              <CardTitle>Disease Risk Forecast</CardTitle>
              <CardDescription>7-day prediction based on weather patterns and historical data</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  temperature: { label: "Temperature", color: "#3b82f6" },
                  humidity: { label: "Humidity", color: "#10b981" },
                  risk: { label: "Disease Risk", color: "#ef4444" },
                }}
              >
                <div className="flex items-center justify-center h-full gap-y-24">
                  <p className="text-gray-500">Chart visualization would appear here</p>
                  <p className="text-sm text-muted-foreground">(This is a placeholder)</p>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>

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
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTitle className="text-amber-800">Blight Risk Elevated</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      High humidity levels detected. Consider preventative measures.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-green-200 bg-green-50">
                    <AlertTitle className="text-green-800">Rust Risk Low</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Current temperature range is unfavorable for rust development.
                    </AlertDescription>
                  </Alert>
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
