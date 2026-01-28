import { getImagesFromDir, getFirstImageInDir } from "@/lib/asset-utils";

export type ServiceDetail = {
    title: string;
    buttonText: string;
    description: string;
    image: string;
};

export type Service = {
    id: string;
    title: string;
    desc: string;
    fullDescription?: string;
    image: string;
    heroImage?: string;
    details?: ServiceDetail[];
};

// Helper to get images for a service and its details
const getServiceImages = (dir: string) => {
    const images = getImagesFromDir(dir);
    return {
        main: images[0] || "",
        details: [
            images[1] || images[0] || "",
            images[2] || images[0] || "",
            images[3] || images[0] || "",
            images[4] || images[3] || images[0] || ""
        ]
    };
};

const corpImages = getServiceImages("LuxuryCorporateEvents");
const wedImages = getServiceImages("BespokeWeddings&Engagements");
const djImages = getServiceImages("DJNights&PrivateParties");
const bandImages = getServiceImages("TraditionalBands&BrandOpenings");
const cateringImages = getServiceImages("Catering & Culinary Experiences");
const makeupImages = getServiceImages("Makeup&StylingServices");
const pastryImages = getServiceImages("Pastries & Celebration Cakes");
const balloonImages = getServiceImages("Balloon Décor & Birthday Celebrations");
const socialImages = getServiceImages("Private & Social Celebrations");
const instImages = getServiceImages("Schools, Colleges & University Event Services");

