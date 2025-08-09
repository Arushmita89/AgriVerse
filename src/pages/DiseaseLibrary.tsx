import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bug, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const diseases = [
  {
    id: 1,
    name: "Late Blight",
    crop: "Tomato",
    scientificName: "Phytophthora infestans",
    severity: "High",
    symptoms:
      "Water-soaked spots on leaves that quickly turn brown, white mold on leaf undersides, rapidly spreading.",
    treatment:
      "Apply copper-based fungicides, remove infected plants, increase plant spacing for better air circulation.",
  },
  {
    id: 2,
    name: "Powdery Mildew",
    crop: "Cucumber",
    scientificName: "Erysiphe cichoracearum",
    severity: "Medium",
    symptoms:
      "White powdery spots on leaves and stems, eventually covering entire surfaces, yellowing leaves.",
    treatment:
      "Apply sulfur-based fungicides, baking soda solutions, ensure proper plant spacing and airflow.",
  },
  {
    id: 3,
    name: "Bacterial Leaf Spot",
    crop: "Pepper",
    scientificName: "Xanthomonas campestris",
    severity: "Medium",
    symptoms:
      "Small dark brown spots with yellow halos, lesions dry out and tear, giving a tattered appearance.",
    treatment:
      "Copper-based bactericides, remove infected plant material, avoid overhead watering.",
  },
  {
    id: 4,
    name: "Corn Smut",
    crop: "Corn",
    scientificName: "Ustilago maydis",
    severity: "Low",
    symptoms:
      "Grayish-white galls on ears, tassels, or leaves that eventually turn black and release spores.",
    treatment: "Remove and destroy galls before they rupture, crop rotation, resistant varieties.",
  },
  {
    id: 5,
    name: "Rice Blast",
    crop: "Rice",
    scientificName: "Magnaporthe oryzae",
    severity: "High",
    symptoms:
      "Diamond-shaped lesions with gray centers and brown margins on leaves, nodes, and panicles.",
    treatment:
      "Fungicide application, resistant varieties, proper water management, balanced fertilization.",
  },
  {
    id: 6,
    name: "Wheat Rust",
    crop: "Wheat",
    scientificName: "Puccinia graminis",
    severity: "High",
    symptoms:
      "Orange to reddish-brown pustules on stems and leaves, reduced grain fill, weakened plants.",
    treatment:
      "Fungicide application, resistant varieties, early planting, destroy volunteer wheat.",
  },
];

const severityColors = {
  High: "bg-red-600 text-red-100",
  Medium: "bg-yellow-400 text-yellow-900",
  Low: "bg-green-500 text-green-100",
};

const DiseaseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<typeof diseases[0] | null>(null);

  const filteredDiseases = diseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 font-poppins text-gray-900">
      <h1 className="text-4xl font-extrabold mb-8 text-green-800 drop-shadow-md">🌿 Disease Library</h1>

      {/* Search Input with icon */}
      <div className="relative mb-10 max-w-md mx-auto md:mx-0">
        <Search className="absolute top-3 left-3 text-green-600" />
        <input
          type="text"
          placeholder="Search diseases by name or crop..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-300 focus:ring-4 focus:ring-green-400 focus:outline-none shadow-md placeholder-green-400 text-green-900 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px]">
        {/* Disease List */}
        <div className="overflow-y-auto max-h-[600px] space-y-3 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
          {filteredDiseases.length === 0 && (
            <div className="text-center p-8 rounded-lg border-2 border-green-200 bg-green-50 text-green-700 font-semibold shadow-inner">
              No diseases found matching <span className="italic">"{searchTerm}"</span>
            </div>
          )}

          {filteredDiseases.map((disease) => (
            <motion.div
              key={disease.id}
              layout
              onClick={() => setSelectedDisease(disease)}
              initial={{ opacity: 0.8 }}
              animate={{
                opacity: selectedDisease?.id === disease.id ? 1 : 0.75,
                scale: selectedDisease?.id === disease.id ? 1.03 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`cursor-pointer rounded-xl p-4 shadow-md border ${
                selectedDisease?.id === disease.id
                  ? "border-green-600 bg-green-100"
                  : "border-transparent hover:border-green-400 hover:bg-green-50"
              } flex flex-col gap-1`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-green-900">{disease.name}</h3>
                <Badge
                  className={`uppercase tracking-wide font-semibold px-3 py-1 rounded-full shadow-sm ${
                    severityColors[disease.severity as keyof typeof severityColors] || "bg-gray-300 text-gray-800"
                  }`}
                >
                  {disease.severity}
                </Badge>
              </div>
              <p className="text-green-700 italic font-medium">{disease.crop}</p>
            </motion.div>
          ))}
        </div>

        {/* Disease Details */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {selectedDisease ? (
              <motion.div
                key={selectedDisease.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-2xl border-2 border-green-400 shadow-lg bg-white p-6">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-3xl font-extrabold text-green-900">
                          {selectedDisease.name}
                        </CardTitle>
                        <CardDescription className="text-green-700 italic mt-1 text-lg font-medium">
                          {selectedDisease.scientificName} • Affects {selectedDisease.crop}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`uppercase tracking-wide font-bold px-5 py-2 rounded-3xl shadow-lg text-lg ${
                          severityColors[selectedDisease.severity as keyof typeof severityColors] ||
                          "bg-gray-300 text-gray-900"
                        }`}
                      >
                        {selectedDisease.severity} Severity
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 text-green-900 font-semibold text-lg leading-relaxed">
                    <section>
                      <h3 className="text-2xl font-bold mb-3">Symptoms</h3>
                      <p>{selectedDisease.symptoms}</p>
                    </section>
                    <section>
                      <h3 className="text-2xl font-bold mb-3">Treatment</h3>
                      <p>{selectedDisease.treatment}</p>
                    </section>
                    <div className="pt-4">
                      <Button
                        variant="default"
                        className="bg-green-700 hover:bg-green-800 text-white font-semibold text-lg shadow-lg"
                        onClick={() => alert("Detailed guide coming soon!")}
                      >
                        View Detailed Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full min-h-[320px] border-2 border-green-200 rounded-2xl bg-green-50 shadow-inner p-12 text-green-700 font-semibold"
              >
                <Bug className="w-20 h-20 mb-5 drop-shadow-lg" />
                <h3 className="text-2xl font-extrabold mb-3">Select a Disease</h3>
                <p className="max-w-md text-center font-medium text-green-800">
                  Choose a disease from the list to view detailed information and treatment options.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiseaseLibrary;
