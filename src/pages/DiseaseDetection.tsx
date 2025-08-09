import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import * as tmImage from '@teachablemachine/image';

const MODEL_URL = "/models/"; // Update this path

const DiseaseDetection = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        modelRef.current = await tmImage.load(modelURL, metadataURL);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Failed to load model", error);
        toast({
          title: "Model Load Failed",
          description: "Could not load the ML model. Please try again later.",
          variant: "destructive",
        });
      }
    };

    loadModel();
  }, []);

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
      setPredictionResult(null); // reset previous prediction
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    if (!modelRef.current) {
      toast({
        title: "Model not loaded",
        description: "Please wait for the model to load and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Create an image element to pass to the model
      const imageElement = new Image();
      imageElement.src = uploadedImage;

      imageElement.onload = async () => {
        // Predict using the model
        const predictions = await modelRef.current!.predict(imageElement);

        // Find highest probability class
        let highestProb = 0;
        let predictedClass = "Unknown";
        predictions.forEach((p) => {
          if (p.probability > highestProb) {
            highestProb = p.probability;
            predictedClass = p.className;
          }
        });

        setPredictionResult(`${predictedClass} (${(highestProb * 100).toFixed(2)}%)`);
        setIsAnalyzing(false);
      };
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis failed",
        description: "An error occurred during image analysis.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Detection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload area */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Plant Image</CardTitle>
            <CardDescription>
              Take or upload a clear photo of the affected plant part
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
                isDragOver ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedImage ? (
                <div className="space-y-4 w-full">
                  <img
                    src={uploadedImage}
                    alt="Uploaded plant"
                    className="max-h-[200px] mx-auto rounded-md"
                  />
                  <div className="text-center">
                    <Button
                      onClick={() => {
                        setUploadedImage(null);
                        setPredictionResult(null);
                      }}
                      variant="outline"
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>

                  {/* Hidden input and button */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                  />
                  <Button
                    variant="default"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Image
                  </Button>
                </>
              )}
            </div>

            {uploadedImage && (
              <div className="mt-4">
                <Button
                  className="w-full"
                  disabled={isAnalyzing}
                  onClick={analyzeImage}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results area */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Disease detection and treatment recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-10">
            {isAnalyzing ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ) : uploadedImage ? (
              <div>
                <h3 className="text-lg font-medium mb-2">{predictionResult ?? "No prediction yet"}</h3>
                {/* You can customize treatment recommendations here based on predicted class */}
              </div>
            ) : (
              <p className="text-gray-500">
                Upload an image to see analysis results here
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
