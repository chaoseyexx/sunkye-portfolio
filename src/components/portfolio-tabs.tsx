"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Dummy Data
const ITEMS_PER_PAGE = 6;

type Category = "environments" | "structures" | "interiors" | "models";

type PortfolioItem = {
  id: number;
  title: string;
  desc: string;
  image: string;
  category: Category;
};

const placeholderImg = "https://placehold.co/800x600/0a0a0a/8b5cf6?text=Sunkye+Build";

const portfolioData: PortfolioItem[] = [
  // Environments
  { id: 1, title: "Hillside Hobbit Home", desc: "Cozy earth-integrated dwelling with rounded architecture and warm lighting.", image: placeholderImg, category: "environments" },
  { id: 2, title: "Shimmahoning Waterfall", desc: "Serene waterfall with turquoise waters cascading down rocky cliffs.", image: placeholderImg, category: "environments" },
  { id: 3, title: "State Park Entrance", desc: "Atmospheric wooden entrance structure to a forested state park.", image: placeholderImg, category: "environments" },
  { id: 4, title: "Dinosaur Military Outpost", desc: "Tense jungle environment featuring military vehicles and prehistoric predators.", image: placeholderImg, category: "environments" },
  { id: 5, title: "Misty Pine Forest", desc: "Atmospheric pine forest with golden sunlight filtering through morning mist.", image: placeholderImg, category: "environments" },
  { id: 6, title: "Golden Canyon", desc: "Dramatic rocky canyon with atmospheric golden lighting and lush vegetation.", image: placeholderImg, category: "environments" },
  { id: 7, title: "Neon Cyberpunk City", desc: "Vibrant glowing city streets with towering skyscrapers and flying cars.", image: placeholderImg, category: "environments" },
  { id: 8, title: "Abandoned Facility", desc: "Overgrown concrete facility reclaimed by nature with eerie lighting.", image: placeholderImg, category: "environments" },
  
  // Structures
  { id: 9, title: "Modern Villa", desc: "Sleek architectural design with large glass windows and minimalist aesthetic.", image: placeholderImg, category: "structures" },
  { id: 10, title: "Medieval Castle", desc: "Towering stone fortress with intricate battlements and a grand courtyard.", image: placeholderImg, category: "structures" },
  { id: 11, title: "Sci-Fi Space Station", desc: "High-tech orbital structure with glowing panels and docking bays.", image: placeholderImg, category: "structures" },
  
  // Interiors
  { id: 12, title: "Luxury Penthouse", desc: "High-end interior design featuring custom furniture and city views.", image: placeholderImg, category: "interiors" },
  { id: 13, title: "Cozy Tavern", desc: "Warm wooden interior with a glowing fireplace and scattered seating.", image: placeholderImg, category: "interiors" },
  
  // Models
  { id: 14, title: "Custom Vehicles", desc: "High-detail stud-style vehicles designed for performance and aesthetics.", image: placeholderImg, category: "models" },
  { id: 15, title: "Weapon Arsenal", desc: "Precision-modeled weaponry for combat games.", image: placeholderImg, category: "models" },
];

const categories: { id: Category; label: string }[] = [
  { id: "environments", label: "Environments" },
  { id: "structures", label: "Structures" },
  { id: "interiors", label: "Interiors" },
  { id: "models", label: "Models" },
];

export function PortfolioTabs() {
  const [activeTab, setActiveTab] = useState<Category>("environments");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter items by category
  const filteredItems = portfolioData.filter((item) => item.category === activeTab);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleTabChange = (tab: Category) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-neutral-900/50 border border-neutral-800 p-1.5 rounded-full overflow-x-auto max-w-full">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                activeTab === category.id ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === category.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary-600 rounded-full"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]"
      >
        <AnimatePresence mode="popLayout">
          {currentItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-colors"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-neutral-950 cursor-pointer">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-primary-600 p-3 rounded-full transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <ZoomIn className="text-white w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-3 leading-tight">{item.title}</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${
                  currentPage === idx + 1 
                    ? "bg-primary-600 text-white border border-primary-500" 
                    : "border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
