
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample disease data
const diseases = [
  {
    id: 1,
    name: "Late Blight",
    crop: "Tomato",
    scientificName: "Phytophthora infestans",
    severity: "High",
    symptoms: "Water-soaked spots on leaves that quickly turn brown, white mold on leaf undersides, rapidly spreading.",
    treatment: "Apply copper-based fungicides, remove infected plants, increase plant spacing for better air circulation.",
  },
  {
    id: 2,
    name: "Powdery Mildew",
    crop: "Cucumber",
    scientificName: "Erysiphe cichoracearum",
    severity: "Medium",
    symptoms: "White powdery spots on leaves and stems, eventually covering entire surfaces, yellowing leaves.",
    treatment: "Apply sulfur-based fungicides, baking soda solutions, ensure proper plant spacing and airflow.",
  },
  {
    id: 3,
    name: "Bacterial Leaf Spot",
    crop: "Pepper",
    scientificName: "Xanthomonas campestris",
    severity: "Medium",
    symptoms: "Small dark brown spots with yellow halos, lesions dry out and tear, giving a tattered appearance.",
    treatment: "Copper-based bactericides, remove infected plant material, avoid overhead watering.",
  },
  {
    id: 4,
    name: "Corn Smut",
    crop: "Corn",
    scientificName: "Ustilago maydis",
    severity: "Low",
    symptoms: "Grayish-white galls on ears, tassels, or leaves that eventually turn black and release spores.",
    treatment: "Remove and destroy galls before they rupture, crop rotation, resistant varieties.",
  },
  {
    id: 5,
    name: "Rice Blast",
    crop: "Rice",
    scientificName: "Magnaporthe oryzae",
    severity: "High",
    symptoms: "Diamond-shaped lesions with gray centers and brown margins on leaves, nodes, and panicles.",
    treatment: "Fungicide application, resistant varieties, proper water management, balanced fertilization.",
  },
  {
    id: 6,
    name: "Wheat Rust",
    crop: "Wheat",
    scientificName: "Puccinia graminis",
    severity: "High",
    symptoms: "Orange to reddish-brown pustules on stems and leaves, reduced grain fill, weakened plants.",
    treatment: "Fungicide application, resistant varieties, early planting, destroy volunteer wheat.",
  }
];

const DiseaseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<typeof diseases[0] | null>(null);
  
  const filteredDiseases = diseases.filter(disease => 
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    disease.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Disease Library</h1>
      
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search diseases by name or crop..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Disease List */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Common Crop Diseases</h2>
          <div className="space-y-2">
            {filteredDiseases.map(disease => (
              <div 
                key={disease.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedDisease?.id === disease.id 
                    ? "border-green-500 bg-green-50" 
                    : "hover:border-gray-400"
                }`}
                onClick={() => setSelectedDisease(disease)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{disease.name}</h3>
                  <Badge variant={
                    disease.severity === "High" ? "default" : 
                    disease.severity === "Medium" ? "secondary" : "outline"
                  }>
                    {disease.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{disease.crop}</p>
              </div>
            ))}
            
            {filteredDiseases.length === 0 && (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p>No diseases found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Disease Details */}
        <div className="md:col-span-2">
          {selectedDisease ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedDisease.name}</CardTitle>
                    <CardDescription>
                      {selectedDisease.scientificName} • Affects {selectedDisease.crop}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    selectedDisease.severity === "High" ? "default" : 
                    selectedDisease.severity === "Medium" ? "secondary" : "outline"
                  }>
                    {selectedDisease.severity} Severity
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Symptoms</h3>
                  <p>{selectedDisease.symptoms}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Treatment</h3>
                  <p>{selectedDisease.treatment}</p>
                </div>
                <div className="pt-4">
                  <Button>View Detailed Guide</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] border rounded-md bg-gray-50">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium mb-2">Select a Disease</h3>
                <p className="text-muted-foreground">
                  Choose a disease from the list to view detailed information
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseLibrary;
