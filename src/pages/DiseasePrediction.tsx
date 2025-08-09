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
import { Thermometer, Droplet, CloudRain, AlertTriangle, CheckCircle2 } from "lucide-react";

interface WeatherData {
  temperature: number | null;
  humidity: number | null;
  rainfall: number | null;
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-8 p-6 max-w-5xl mx-auto bg-gradient-to-tr from-green-50 to-green-100 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold font-poppins text-green-900 text-center drop-shadow-md mb-6">
        Disease Prediction Dashboard
      </h1>

      {loading && (
        <p className="text-center text-green-700 font-semibold animate-pulse">
          Loading weather data...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:scale-105 transition-transform shadow-md border-green-300 border-2">
              <CardHeader className="flex items-center gap-2 pb-2">
                <Thermometer className="text-red-500 w-6 h-6" />
                <CardTitle className="text-lg font-semibold text-red-600">
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-red-700">
                  {weather.temperature?.toFixed(1)}°C
                </p>
                <p className="text-sm font-medium text-red-400 mt-1">
                  Ideal range: 20-26°C
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform shadow-md border-amber-300 border-2">
              <CardHeader className="flex items-center gap-2 pb-2">
                <Droplet className="text-amber-500 w-6 h-6" />
                <CardTitle className="text-lg font-semibold text-amber-600">
                  Humidity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-amber-700">
                  {weather.humidity}%
                </p>
                <p
                  className={`text-sm font-medium mt-1 ${
                    weather.humidity && weather.humidity > 70
                      ? "text-amber-600 font-bold"
                      : "text-amber-400"
                  }`}
                >
                  {weather.humidity && weather.humidity > 70
                    ? "Above ideal range"
                    : "Within ideal range"}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-transform shadow-md border-blue-300 border-2">
              <CardHeader className="flex items-center gap-2 pb-2">
                <CloudRain className="text-blue-500 w-6 h-6" />
                <CardTitle className="text-lg font-semibold text-blue-600">
                  Rainfall
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-extrabold text-blue-700">
                  {weather.rainfall} mm
                </p>
                <p className="text-sm font-medium text-blue-400 mt-1">
                  Last 1 hour
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <Card className="bg-amber-50 border-amber-300 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Risk Alerts
                </CardTitle>
                <CardDescription className="text-amber-600">
                  Conditions that may lead to disease outbreaks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {weather.humidity && weather.humidity > 70 && (
                    <Alert className="border-amber-300 bg-amber-100 shadow-md rounded-md">
                      <AlertTitle className="text-amber-800 font-semibold">
                        Blight Risk Elevated
                      </AlertTitle>
                      <AlertDescription className="text-amber-700">
                        High humidity levels detected. Consider preventative
                        measures now.
                      </AlertDescription>
                    </Alert>
                  )}
                  {weather.temperature &&
                    (weather.temperature < 20 || weather.temperature > 26) && (
                      <Alert className="border-green-300 bg-green-100 shadow-md rounded-md">
                        <AlertTitle className="text-green-800 font-semibold">
                          Rust Risk Low
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                          Temperature outside ideal range — rust development
                          unlikely.
                        </AlertDescription>
                      </Alert>
                    )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-300 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Recommended Actions
                </CardTitle>
                <CardDescription className="text-green-600">
                  Preventative measures based on current predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Badge variant="destructive" className="font-semibold">
                      High Priority
                    </Badge>
                    <div>
                      <p className="font-semibold text-green-800">
                        Apply fungicide treatment
                      </p>
                      <p className="text-sm text-green-600">
                        Recommended for northern fields within 48 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Badge variant="secondary" className="font-semibold">
                      Medium Priority
                    </Badge>
                    <div>
                      <p className="font-semibold text-green-800">
                        Increase airflow in greenhouse
                      </p>
                      <p className="text-sm text-green-600">
                        Reduce humidity levels to prevent mildew formation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Badge variant="outline" className="font-semibold text-green-700">
                      Low Priority
                    </Badge>
                    <div>
                      <p className="font-semibold text-green-800">
                        Monitor western fields
                      </p>
                      <p className="text-sm text-green-600">
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
