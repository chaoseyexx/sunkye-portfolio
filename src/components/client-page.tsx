"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Download,
  Menu,
  ExternalLink,
  Star,
  Code,
  Zap,
  Mail,
  Code as GithubIcon,
  MessageSquare,
  Quote,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollAnimation } from "@/components/scroll-animation"
import { AudioPlayer } from "@/components/audio-player"
import { ImageModal } from "@/components/image-modal"
import { TermsModal } from "@/components/terms-modal"

// Types for data
interface PortfolioItem {
  id: string
  title: string
  desc: string
  image: string
}

interface PortfolioData {
  environments: PortfolioItem[]
  structures: PortfolioItem[]
  interiors: PortfolioItem[]
  models: PortfolioItem[]
}

interface Review {
  id: string
  name: string
  role: string
  content: string
  avatarColor: string
  rating: number
  price: string
  project: string
}

interface Skill {
  id: string
  title: string
  desc: string
  icon: string
  skills: string[]
}

interface Settings {
  site: { title: string; description: string }
  hero: { subtitle: string; title: string; description: string; featuredImage: string; featuredTitle: string; featuredDescription: string }
  about: { name: string; age: string; experience: string; profileImage: string; bio: string[]; whyHireMe: string[] }
  contact: { email: string; robloxUsername: string; discordUsername: string; discordLink: string; availability: string }
  collaborations: { id: string; name: string; image: string }[]
}

