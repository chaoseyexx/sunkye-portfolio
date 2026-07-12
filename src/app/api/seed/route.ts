import { NextResponse } from 'next/server'
import { writeJsonFile } from '@/lib/data'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST() {
    try {
        const isAuth = await verifyAuth()
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const portfolioItems = {
            environments: [
                { id: "env-1", title: "Hillside Hobbit Home", desc: "Cozy earth-integrated dwelling with rounded architecture and warm golden lighting at sunset", image: "https://i.ibb.co/LtbYJb0/b4c489b4f2c0.png" },
                { id: "env-2", title: "Shimmahoning Waterfall", desc: "Serene waterfall with turquoise waters cascading down rocky cliffs in a misty landscape", image: "https://i.ibb.co/3s6D5Kz/6146c24bc7b9.png" },
                { id: "env-3", title: "Shimmahoning State Park Entrance", desc: "Atmospheric wooden entrance structure to a forested state park with morning fog", image: "https://i.ibb.co/f4gS3Jk/f7ef40f4eebc.png" },
                { id: "env-4", title: "Dinosaur Military Outpost", desc: "Tense jungle environment featuring military vehicles and prehistoric predators", image: "https://i.ibb.co/rpxYt9M/e83151cfdc8b.png" },
                { id: "env-5", title: "Misty Pine Forest", desc: "Atmospheric pine forest with golden sunlight filtering through morning mist", image: "https://i.ibb.co/xL8XJ0B/793d5edcbbdf.png" },
                { id: "env-6", title: "Golden Canyon", desc: "Dramatic rocky canyon with atmospheric golden lighting and lush vegetation", image: "https://i.ibb.co/rQf15Qk/8b3f1737e550.png" },
                { id: "env-7", title: "Shimmahoning Visitor Center", desc: "Rustic wooden visitor center nestled among tall pine trees in a misty forest setting", image: "https://i.ibb.co/mXTW2Rj/37dddf18cdd7.png" },
                { id: "env-8", title: "Forest Cabin Retreat", desc: "Peaceful wooden structure nestled within a dense pine forest", image: "https://i.ibb.co/QcYyCgq/4597d26bbec0.png" }
            ],
            structures: [
                { id: "str-1", title: "Modern Skyscraper Complex", desc: "Contemporary high-rise buildings with glass facades and mixed architectural styles", image: "https://i.ibb.co/PtzTz1w/8636e0d37e28.png" },
                { id: "str-2", title: "Traditional Japanese Pagoda", desc: "Multi-tiered wooden tower with characteristic curved roofs and traditional lanterns", image: "https://i.ibb.co/Yty8MZm/143e117498c8.png" },
                { id: "str-3", title: "Grand Stadium Arena", desc: "Massive domed sports facility with tiered seating and dramatic architectural lighting", image: "https://i.ibb.co/68XkL4S/fbdbce0f2b3f.png" }
            ],
            interiors: [
                { id: "int-1", title: "Modern Luxury Apartment", desc: "Sleek living space with contemporary furniture and ambient lighting", image: "https://i.ibb.co/k0nZ5J5/760df891c9cd.png" }
            ],
            models: [
                { id: "mod-1", title: "Futuristic Transport", desc: "Hover vehicle with sleek design and glowing engines", image: "https://i.ibb.co/4WH715K/9e14a1dbbce8.png" }
            ]
        }

        const reviews = [
            { id: "rev-1", name: "fxnix", role: "Client", content: "Sunkye is a competent builder, modeler, and gui artist, whose work I have seen firsthand! I can say from experience, if you need stylized gui, high poly models, or just a build done - give him a dm :)", rating: 5, price: "$120", project: "GUI Design & Modeling", avatarColor: "#7B61FF" },
            { id: "rev-2", name: "24lancelll", role: "Client", content: "Great work with awesome detailing which would provide a riveting experience while playing the map itself!", rating: 5, price: "$85", project: "Map Design", avatarColor: "#4CAF50" },
            { id: "rev-3", name: "Gold_KingVon2001", role: "Client", content: "The model was very well made and worked as fast as possible in a very good timely manner. I would recommend to future customers!!!", rating: 5, price: "$65", project: "Custom Model", avatarColor: "#FFD700" }
        ]

        const skills = [
            { id: "skill-1", title: "Roblox Studio Mastery", desc: "Expert level proficiency in all aspects of Roblox Studio", skills: ["Building", "Lighting", "Terrain", "Optimization"], icon: "Terminal" },
            { id: "skill-2", title: "3D Modeling", desc: "Creating custom assets to enhance build quality", skills: ["Mesh Creation", "UV Mapping", "Texture Design", "Model Optimization"], icon: "Zap" },
            { id: "skill-3", title: "Lighting & Effects", desc: "Creating atmosphere and mood through advanced lighting", skills: ["Dynamic Lighting", "Particle Systems", "Post-Processing", "Time Cycles"], icon: "Star" }
        ]

        // Write directly to MongoDB
        await writeJsonFile('portfolio.json', portfolioItems)
        await writeJsonFile('reviews.json', reviews)
        await writeJsonFile('skills.json', skills)

        return NextResponse.json({ success: true, message: 'Sample data loaded successfully' })
    } catch (error) {
        console.error('[API] Seed Error:', error)
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
    }
}
