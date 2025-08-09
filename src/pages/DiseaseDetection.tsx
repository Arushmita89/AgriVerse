import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, XCircle, Loader2 } from "lucide-react";

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
    if (historyArray.length > 10) historyArray.pop();
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
      const response = await fetch(uploadedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "uploaded_image.jpg");

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Prediction API error");
      }

      const data = await res.json();

      setPredictionResult(data.prediction);
      setAdvice(data.advice ?? null);

      addDetectionToHistory(
        data.prediction,
        data.prediction.toLowerCase().includes("healthy")
      );

      setScanCount((prev) => {
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
    <div className="space-y-8 max-w-5xl mx-auto px-6 py-8 bg-gradient-to-tr from-green-50 to-green-100 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold font-poppins text-green-900 text-center drop-shadow-md mb-8">
        Disease Detection
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Upload Section */}
        <Card
          className={`rounded-xl border-2 shadow-md transition-colors duration-300 cursor-pointer
            ${isDragOver ? "border-green-700 bg-green-50 shadow-xl" : "border-green-300 bg-white"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
              <UploadCloud className="w-6 h-6" /> Upload Plant Image
            </CardTitle>
            <CardDescription className="text-green-600">
              Take or upload a clear photo of the affected plant part
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center py-12">
            {uploadedImage ? (
              <motion.div
                key="image-uploaded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4 w-full"
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded plant"
                  className="max-h-[240px] mx-auto rounded-md object-contain shadow-lg"
                />
                <div className="flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setPredictionResult(null);
                      setAdvice(null);
                    }}
                    className="flex items-center gap-2"
                  >
                    <XCircle />
                    Remove Image
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <p className="text-center text-green-600 mb-4 select-none">
                  Drag & drop an image here, or click to select
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInput}
                />
                <Button variant="outline" size="lg">
                  Select Image
                </Button>
              </>
            )}
          </CardContent>

          {uploadedImage && (
            <div className="p-6 pt-0">
              <Button
                className="w-full flex items-center justify-center gap-2"
                disabled={isAnalyzing}
                onClick={analyzeImage}
                variant={isAnalyzing ? "disabled" : "default"}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
              <p className="mt-4 text-center text-green-700 font-semibold select-none">
                Scans done: {scanCount}
              </p>
            </div>
          )}
        </Card>

        {/* Results Section */}
        <Card className="rounded-xl border-2 border-green-700 shadow-md bg-white flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-800">
              Analysis Results
            </CardTitle>
            <CardDescription className="text-green-600">
              Disease detection and treatment recommendations
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col justify-center items-center text-center py-20 min-h-[240px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="animate-pulse space-y-4 w-full max-w-xs"
                >
                  <div className="h-6 bg-green-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-6 bg-green-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-6 bg-green-200 rounded w-2/3 mx-auto"></div>
                </motion.div>
              ) : uploadedImage ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col justify-center items-center text-center max-w-md px-6"
                >
                  <h3
                    style={{
                      color: predictionResult
                        ? predictionResult.toLowerCase().includes("healthy")
                          ? "#15803d"
                          : "#b91c1c"
                        : "#6b7280",
                      fontWeight: "700",
                      fontSize: "30px",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    className="mb-4"
                  >
                    {predictionResult ?? "No prediction yet"}
                  </h3>

                  {advice && (
                    <p className="text-green-900/90 whitespace-pre-wrap leading-relaxed font-medium">
                      {advice}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 font-medium select-none"
                >
                  Upload an image to see analysis results here
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