// Portfolio data
const portfolioItems = {
  environments: [
    {
      title: "Hillside Hobbit Home",
      desc: "Cozy earth-integrated dwelling with rounded architecture and warm golden lighting at sunset",
      image: "/hobbit-home.png",
    },
    {
      title: "Shimmahoning Waterfall",
      desc: "Serene waterfall with turquoise waters cascading down rocky cliffs in a misty landscape",
      image: "/shimmahoning-waterfall.png",
    },
    {
      title: "Shimmahoning State Park Entrance",
      desc: "Atmospheric wooden entrance structure to a forested state park with morning fog",
      image: "/shimmahoning-entrance.png",
    },
    {
      title: "Dinosaur Military Outpost",
      desc: "Tense jungle environment featuring military vehicles and prehistoric predators",
      image: "/dinosaur-military.png",
    },
    {
      title: "Misty Pine Forest",
      desc: "Atmospheric pine forest with golden sunlight filtering through morning mist",
      image: "/misty-pine-forest.png",
    },
    {
      title: "Golden Canyon",
      desc: "Dramatic rocky canyon with atmospheric golden lighting and lush vegetation",
      image: "/golden-canyon.png",
    },
    {
      title: "Shimmahoning Visitor Center",
      desc: "Rustic wooden visitor center nestled among tall pine trees in a misty forest setting",
      image: "/shimmahoning-visitor-center.png",
    },
    {
      title: "Forest Cabin Retreat",
      desc: "Peaceful wooden structure nestled within a dense pine forest",
      image: "/forest-cabin.png",
    },
    {
      title: "Misty Forest Meadow",
      desc: "Serene forest clearing with flowering bushes, ferns, and towering pine trees",
      image: "/misty-forest-meadow.png",
    },
    {
      title: "Golden Lakeside Sunset",
      desc: "Breathtaking lakeside view with mountains and golden sunset reflections on water",
      image: "/golden-lakeside-sunset.png",
    },
  ],
  structures: [
    {
      title: "Modern Skyscraper Complex",
      desc: "Contemporary high-rise buildings with glass facades and mixed architectural styles",
      image: "/structures/modern-skyscrapers.png",
    },
    {
      title: "Traditional Japanese Pagoda",
      desc: "Multi-tiered wooden tower with characteristic curved roofs and traditional lanterns",
      image: "/structures/japanese-pagoda-tower.png",
    },
    {
      title: "Grand Stadium Arena",
      desc: "Massive domed sports facility with tiered seating and dramatic architectural lighting",
      image: "/structures/grand-stadium-interior.png",
    },
    {
      title: "Traditional Asian Gateway",
      desc: "Authentic entrance structure with traditional roofing and wooden column details",
      image: "/structures/traditional-asian-entrance.png",
    },
    {
      title: "School Recreation Complex",
      desc: "Educational facility with colorful playground track and modern school building",
      image: "/structures/school-playground.png",
    },
    {
      title: "Historic Japanese Tower",
      desc: "Traditional multi-story pagoda with authentic architectural details and atmospheric lighting",
      image: "/structures/japanese-pagoda-alt.png",
    },
    {
      title: "Japanese Temple Complex",
      desc: "Multi-building traditional complex with red roofs set in a winter landscape",
      image: "/structures/japanese-temple-complex.png",
    },
    {
      title: "Metropolitan Tower Group",
      desc: "Collection of modern skyscrapers with varied glass and concrete facades",
      image: "/structures/modern-towers-complex.png",
    },
    {
      title: "Futuristic Bridge System",
      desc: "Large-scale infrastructure with concrete overpasses and residential areas below",
      image: "/structures/futuristic-bridge-overpass.png",
    },
    {
      title: "Urban Alleyway (Night)",
      desc: "Atmospheric brick alley with neon signage, graffiti details, and moody night lighting",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mkvaKQnkOxVLQvhyh34Vgp0SNwy3MG.png",
    },
    {
      title: "String Light Courtyard",
      desc: "Charming urban space between buildings with hanging string lights and detailed brick architecture",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Yi2v2EM8KB1KA0d1Fue3xIta8XAS8f.png",
    },
    {
      title: "Neon Skyscraper",
      desc: "Imposing high-rise building with vertical light strips and illuminated facade against night sky",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BDoF8J6EzvEZAb4xvt4EyqGDa9o4QX.png",
    },
    {
      title: "Elegant Manor (Night)",
      desc: "Sophisticated building with arched windows, decorative moldings, and atmospheric night lighting",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-758w6GPyu595O0PRbtortwY8beC9dU.png",
    },
    {
      title: "Traditional Japanese Dojo",
      desc: "Authentic wooden structure with traditional paper windows and multi-tiered roof design",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-y8czYzLG08sCfkYa1VDjCVTwzioFJi.png",
    },
    {
      title: "Modern Wooden Residence",
      desc: "Contemporary wooden home with stone accents, pergola entrance, and large windows",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VcnDnHhP1M4ImWRUlRAGtYgRYIWNzs.png",
    },
    {
      title: "Eric's Corner Store",
      desc: "Streamlined commercial building with art deco influences and large display windows",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sFOt5W6SoBKmFnU3pPkPNNh8zSWgaG.png",
    },
    {
      title: "Minimalist Warehouse",
      desc: "Industrial concrete structure with clean lines, glass entrance, and functional design",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mmTIuzn24GEmSQ2VhnefRsPdd5Frlw.png",
    },
    {
      title: "The Basement - Urban District",
      desc: "Detailed city block featuring apartment buildings, illuminated signage, and construction elements",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1NWujHRYooTKbD5TIGghbwQJY1ilvA.png",
    },
    {
      title: "Reflective Highway",
      desc: "Realistic road with wet surface reflections, bordered by detailed landscaping and guardrails",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KVYACCuHc3i3oZb4u37oZsX0oa2Iub.png",
    },
    {
      title: "Beach Volleyball Setup",
      desc: "Tropical beach recreation area with volleyball court, lounge chairs, and palm trees",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DoUUFJYezt67B3NeBaYlkutDPyMPUC.png",
    },
    {
      title: "Olympic Stadium",
      desc: "Large-scale sports arena featuring volleyball court with Paris 2024 Olympic branding and Eiffel Tower backdrop",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dTJ1gc4z2GkQGSLlwtmzZGTQEl4VFU.png",
    },
    {
      title: "Colorful Townhouses",
      desc: "Row of vibrant residential homes with street lighting along a wet roadway",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8Dd94qLVhJn3c4KtdmV5Qt9f5eVFRu.png",
    },
    {
      title: "Modern Suburban Home",
      desc: "Contemporary two-story residence with minimalist design and lime green accents",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YwRzEcEro7zBzhd4p4zUt4Cuy5roKe.png",
    },
    {
      title: "Neighborhood Shop",
      desc: "Charming storefront with brick detailing, red garage door, and decorative planters",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-emkMnzAWF5YwEw89bOFlZ21bfVzpyr.png",
    },
    {
      title: "Urban Apartment Street",
      desc: "Detailed city block featuring apartment buildings with fire escapes and varied architectural styles",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EI22V3Mys6F377UqeGfdMrhkjbZ88r.png",
    },
    {
      title: "Gas Station",
      desc: "Modern service station with covered fueling area and green-accented canopy",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sX4cSh8oZSFtmvCgqZLdS0qUbiPn4E.png",
    },
    {
      title: "Colorful Kiosk",
      desc: "Vibrant multi-level kiosk with green roof, decorative windows, and ambient lighting",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wv56FjbvlFirlrhooGyxN084HWMx2u.png",
    },
    {
      title: "Modern Tower Complex",
      desc: "Contemporary skyscraper with dramatic lighting elements and architectural light panels",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EhxUhOwAjgqCe7wtKn5VIPwyzz2IY9.png",
    },
  ],
  interiors: [
    {
      title: "Atmospheric Corridor",
      desc: "Dark industrial corridor with dramatic golden lighting strips and moody ambiance",
      image: "/interiors/atmospheric-corridor.png",
    },
    {
      title: "Classical Music Room",
      desc: "Elegant room with white marble columns, ornate details, and period furniture including piano",
      image: "/interiors/classical-music-room.png",
    },
    {
      title: "Modern Shopping Mall",
      desc: "Multi-level commercial space with glass dome ceiling, escalators, and retail storefronts",
      image: "/interiors/modern-shopping-mall.png",
    },
    {
      title: "Neoclassical Lounge",
      desc: "Refined room with white columns, decorative moldings, and ornate Persian rug",
      image: "/interiors/neoclassical-lounge.png",
    },
    {
      title: "Grand Library",
      desc: "Luxurious study with rich wooden paneling, built-in bookshelves, and fireplace",
      image: "/interiors/grand-library.png",
    },
    {
      title: "Industrial Hallway",
      desc: "Atmospheric industrial corridor with strategic lighting and modern architectural elements",
      image: "/interiors/industrial-hallway.png",
    },
    {
      title: "Highway Coffee Shop",
      desc: "Modern outdoor café with pergola structure and professional coffee equipment setup",
      image: "/interiors/highway-coffee-shop.png",
    },
    {
      title: "Modern Fitness Center",
      desc: "Contemporary gym with geometric LED lighting and motivational design elements",
      image: "/modern-gym.png",
    },
    {
      title: "Sci-Fi Research Laboratory",
      desc: "Futuristic laboratory with green ambient lighting and advanced scientific equipment",
      image: "https://placehold.co/800x600/0a0a0a/8b5cf6?text=Featured+Build",
    },
    {
      title: "Security Control Room",
      desc: "High-tech monitoring facility with red ambient lighting and command consoles",
      image: "/security-control-room.png",
    },
    {
      title: "Clothing Boutique (Day)",
      desc: "Modern retail space with minimalist design and elegant display fixtures",
      image: "/clothing-store-day.png",
    },
    {
      title: "Clothing Boutique (Night)",
      desc: "Contemporary fashion store with ambient lighting and stylish interior elements",
      image: "/clothing-store-night.png",
    },
    {
      title: "Underground Tunnel Network",
      desc: "Atmospheric subterranean passages with dramatic lighting and water elements",
      image: "/underground-tunnels.png",
    },
    {
      title: "Medieval Blacksmith Shop",
      desc: "Rustic interior with wooden beams, brick walls, and authentic medieval details",
      image: "/medieval-blacksmith.png",
    },
    {
      title: "Medieval Bedroom",
      desc: "Cozy stone-walled bedroom with wooden flooring and period-appropriate furnishings",
      image: "/medieval-bedroom.png",
    },
    {
      title: "Basketball Court",
      desc: "Full-sized indoor gymnasium with regulation court markings and spectator seating",
      image: "/basketball-court.png",
    },
    {
      title: "Futuristic Elevator Hall",
      desc: "Modern facility with ambient blue lighting and sleek elevator design",
      image: "/blue-elevator-hall.png",
    },
    {
      title: "Stylish Bar Interior",
      desc: "Urban bar with illuminated bottle display, wooden counter, and brick wall accents",
      image: "/bar-interior.png",
    },
    {
      title: "Premium Movie Theater",
      desc: "Luxury cinema with tiered seating, comfortable recliners, and atmospheric lighting",
      image: "/movie-theater.png",
    },
    {
      title: "Home Theater System",
      desc: "High-end residential entertainment space with surround sound and premium seating",
      image: "/home-theater-system.png",
    },
    {
      title: "Modern Bedroom",
      desc: "Minimalist bedroom design with warm lighting and large windows",
      image: "/modern-bedroom.png",
    },
    {
      title: "Wooden Hallway",
      desc: "Elegant hallway with wooden paneling and arched doorway",
      image: "/wooden-hallway.png",
    },
    {
      title: "Media Room",
      desc: "Custom media room with wooden paneling and multiple display screens",
      image: "/home-theater.png",
    },
    {
      title: "Wooden Room",
      desc: "Warm interior space with built-in cabinetry and panoramic windows",
      image: "/wooden-room.png",
    },
    {
      title: "Industrial Corridor",
      desc: "Sci-fi themed hallway with atmospheric blue lighting",
      image: "/industrial-corridor.png",
    },
    {
      title: "Flamé Restaurant",
      desc: "Upscale dining establishment with elegant interior and exterior design",
      image: "/flame-restaurant-collage.png",
    },
  ],
  models: [
    {
      title: "Robot Mascot",
      desc: "Stylized robot character with white body, green accents, and distinctive horns",
      image: "/models/robot-mascot.png",
    },
    {
      title: "Vintage Steam Train",
      desc: "Detailed locomotive with passenger cars featuring authentic period styling",
      image: "/models/vintage-train.png",
    },
    {
      title: "Hooded Warrior",
      desc: "Muscular character with blue hood, exposed torso, and combat-ready stance",
      image: "/models/hooded-warrior.png",
    },
    {
      title: "Templar Cross",
      desc: "Metallic medieval cross with ornate detailing and red center accent",
      image: "/models/templar-cross.png",
    },
    {
      title: "Plague Doctor Mask",
      desc: "Sinister bird-like mask with elongated beak and glowing red eye",
      image: "/models/plague-doctor-mask.png",
    },
    {
      title: "Wooden Sword",
      desc: "Hand-carved wooden blade with detailed grain texture and stylized design",
      image: "/models/wooden-sword.png",
    },
    {
      title: "Stylized Female Character",
      desc: "Low-poly character model with clean lines and minimalist design",
      image: "/models/stylized-character.png",
    },
    {
      title: "Circular Blade Weapon",
      desc: "Ring-shaped weapon with sharp edges and leather-wrapped handle",
      image: "/models/circular-blade.png",
    },
    {
      title: "Katana with Sheath",
      desc: "Traditional Japanese sword with red handle wrapping and matching scabbard",
      image: "/models/katana-sword.png",
    },
    {
      title: "Luminous Butterfly",
      desc: "Elegant blue butterfly model with detailed wings and decorative silver edging",
      image: "/models/blue-butterfly.png",
    },
    {
      title: "Raven Skull Staff",
      desc: "Mystical staff featuring an intricately carved raven skull and textured handle",
      image: "/models/raven-skull-staff.png",
    },
    {
      title: "Watermelon Scooter",
      desc: "Whimsical vehicle with watermelon-themed design and stylized handlebars",
      image: "/models/watermelon-scooter.png",
    },
    {
      title: "Burger Bike",
      desc: "Playful hamburger-shaped motorcycle with delivery compartment and food-themed details",
      image: "/models/burger-motorcycle.png",
    },
    {
      title: "Red Roof Cottage",
      desc: "Stylized medieval building with wooden frame, stone foundation, and distinctive red roof tiles",
      image: "/models/red-roof-house.png",
    },
    {
      title: "Wizard's Tower House",
      desc: "Fantasy dwelling featuring purple roof tiles and cylindrical tower with gold finial",
      image: "/models/purple-roof-house.png",
    },
    {
      title: "Blocky Cat Character",
      desc: "Cute cubic feline character with expressive eyes, pink ears, and minimalist design",
      image: "/models/blocky-cat.png",
    },
    {
      title: "Low-Poly Trees",
      desc: "Geometric stylized trees with faceted foliage and simplified trunk structures",
      image: "/models/low-poly-trees.png",
    },
    {
      title: "Wooden Barrel Set",
      desc: "Detailed wooden barrel with metal bands and accompanying wooden planks",
      image: "/models/wooden-barrel.png",
    },
    {
      title: "Roblox Avatar",
      desc: "Classic Roblox character with white hoodie, black pants, and stylish cap",
      image: "/models/roblox-character.png",
    },
    {
      title: "Hunter's Bow and Arrow",
      desc: "Handcrafted wooden bow with detailed texturing and matching arrow",
      image: "/models/wooden-bow-arrow.png",
    },
    {
      title: "Enchanted Blade",
      desc: "Fantasy sword with marble blade, bronze guard, and purple crystal accents",
      image: "/models/fantasy-sword.png",
    },
    {
      title: "Royal Greatsword",
      desc: "Elegant ceremonial sword with ornate gold detailing and pristine white blade",
      image: "/models/ornate-sword.png",
    },
    {
      title: "Commercial Airliner",
      desc: "Detailed passenger aircraft with custom livery and accurate proportions",
      image: "/models/commercial-airplane.png",
    },
    {
      title: "Luxury Executive Office",
      desc: "Sophisticated office space with coffered ceiling, leather furniture, and modern design elements",
      image: "/interiors/luxury-executive-office.png",
    },
  ],
}

