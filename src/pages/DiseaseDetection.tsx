import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const DiseaseDetection = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(() => {
    const saved = localStorage.getItem("scanCount");
    return saved ? Number(saved) : 0;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addDetectionToHistory = (result: string, isHealthy: boolean) => {
    const existingHistory = localStorage.getItem("detectionHistory");
    const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
    historyArray.unshift({
      result,
      isHealthy,
      timestamp: new Date().toISOString(),
    });
    if (historyArray.length > 10) historyArray.pop(); // keep max 10 records
    localStorage.setItem("detectionHistory", JSON.stringify(historyArray));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setPredictionResult(null);
      setAdvice(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    setIsAnalyzing(true);

    try {
      // Convert base64 image URL to Blob
      const response = await fetch(uploadedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'uploaded_image.jpg');

      // Call backend API (make sure backend is running on localhost:5000)
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Prediction API error");
      }

      const data = await res.json();

      setPredictionResult(data.prediction);
      setAdvice(data.advice ?? null);

      addDetectionToHistory(data.prediction, data.prediction.toLowerCase().includes('healthy'));

      setScanCount(prev => {
        const newCount = prev + 1;
        localStorage.setItem("scanCount", newCount.toString());
        return newCount;
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Prediction failed",
        description: "Could not get prediction from server.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Detection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Plant Image</CardTitle>
            <CardDescription>Take or upload a clear photo of the affected plant part</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${isDragOver ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="space-y-4 w-full">
                  <img src={uploadedImage} alt="Uploaded plant" className="max-h-[200px] mx-auto rounded-md" />
                  <div className="text-center">
                    <Button onClick={() => { setUploadedImage(null); setPredictionResult(null); setAdvice(null); }} variant="outline">
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">Drag and drop an image here, or click to select</p>

                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileInput} />
                  <Button variant="default" type="button" onClick={() => fileInputRef.current?.click()}>
                    Select Image
                  </Button>
                </>
              )}
            </div>

            {uploadedImage && (
              <div className="mt-4">
                <Button className="w-full" disabled={isAnalyzing} onClick={analyzeImage}>
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">Scans done: {scanCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Disease detection and treatment recommendations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center py-10 min-h-[150px]">
            {isAnalyzing ? (
              <div className="animate-pulse space-y-4 w-full max-w-xs">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ) : uploadedImage ? (
              <div className="flex flex-col justify-center items-center text-center">
                <h3
                  style={{
                    color: predictionResult
                      ? predictionResult.toLowerCase().includes("healthy")
                        ? "green"
                        : "red"
                      : "gray",
                    fontWeight: "700",
                    fontSize: "24px",
                    fontFamily: "Arial, sans-serif",
                  }}
                  className="mb-2"
                >
                  {predictionResult ?? "No prediction yet"}
                </h3>

                {advice && (
                  <p className="text-md text-gray-700 max-w-md">
                    {advice}
                  </p>
                )}
              </div>

            ) : (
              <p className="text-gray-500">Upload an image to see analysis results here</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
