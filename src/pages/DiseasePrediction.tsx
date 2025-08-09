
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const DiseasePrediction = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Prediction</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24°C</div>
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
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground text-amber-500">Above ideal range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rainfall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12mm</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Prediction Chart */}
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
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Chart visualization would appear here</p>
              <p className="text-sm text-muted-foreground">(This is a placeholder)</p>
            </div>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Alerts */}
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
    </div>
  );
};

export default DiseasePrediction;