// Update the reviews data to include pricing information
const reviews = [
  {
    name: "fxnix",
    role: "Client",
    content:
      "He was a pretty good builder. We had some miscommunication issues but in the end I liked the final product",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#FF5E5B" />
        <circle cx="18" cy="14" r="6" fill="#FFE0E0" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#FFE0E0" />
      </svg>
    ),
    rating: 4,
    price: "$50",
    project: "Interior Design",
  },
  {
    name: "SquaredCube",
    role: "Client",
    content:
      "Sunkye is a competent builder, modeler, and gui artist, whose work I have seen firsthand! I can say from experience, if you need stylized gui, high poly models, or just a build done - give him a dm :)",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#7B61FF" />
        <rect x="12" y="12" width="12" height="12" rx="2" fill="#E2DDFF" />
        <circle cx="18" cy="14" r="6" fill="#E2DDFF" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#E2DDFF" />
      </svg>
    ),
    rating: 5,
    price: "$120",
    project: "GUI Design & Modeling",
  },
  {
    name: "24lancelll",
    role: "Client",
    content:
      "Great work with awesome detailing which would provide a riveting experience while playing the map itself!",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#4CAF50" />
        <circle cx="18" cy="14" r="6" fill="#E8F5E9" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#E8F5E9" />
      </svg>
    ),
    rating: 5,
    price: "$85",
    project: "Map Design",
  },
  {
    name: "Gold_KingVon2001",
    role: "Client",
    content:
      "The model was very well made and worked as fast as possible in a very good timely manner. I would recommend to future customers!!!",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#FFD700" />
        <circle cx="18" cy="14" r="6" fill="#FFF9C4" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#FFF9C4" />
        <path d="M18 6L20 10H16L18 6Z" fill="#FFF9C4" />
      </svg>
    ),
    rating: 5,
    price: "$65",
    project: "Custom Model",
  },
  {
    name: "lizion33",
    role: "VIP Client",
    content:
      "Sunkye, the best builder i've ever seen and/or hired, this guy never dissapoints, he is a fast  the best builder i've ever seen and/or hired, this guy never dissapoints, he is a fast worker, while also maintaining top tier quality. 10/10 🔥",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#FF9800" />
        <circle cx="18" cy="14" r="6" fill="#FFF3E0" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#FFF3E0" />
        <path d="M12 8L14 12L18 6L22 12L24 8" stroke="#FFF3E0" strokeWidth="2" />
      </svg>
    ),
    rating: 5,
    price: "$200+",
    project: "Full Environment",
  },
  {
    name: "Xander",
    role: "Client",
    content:
      "I would highly recommend hiring builderman he makes fast quality builds/models I would hire again without a second thought it would be a mistake not to hire him",
    avatar: (
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <rect width="36" height="36" rx="18" fill="#2196F3" />
        <circle cx="18" cy="14" r="6" fill="#E3F2FD" />
        <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#E3F2FD" />
        <path d="M14 10L18 14L22 10" stroke="#E3F2FD" strokeWidth="2" />
      </svg>
    ),
    rating: 5,
    price: "$1200",
    project: "Building Package",
  },
]

