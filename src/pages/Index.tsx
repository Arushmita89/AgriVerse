
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4 py-16 md:py-24">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-900">AgriVerse</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-green-800">
            Advanced crop disease detection and prediction using artificial intelligence. Protect your crops with early identification and treatment recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/detection">
                Detect Disease <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-900">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Disease Detection</CardTitle>
                <CardDescription>Upload photos of your crops for instant AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Our advanced AI models can identify diseases from images with high accuracy, helping you catch problems early.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Disease Prediction</CardTitle>
                <CardDescription>Get ahead of potential outbreaks with predictive analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Using environmental data and historical patterns, we predict disease risks before symptoms appear.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Treatment Library</CardTitle>
                <CardDescription>Access comprehensive disease information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Browse our extensive library of crop diseases, with detailed treatment recommendations and prevention strategies.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-green-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2025 CropWise AI Guardian. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