export const services: Service[] = [
    {
        id: "corporate",
        title: "Luxury Corporate Events",
        desc: "Strategic gatherings designed with precision and brand excellence.",
        fullDescription: "At Grey Giant Events & Services, we curate high-impact corporate events that embody brand excellence, strategic intent, and refined execution. From executive meetings to large-scale corporate galas, every event is thoughtfully designed with precision—balancing elegant aesthetics, seamless coordination, and a professional ambiance that reflects your organization’s identity.",
        image: corpImages.main,
        heroImage: corpImages.main,
        details: [
            {
                title: "Executive Meetings",
                buttonText: "Explore Meetings",
                image: corpImages.details[0],
                description: "High-end, modern boardrooms featuring a professional ambiance for strategic decision-making."
            },
            {
                title: "Gala Dinners",
                buttonText: "View Galas",
                image: corpImages.details[1],
                description: "Elegantly set gala dinner tables with fine china, crystal glassware, and exquisite floral arrangements."
            },
            {
                title: "Award Ceremonies",
                buttonText: "View Ceremonies",
                image: corpImages.details[2],
                description: "Capturing the prestige of corporate recognition with professional trophy and stage setups."
            },
            {
                title: "Corporate Networking",
                buttonText: "Plan Event",
                image: corpImages.details[3],
                description: "Sophisticated networking environments designed to foster connections and brand growth."
            }
        ]
    },
    {
        id: "weddings",
        title: "Bespoke Weddings & Engagements",
        desc: "Personalized celebrations crafted with timeless elegance.",
        fullDescription: "At Grey Giant Events & Services, we create bespoke weddings and engagements that are deeply personal, emotionally rich, and timeless in design. Every celebration is thoughtfully curated to reflect your story—blending elegant décor, refined aesthetics, and seamless flow to craft moments that feel intimate yet grand.",
        image: wedImages.main,
        heroImage: wedImages.main,
        details: [
            {
                title: "Engagement Soirées",
                buttonText: "View Engagements",
                image: wedImages.details[0],
                description: "Intimate and luxury settings for engagement toasts and celebratory gatherings."
            },
            {
                title: "Mandap & Rituals",
                buttonText: "Explore Rituals",
                image: wedImages.details[1],
                description: "Grand ceremonial scenes featuring ornate floral ceilings and traditional elegance."
            },
            {
                title: "Reception Galas",
                buttonText: "View Receptions",
                image: wedImages.details[2],
                description: "Sophisticated reception halls with grand chandeliers and premium dining setups."
            },
            {
                title: "Bridal Suites",
                buttonText: "Design Your Wedding",
                image: wedImages.details[3],
                description: "Luxury preparation spaces designed for comfort and elegance before the big moment."
            }
        ]
    },
    {
        id: "dj-nights",
        title: "DJ Nights & Private Parties",
        desc: "High-energy music experiences designed to elevate celebrations.",
        fullDescription: "Our DJ Nights & Private Parties are designed to energize, excite, and elevate every celebration. With high-quality sound, dynamic lighting, and curated music experiences, we transform ordinary spaces into vibrant party destinations that keep the energy alive all night long.",
        image: djImages.main,
        heroImage: djImages.main,
        details: [
            {
                title: "Professional DJ Setups",
                buttonText: "View Setups",
                image: djImages.details[0],
                description: "High-end audio equipment and atmospheric lighting for a professional performance."
            },
            {
                title: "Dance Floor Energy",
                buttonText: "Explore Vibes",
                image: djImages.details[1],
                description: "Immersive dance floor experiences with dynamic light beams and vibrant crowds."
            },
            {
                title: "Private Lounge Parties",
                buttonText: "View Lounges",
                image: djImages.details[2],
                description: "Sophisticated lounge areas with refined ambiance for exclusive social gatherings."
            },
            {
                title: "Themed Party Decor",
                buttonText: "Turn Up Celebration",
                image: djImages.details[3],
                description: "Customized party environments with premium bar service and creative lighting."
            }
        ]
    },
    {
        id: "bands",
        title: "Traditional Bands & Brand Openings",
        desc: "Cultural performances and ceremonial elements for grand launches.",
        fullDescription: "We specialize in grand brand openings and ceremonial events that blend cultural richness with professional execution. From traditional performances to formal launch ceremonies, our events are designed to create powerful first impressions while honoring heritage, symbolism, and occasion.",
        image: bandImages.main,
        heroImage: bandImages.main,
        details: [
            {
                title: "Cultural Performances",
                buttonText: "Explore Performance",
                image: bandImages.details[0],
                description: "Classical and folk dance performances capturing the elegance and tradition of the region."
            },
            {
                title: "Dollu Kunitha",
                buttonText: "View Folk",
                image: bandImages.details[1],
                description: "Energetic and rhythmic drum dance, a powerful folk tradition of the region."
            },
            {
                title: "Huli Kunitha",
                buttonText: "View Tiger Dance",
                image: bandImages.details[2],
                description: "The iconic Tiger Dance featuring intricate body painting and powerful movements."
            },
            {
                title: "Brand Inaugurations",
                buttonText: "Plan Launch",
                image: bandImages.details[3],
                description: "Professional ribbon-cutting ceremonies for high-end brand launches and openings."
            }
        ]
    },
    {
        id: "catering",
        title: "Catering & Culinary Experiences",
        desc: "Curated menus and refined presentation for every occasion.",
        fullDescription: "Our catering services combine exceptional presentation, hygiene excellence, and operational precision to deliver premium dining experiences across corporate, wedding, and social events.",
        image: cateringImages.main,
        heroImage: cateringImages.main,
        details: [
            {
                title: "Luxury Buffets",
                buttonText: "Explore Buffets",
                image: cateringImages.details[0],
                description: "Grand displays of gourmet dishes with elegant presentation and diverse flavors."
            },
            {
                title: "Fine Dining",
                buttonText: "View Service",
                image: cateringImages.details[1],
                description: "Professional table service and curated menus for a sophisticated dining experience."
            },
            {
                title: "Live Counters",
                buttonText: "View Live Cooking",
                image: cateringImages.details[2],
                description: "Interactive culinary experiences with professional chefs preparing gourmet dishes live."
            },
            {
                title: "Table Aesthetics",
                buttonText: "Taste Experience",
                image: cateringImages.details[3],
                description: "Sophisticated fine-dining arrangements with premium glassware and linens."
            }
        ]
    },
    {
        id: "makeup",
        title: "Makeup & Styling Services",
        desc: "Professional artistry designed for elegance and confidence.",
        fullDescription: "Our Makeup & Styling Services are designed to enhance confidence, elegance, and individuality. Whether for weddings, parties, or special events, our professional artists focus on refined finishes, flawless techniques, and looks that complement your personality and occasion.",
        image: makeupImages.main,
        heroImage: makeupImages.main,
        details: [
            {
                title: "Bridal Artistry",
                buttonText: "View Bridal",
                image: makeupImages.details[0],
                description: "Flawless, high-end bridal makeup tailored to your unique style and vision."
            },
            {
                title: "Hair Styling",
                buttonText: "Explore Styles",
                image: makeupImages.details[1],
                description: "Professional hair design for weddings, galas, and special celebrations."
            },
            {
                title: "Professional Kits",
                buttonText: "View Artistry",
                image: makeupImages.details[2],
                description: "Using only premium cosmetics and tools to ensure a long-lasting, radiant finish."
            },
            {
                title: "Nail Design",
                buttonText: "Enhance Look",
                image: makeupImages.details[3],
                description: "Sophisticated and elegant nail art for a complete and polished look."
            }
        ]
    },
    {
        id: "pastries",
        title: "Pastries & Celebration Cakes",
        desc: "Artfully crafted desserts designed for memorable moments.",
        fullDescription: "Our pastry and cake services are a blend of culinary art and celebration. We specialize in bespoke cakes and gourmet desserts that are as visually stunning as they are delicious.",
        image: pastryImages.main,
        heroImage: pastryImages.main,
        details: [
            {
                title: "Designer Cakes",
                buttonText: "View Designs",
                image: pastryImages.details[0],
                description: "Bespoke tiered cakes with intricate details and personalized themes."
            },
            {
                title: "Gourmet Pastries",
                buttonText: "Explore Pastries",
                image: pastryImages.details[1],
                description: "An assortment of fine French-style pastries and delicate treats."
            },
            {
                title: "Dessert Tables",
                buttonText: "View Tables",
                image: pastryImages.details[2],
                description: "Lavishly decorated dessert spreads featuring a variety of high-end sweets."
            },
            {
                title: "Cake Ceremonies",
                buttonText: "Sweeten Celebration",
                image: pastryImages.details[3],
                description: "Capturing the joy of celebration with beautiful cake cutting moments."
            }
        ]
    },
    {
        id: "balloon",
        title: "Balloon Décor & Birthday Celebrations",
        desc: "Creative balloon styling for joyful and vibrant occasions.",
        fullDescription: "Our Balloon Décor & Birthday Celebrations bring color, creativity, and joy to every occasion. From themed birthday setups to vibrant balloon installations, we transform spaces into lively, festive environments that delight guests of all ages.",
        image: balloonImages.main,
        heroImage: balloonImages.main,
        details: [
            {
                title: "Themed Setups",
                buttonText: "Explore Decor",
                image: balloonImages.details[0],
                description: "Elaborate themed birthday environments with creative balloon installations."
            },
            {
                title: "Balloon Arches",
                buttonText: "View Designs",
                image: balloonImages.details[1],
                description: "Sophisticated balloon arches designed to create a grand entrance or backdrop."
            },
            {
                title: "Kids Celebrations",
                buttonText: "Plan Event",
                image: balloonImages.details[2],
                description: "Vibrant and joyful party setups tailored for children's birthdays."
            },
            {
                title: "Accent Decor",
                buttonText: "Celebrate in Style",
                image: balloonImages.details[3],
                description: "Matching balloon accents and table decor for a cohesive celebration theme."
            }
        ]
    },
    {
        id: "social",
        title: "Private & Social Celebrations",
        desc: "Intimate gatherings designed with elegance and personal touch.",
        fullDescription: "We design private and social celebrations that focus on warmth, elegance, and meaningful connections. From intimate dinners to small social gatherings, our events are curated with subtle luxury, personalized styling, and a relaxed yet refined atmosphere.",
        image: socialImages.main,
        heroImage: socialImages.main,
        details: [
            {
                title: "Intimate Dinners",
                buttonText: "Explore Dinners",
                image: socialImages.details[0],
                description: "Luxury candlelit dining experiences in private and serene settings."
            },
            {
                title: "Cocktail Parties",
                buttonText: "View Parties",
                image: socialImages.details[1],
                description: "Sophisticated social events with premium bar service and elegant ambiance."
            },
            {
                title: "Garden Gatherings",
                buttonText: "View Garden Events",
                image: socialImages.details[2],
                description: "High-end outdoor celebrations with premium seating and floral decor."
            },
            {
                title: "Social Soirées",
                buttonText: "Create Celebration",
                image: socialImages.details[3],
                description: "Refined indoor social events designed for meaningful connections."
            }
        ]
    },
    {
        id: "institutional",
        title: "Schools, Colleges & University Events",
        desc: "Professional planning and seamless execution of academic, cultural, and institutional events.",
        fullDescription: "We provide professional, institution-friendly event solutions for schools, colleges, and universities, ensuring structured planning and smooth execution across academic and cultural events.",
        image: instImages.main,
        heroImage: instImages.main,
        details: [
            {
                title: "Cultural Festivals",
                buttonText: "Explore Fests",
                image: instImages.details[0],
                description: "Grand stage setups and professional management for large-scale institutional festivals."
            },
            {
                title: "Convocations",
                buttonText: "View Formal Events",
                image: instImages.details[1],
                description: "Prestigious graduation ceremonies handled with formal protocol and excellence."
            },
            {
                title: "Seminars",
                buttonText: "Explore Seminars",
                image: instImages.details[2],
                description: "Modern academic conference setups with professional AV and coordination."
            },
            {
                title: "Academic Awards",
                buttonText: "View Ceremonies",
                image: instImages.details[3],
                description: "Grand award ceremonies in prestigious halls, celebrating academic achievement."
            }
        ]
    }
];