// Default fallback image for portfolio items
const DEFAULT_IMAGE = "/blocky-characters-adventure.png"

// Items per page for pagination
const ITEMS_PER_PAGE = 6

// Icon mapping for dynamic render
const iconMap: Record<string, any> = {
  Code, Zap, Star, ExternalLink
}

// Initial skills data as fallback
const initialSkills: Skill[] = [
  {
    id: "skill-1",
    title: "Roblox Studio Mastery",
    desc: "Expert knowledge of all Roblox Studio building tools and features",
    skills: ["Part Building", "Terrain Editor", "Material Management", "Union/Negate Operations"],
    icon: "Code",
  },
  {
    id: "skill-2",
    title: "3D Modeling",
    desc: "Creating custom assets to enhance build quality",
    skills: ["Mesh Creation", "UV Mapping", "Texture Design", "Model Optimization"],
    icon: "Zap",
  },
  {
    id: "skill-3",
    title: "Lighting & Effects",
    desc: "Creating atmosphere and mood through advanced lighting",
    skills: ["Dynamic Lighting", "Particle Systems", "Post-Processing", "Time Cycles"],
    icon: "Star",
  },
  {
    id: "skill-4",
    title: "Architecture Design",
    desc: "Creating realistic and functional building structures",
    skills: ["Structural Design", "Interior Layout", "Exterior Detailing", "Scale Management"],
    icon: "ExternalLink",
  },
  {
    id: "skill-5",
    title: "Environment Creation",
    desc: "Crafting immersive and detailed game environments",
    skills: ["Landscape Design", "Prop Placement", "Scene Composition", "Environmental Storytelling"],
    icon: "Zap",
  },
  {
    id: "skill-6",
    title: "Optimization",
    desc: "Ensuring builds perform well on all devices",
    skills: ["Triangle Count Management", "LOD Implementation", "Asset Reuse", "Memory Efficiency"],
    icon: "Code",
  },
]

