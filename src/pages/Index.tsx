import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(34,197,94,0.5)" },
};

const Index = () => {
  const features = [
    {
      title: "Disease Detection",
      description: "Upload photos of your crops for instant AI analysis",
      content:
        "Our advanced AI models can identify diseases from images with high accuracy, helping you catch problems early.",
    },
    {
      title: "Disease Prediction",
      description: "Get ahead of potential outbreaks with predictive analytics",
      content:
        "Using environmental data and historical patterns, we predict disease risks before symptoms appear.",
    },
    {
      title: "Treatment Library",
      description: "Access comprehensive disease information",
      content:
        "Browse our extensive library of crop diseases, with detailed treatment recommendations and prevention strategies.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between">
        <Navbar />
      </div>

      <section
        className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 relative"
        style={{
          backgroundImage: `url('background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-green-100 opacity-50"></div>

        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6 gap-3">
            <img
              src="logo.jpg"
              alt="AgriVerse Logo"
              className="w-12 h-12 rounded-full object-cover border border-green-900"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 font-dm-serif">AgriVerse</h1>
          </div>

          <p className="text-xl mb-8 max-w-3xl mx-auto text-green-900">
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

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-green-900">Key Features</h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.3 } },
            }}
          >
            {features.map(({ title, description, content }) => (
              <motion.div
                key={title}
                className="cursor-pointer rounded-md bg-white shadow-md border border-green-300 p-6"
                variants={cardVariants}
                whileHover="hover"
              >
                <CardHeader>
                  <CardTitle className="text-green-700">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{content}</p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="bg-green-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2025 AgriVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
