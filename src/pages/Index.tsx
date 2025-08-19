import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.07, boxShadow: "0 0 20px 3px rgba(34,197,94,0.7)", y: -5 },
};

const Index = () => {
  const navigate = useNavigate();

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
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-r from-green-900 via-green-700 to-green-900 animate-gradient-x">
      <Navbar />

      {/* Hero Section */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-16 sm:py-20 relative text-center w-full"
        style={{
          backgroundImage: `url('/assets/background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-[2px] pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 w-full">
            <img
              src="/assets/logo.jpg"
              alt="AgriVerse Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-green-700 shadow-lg"
            />
            <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-900 to-green-500 drop-shadow-lg font-dm-serif">
              AgriVerse
            </h1>
          </div>

          <p className="w-full max-w-4xl mx-auto text-base sm:text-lg md:text-xl font-semibold text-white drop-shadow-md mb-10">
            Advanced crop disease detection and prediction using artificial intelligence. Protect your crops with early identification and treatment recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px 4px #34d399" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg hover:shadow-2xl w-full sm:w-auto"
                asChild
              >
                <Link to="/detection" className="flex items-center gap-2 justify-center w-full sm:w-auto">
                  Detect Disease <ArrowRight className="ml-1" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px 4px transparent" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-green-300 text-green-600 hover:bg-green-700 hover:text-white hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link to="/dashboard" className="flex justify-center w-full sm:w-auto">View Dashboard</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-gradient-to-t from-white/80 via-white/50 to-white/80 backdrop-blur-md w-full">
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-center mb-16 w-full">
            <h2 className="relative inline-block text-3xl sm:text-4xl font-extrabold text-green-800 group cursor-pointer">
              Key Features
              <span className="mt-2 absolute bottom-0 left-0 h-1 w-0 bg-green-400 transition-all duration-500 ease-in-out group-hover:w-full"></span>
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.25 } } }}
          >
            {features.map(({ title, description, content }) => (
              <motion.div
                key={title}
                className="cursor-pointer rounded-2xl bg-white bg-opacity-60 border border-green-300 backdrop-blur-md p-6 sm:p-8 shadow-lg transition-transform will-change-transform w-full"
                variants={cardVariants}
                whileHover="hover"
              >
                <CardHeader>
                  <CardTitle className="text-green-700 text-xl sm:text-2xl font-bold">{title}</CardTitle>
                  <CardDescription className="text-green-600 font-semibold">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 font-medium text-sm sm:text-base">{content}</p>
                </CardContent>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-6 sm:py-8 px-4 sm:px-6 text-center font-semibold tracking-wide w-full">
        <p>© 2025 AgriVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