export default function ClientPage({ initialProjects }: { initialProjects: any[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  // Map initialProjects from DB
  const [portfolio, setPortfolio] = useState<any>(() => {
    // We duplicate the projects across categories so the tabs aren't empty for now
    return {
      environments: initialProjects && initialProjects.length > 0 ? initialProjects : portfolioItems.environments,
      structures: initialProjects && initialProjects.length > 0 ? initialProjects : portfolioItems.structures,
      interiors: initialProjects && initialProjects.length > 0 ? initialProjects : portfolioItems.interiors,
      models: initialProjects && initialProjects.length > 0 ? initialProjects : portfolioItems.models,
    }
  })
  const [reviewsState, setReviewsState] = useState<Review[]>([])
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [settings, setSettings] = useState<Settings | null>(null)

  // Fetch all data
  useEffect(() => {
    async function fetchData() {
      try {
        // Portfolio is loaded from Server Props

        // Fetch Reviews
        fetch('/api/reviews')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) setReviewsState(data)
            else {
              // Map hardcoded reviews to match interface if API fails/empty
              const mappedReviews = reviews.map((r: any, i) => ({
                ...r,
                id: `local-${i}`,
                avatarColor: '#FF5E5B', // Default color
                avatar: undefined // Remove component, use color/name
              }))
              setReviewsState(mappedReviews)
            }
          })
          .catch(err => console.error('Reviews fetch error:', err))

        // Fetch Skills
        fetch('/api/skills')
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) setSkills(data)
          })
          .catch(err => console.error('Skills fetch error:', err))

        // Fetch Settings
        fetch('/api/settings')
          .then(res => res.json())
          .then(data => setSettings(data))
          .catch(err => console.error('Settings fetch error:', err))

      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState({ src: "", alt: "" })
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  // Function to open modal with selected image
  const openImageModal = (src: string, alt: string) => {
    setSelectedImage({ src, alt })
    setModalOpen(true)
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState({
    environments: 1,
    structures: 1,
    interiors: 1,
    models: 1,
  })

  // Calculate total pages for each category
  const totalPages = {
    environments: Math.ceil(portfolio.environments.length / ITEMS_PER_PAGE),
    structures: Math.ceil(portfolio.structures.length / ITEMS_PER_PAGE),
    interiors: Math.ceil(portfolio.interiors.length / ITEMS_PER_PAGE),
    models: Math.ceil(portfolio.models.length / ITEMS_PER_PAGE),
  }

  // Get paginated items for the current page
  const getPaginatedItems = (category: "environments" | "structures" | "interiors" | "models") => {
    const startIndex = (currentPage[category] - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return portfolio[category].slice(startIndex, endIndex)
  }

  // Handle page change
  const handlePageChange = (category: "environments" | "structures" | "interiors" | "models", page: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]: page,
    }))
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section
      const scrollPosition = window.scrollY + 100

      Object.entries(sectionsRef.current).forEach(([id, element]) => {
        if (!element) return

        const offsetTop = element.offsetTop
        const height = element.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Register section refs
  const registerSection = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionsRef.current[id] = ref
    }
  }

  // Smooth scroll function
  const scrollToSection = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80 // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update active section after scrolling
      setActiveSection(sectionId)
    }
  }

  // Pagination component
  const Pagination = ({
    category,
    totalPages,
  }: { category: "environments" | "structures" | "interiors" | "models"; totalPages: number }) => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(category, Math.max(1, currentPage[category] - 1))}
          disabled={currentPage[category] === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage[category] === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(category, page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(category, Math.min(totalPages, currentPage[category] + 1))}
          disabled={currentPage[category] === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Portfolio item component with click to zoom
  const PortfolioItem = ({ build, index, delay }: { build: any; index: number; delay: string }) => {
    const imgSrc = build.imageUrl || build.image || DEFAULT_IMAGE;
    const imgDesc = build.description || build.desc;
    
    return (
    <ScrollAnimation key={index} animation="scale-in" duration="duration-700" delay={delay as any}>
      <Card className="group overflow-hidden h-full">
        <div
          className="relative h-56 overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => openImageModal(imgSrc, build.title)}
        >
          <Image
            src={imgSrc}
            alt={build.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Zoom indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/80 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
              <ZoomIn className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="font-bold text-xl mb-2 text-white group-hover:text-primary transition-colors font-heading">
            {build.title}
          </h3>
          <p className="text-neutral-300">{imgDesc}</p>
        </CardContent>
      </Card>
    </ScrollAnimation>
  )}

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <AudioPlayer src="/bg-music.mp3" />

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={selectedImage.src}
        imageAlt={selectedImage.alt}
      />

      {/* Terms Modal */}
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />

      {/* Header */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-lg border-b border-neutral-800/50" : "bg-transparent"
          }`}
      >
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-auto">
              <Image src="https://placehold.co/140x40/0a0a0a/8b5cf6?text=Sunkye" alt="Sunkye Logo" width={140} height={40} className="object-contain" />
            </div>
          </div>

          <nav className="hidden md:flex gap-8">
            {["home", "portfolio", "skills", "reviews", "about", "contact"].map((section) => (
              <Link
                key={section}
                href={`#${section}`}
                onClick={(e) => scrollToSection(section, e)}
                className={`nav-link ${activeSection === section ? "nav-link-active" : ""}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button className="hidden sm:flex" onClick={(e) => scrollToSection("contact", e)}>
              Hire Me
            </Button>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="border-neutral-700/50 text-primary bg-transparent">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-xl border-neutral-800/50">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-auto">
                        <Image
                          src="https://placehold.co/140x40/0a0a0a/8b5cf6?text=Sunkye"
                          alt="Sunkye Logo"
                          width={120}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-6">
                    {["home", "portfolio", "skills", "reviews", "about", "contact"].map((section) => (
                      <Link
                        key={section}
                        href={`#${section}`}
                        onClick={(e) => scrollToSection(section, e)}
                        className={`text-lg font-medium transition-colors ${activeSection === section ? "text-primary" : "text-neutral-300 hover:text-white"
                          }`}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pt-8">
                    <Button className="w-full" onClick={(e) => scrollToSection("contact", e)}>
                      Hire Me
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section
          id="home"
          ref={(el) => registerSection("home", el)}
          className="relative min-h-[90vh] flex items-center overflow-hidden px-4 sm:px-0"
        >
          {/* Background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <ScrollAnimation animation="fade-in-left" duration="duration-1000">
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h2 className="text-primary font-semibold mb-2 md:mb-3 flex items-center">
                      <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                      ROBLOX BUILDER
                    </h2>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight font-heading">
                      Creating <span className="text-gradient">Amazing</span> Gaming Experiences
                    </h1>
                  </div>

                  <p className="text-lg md:text-xl text-neutral-300 max-w-lg">
                    Transforming ideas into immersive Roblox environments with attention to detail and technical
                    excellence
                  </p>

                  {/* Promotional Banner */}
                  <div className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl my-8">
                    <Image
                      src="https://placehold.co/960x540/0a0a0a/8b5cf6?text=Sunkye+Builds"
                      alt="Sunkye - Modeler & Builder"
                      width={960}
                      height={540}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base">
                      View My Work <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base bg-transparent"
                    >
                      <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Download Portfolio
                    </Button>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-right" duration="duration-1000">
                <div className="relative animate-float">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-2xl transform scale-95 translate-y-4"></div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900 to-neutral-950 shadow-2xl shadow-primary/5">
                    <Image
                      src="https://placehold.co/800x600/0a0a0a/8b5cf6?text=Featured+Build"
                      alt="Sci-Fi Research Laboratory"
                      fill
                      className="object-cover mix-blend-lighten opacity-90"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-xs font-medium text-primary-foreground mb-3">
                        FEATURED PROJECT
                      </div>
                      <h3 className="text-xl font-bold text-white font-heading">Sci-Fi Research Laboratory</h3>
                      <p className="text-sm text-neutral-300">
                        Futuristic laboratory with advanced scientific equipment
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section
          id="portfolio"
          ref={(el) => registerSection("portfolio", el)}
          className="py-16 md:py-24 relative px-4 sm:px-0"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 right-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
          </div>

          <div className="container relative z-10 space-y-10 md:space-y-16">
            <ScrollAnimation animation="fade-in-up" duration="duration-700">
              <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
                <h2 className="text-primary font-semibold flex items-center justify-center">
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                  MY WORK
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary ml-2 md:ml-3"></span>
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  Featured Roblox Builds
                </h3>
                <p className="text-neutral-300 max-w-xl mx-auto px-4 sm:px-0">
                  Browse through my collection of Roblox environments, structures, game assets, and custom models
                </p>
              </div>
            </ScrollAnimation>

            <Tabs defaultValue="environments" className="w-full">
              <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto px-4 py-2">
                <TabsList className="bg-neutral-900/50 backdrop-blur-md p-1 rounded-full border border-neutral-800">
                  <TabsTrigger
                    value="environments"
                    className="rounded-full px-3 sm:px-6 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-white"
                  >
                    Environments
                  </TabsTrigger>
                  <TabsTrigger
                    value="structures"
                    className="rounded-full px-3 sm:px-6 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-white"
                  >
                    Structures
                  </TabsTrigger>
                  <TabsTrigger
                    value="interiors"
                    className="rounded-full px-3 sm:px-6 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-white"
                  >
                    Interiors
                  </TabsTrigger>
                  <TabsTrigger
                    value="models"
                    className="rounded-full px-3 sm:px-6 py-1.5 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-red-600 data-[state=active]:text-white text-white"
                  >
                    Models
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="environments" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getPaginatedItems("environments").map((build: any, index: number) => (
                    <PortfolioItem
                      key={index}
                      build={build}
                      index={index}
                      delay={`delay-${Math.min(index * 100, 500)}` as any}
                    />
                  ))}
                </div>

                {/* Pagination for environments */}
                <Pagination category="environments" totalPages={totalPages.environments} />
              </TabsContent>

              <TabsContent value="structures" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getPaginatedItems("structures").map((build: any, index: number) => (
                    <PortfolioItem
                      key={index}
                      build={build}
                      index={index}
                      delay={`delay-${Math.min(index * 100, 500)}` as any}
                    />
                  ))}
                </div>

                {/* Pagination for structures */}
                <Pagination category="structures" totalPages={totalPages.structures} />
              </TabsContent>

              <TabsContent value="interiors" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getPaginatedItems("interiors").map((build: any, index: number) => (
                    <PortfolioItem
                      key={index}
                      build={build}
                      index={index}
                      delay={`delay-${Math.min(index * 100, 500)}` as any}
                    />
                  ))}
                </div>

                {/* Pagination for interiors */}
                <Pagination category="interiors" totalPages={totalPages.interiors} />
              </TabsContent>

              <TabsContent value="models" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getPaginatedItems("models").map((build: any, index: number) => (
                    <PortfolioItem
                      key={index}
                      build={build}
                      index={index}
                      delay={`delay-${Math.min(index * 100, 500)}` as any}
                    />
                  ))}
                </div>

                {/* Pagination for models */}
                <Pagination category="models" totalPages={totalPages.models} />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Skills Section */}
        <section
          id="skills"
          ref={(el) => registerSection("skills", el)}
          className="py-16 md:py-24 relative bg-neutral-950 px-4 sm:px-0"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute top-1/3 right-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 space-y-10 md:space-y-16">
            <ScrollAnimation animation="fade-in-up" duration="duration-700">
              <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4 px-4 sm:px-0">
                <h2 className="text-primary font-semibold flex items-center justify-center">
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                  EXPERTISE
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary ml-2 md:ml-3"></span>
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  My Building Skills
                </h3>
                <p className="text-neutral-300 max-w-xl mx-auto">
                  Technical abilities that make my Roblox builds stand out from the competition
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-0">
              {skills.map((skillSet, index) => {
                const IconComponent = iconMap[skillSet.icon] || Zap
                return (
                  <ScrollAnimation
                    key={index}
                    animation="fade-in-up"
                    duration="duration-700"
                    delay={`delay-${Math.min(index * 100, 500)}` as any}
                  >
                    <Card className="h-full bg-card-gradient border-neutral-800/50 overflow-hidden group hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                      <CardContent className="p-8 space-y-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-primary transition-colors font-heading">
                            {skillSet.title}
                          </h3>
                          <p className="text-neutral-300">{skillSet.desc}</p>
                        </div>
                        <ul className="space-y-3 pt-2">
                          {skillSet.skills.map((skill, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span className="text-neutral-300">{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                )
              })}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section
          id="reviews"
          ref={(el) => registerSection("reviews", el)}
          className="py-16 md:py-24 relative px-4 sm:px-0"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 space-y-10 md:space-y-16">
            <ScrollAnimation animation="fade-in-up" duration="duration-700">
              <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
                <h2 className="text-primary font-semibold flex items-center justify-center">
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                  CLIENT TESTIMONIALS
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary ml-2 md:ml-3"></span>
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  What Clients Say
                </h3>
                <p className="text-neutral-300 max-w-xl mx-auto">
                  Feedback from game developers and studios who have trusted me with their Roblox projects
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reviewsState.map((review, index) => (
                <ScrollAnimation
                  key={index}
                  animation="fade-in-up"
                  duration="duration-700"
                  delay={`delay-${Math.min(index * 100, 500)}` as any}
                >
                  <Card className="h-full bg-card-gradient border-neutral-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-700/50 flex-shrink-0">
                          {/* Prefer DB avatarColor, fallback to special avatar component if legacy data exists */}
                          {(review as any).avatar ? (
                            (review as any).avatar
                          ) : (
                            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                              <rect width="36" height="36" rx="18" fill={review.avatarColor || "#FF5E5B"} />
                              <circle cx="18" cy="14" r="6" fill="#FFFFFF40" />
                              <path d="M8 30C8 24.4772 12.4772 20 18 20C23.5228 20 28 24.4772 28 30V36H8V30Z" fill="#FFFFFF40" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white font-heading">{review.name}</h4>
                          <p className="text-sm text-neutral-400">{review.role}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-600"
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary-foreground">
                          <span className="mr-1">Project:</span>
                          <span className="text-white">{review.project}</span>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-400">
                          {review.price}
                        </div>
                      </div>

                      <div className="relative">
                        <Quote className="absolute top-0 left-0 h-8 w-8 text-primary/20 -translate-x-2 -translate-y-2" />
                        <p className="text-neutral-300 pl-4">{review.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="outline" className="group bg-transparent">
                <span>See More Reviews</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={(el) => registerSection("about", el)} className="py-16 md:py-24 relative px-4 sm:px-0">
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-1/4 left-[5%] w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 px-4 sm:px-6 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <ScrollAnimation
                animation="fade-in-left"
                duration="duration-1000"
                className="relative order-2 lg:order-1"
              >
                <div className="absolute -inset-4 -z-10 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-2xl transform scale-95 translate-y-4"></div>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl shadow-primary/5">
                  <Image src="https://placehold.co/400x400/0a0a0a/8b5cf6?text=Sunkye" alt="SunkyeGuy Profile" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-xs font-medium text-primary-foreground mb-2 md:mb-3">
                      Sunkye
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white font-heading">Roblox Builder</h3>
                    <p className="text-xs sm:text-sm text-neutral-300">Creating since 2020</p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation
                animation="fade-in-right"
                duration="duration-1000"
                className="space-y-6 md:space-y-8 order-1 lg:order-2"
              >
                <div>
                  <h2 className="text-primary font-semibold mb-2 md:mb-3 flex items-center">
                    <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                    ABOUT ME
                  </h2>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6 text-white font-heading">
                    Professional Roblox Builder
                  </h3>
                </div>
                <p className="text-lg text-neutral-300">
                  I'm Sunkye, an 18-year-old passionate Roblox builder with 4 years of experience creating
                  immersive environments and structures. I have a proven track record of delivering high-quality builds
                  that exceed expectations.
                </p>
                <p className="text-neutral-300">
                  I specialize in creating detailed, functional, and optimized builds that enhance player experiences.
                  My expertise spans both Roblox Studio and Blender, allowing me to create custom assets and
                  environments that stand out from the competition.
                </p>
                <p className="text-neutral-300">
                  My builds have been featured in popular Roblox games with over 9.7 million and 1.6 million visits,
                  demonstrating my ability to create engaging content that players love.
                </p>

                <div className="pt-4 space-y-4">
                  <h4 className="text-xl font-bold text-white font-heading">Why Hire Me?</h4>
                  <ul className="space-y-3">
                    {[
                      "Always instantaneous to respond",
                      "Will complete your projects before the given deadline",
                      "Flexible with payment options",
                      "Fluent in English, a good communicator and team worker",
                      "Available 2-8 hours daily depending on project needs",
                    ].map((item, index) => (
                      <ScrollAnimation
                        key={index}
                        animation="fade-in-left"
                        duration="duration-500"
                        delay={`delay-${Math.min(index * 100, 500)}` as any}
                      >
                        <li className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-sm shadow-lg shadow-primary/20">
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <span className="text-white">{item}</span>
                        </li>
                      </ScrollAnimation>
                    ))}
                  </ul>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Groups I've Worked With Section */}
        <section className="py-16 md:py-24 relative px-4 sm:px-0">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 space-y-10 md:space-y-16">
            <ScrollAnimation animation="fade-in-up" duration="duration-700">
              <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
                <h2 className="text-primary font-semibold flex items-center justify-center">
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                  COLLABORATIONS
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary ml-2 md:ml-3"></span>
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  Groups I've Worked With
                </h3>
              </div>
            </ScrollAnimation>

            {/* Updated collaboration images section with larger images */}
            <div className="grid grid-cols-1 gap-10 max-w-4xl mx-auto">
              <ScrollAnimation animation="fade-in-up" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IIeyfDICFdqwccWblhk8bTqt8qKk73.png"
                      alt="Combat Assault Team"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4Ccotphj2MQ7KNPj2vquWIPyLnncX1.png"
                      alt="Gotham's Shadow"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xmuLyYUly8Zid9vOVvzacVLnhFJKfi.png"
                      alt="Squid Game International"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vk5zbRQ8djJFVXBd0m5wBrAIej163s.png"
                      alt="Illuminate Studios Games"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto"
                    />
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={(el) => registerSection("contact", el)}
          className="py-16 md:py-24 relative bg-neutral-950 px-4 sm:px-0"
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute top-1/4 right-[15%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>

          <div className="container relative z-10 space-y-10 md:space-y-16 px-4 sm:px-6 md:px-0">
            <ScrollAnimation animation="fade-in-up" duration="duration-700">
              <div className="max-w-2xl mx-auto text-center space-y-3 md:space-y-4">
                <h2 className="text-primary font-semibold flex items-center justify-center">
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary mr-2 md:mr-3"></span>
                  GET IN TOUCH
                  <span className="inline-block w-4 md:w-6 h-[2px] bg-primary ml-2 md:ml-3"></span>
                </h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
                  Let's Work Together
                </h3>
                <p className="text-neutral-300 max-w-xl mx-auto">
                  Have a project in mind? Reach out to discuss how I can help bring your Roblox vision to life
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              <ScrollAnimation animation="fade-in-left" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden shadow-xl shadow-primary/5">
                  <CardContent className="p-8 space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white font-heading">Contact Information</h3>
                      <p className="text-neutral-300">Reach out and let's create something amazing together</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-300">Email</p>
                          <p className="font-medium text-white">singhrudrapratap21.2007@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Code className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-300">Roblox Username</p>
                          <p className="font-medium text-white">Sunkye</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h4 className="font-medium mb-2 text-white">Availability</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-neutral-300">Currently available for freelance projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>

              {/* Discord Card */}
              <ScrollAnimation animation="fade-in-right" duration="duration-700">
                <Card className="bg-card-gradient border-neutral-800/50 overflow-hidden shadow-xl shadow-primary/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1 text-white font-heading">Discord</h3>
                        <p className="text-neutral-300">Connect with me on Discord</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/50">
                        <p className="text-sm text-neutral-300 mb-1">Discord Username</p>
                        <p className="font-medium text-white">@sunkye</p>
                      </div>

                      <Button
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => {
                          window.open("https://discord.com/users/897532360894058599", "_blank")
                        }}
                      >
                        <MessageSquare className="h-4 w-4" /> Add on Discord
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800/50 py-8 md:py-12">
          <div className="container px-4 sm:px-6 md:px-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <div className="relative h-7 w-auto md:h-8">
                  <Image
                    src="https://placehold.co/140x40/0a0a0a/8b5cf6?text=Sunkye"
                    alt="Sunkye Logo"
                    width={100}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setTermsModalOpen(true)}
                  className="text-xs md:text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  Terms
                </button>
              </div>

              <p className="text-center text-xs md:text-sm text-neutral-300 md:text-left">
                © {new Date().getFullYear()} Sunkye. All rights reserved.
              </p>

              <div className="flex items-center gap-4 md:gap-6">
                {/* Terms button has been moved to the left side */}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
