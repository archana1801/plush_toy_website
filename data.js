// Namaste Overseas - Product Database (53 Premium Plush Toys)

const categories = [
  "Classic Teddy",
  "Safari Friends",
  "Cute Bunnies & Pets",
  "Marine Life",
  "Fantasy & Whimsical",
  "Custom Mascots"
];

const materials = [
  "Super Soft Velvet",
  "Premium Microfiber",
  "Organic Cotton Sherpa",
  "Hypoallergenic Polyester"
];

const sizes = [
  "Small (15-20 cm)",
  "Medium (25-30 cm)",
  "Large (40-45 cm)",
  "Giant (55-60 cm)"
];

// Product base definitions to generate high-quality product records
const baseProductDetails = [
  { name: "Honey Classic Teddy", category: "Classic Teddy", material: "Super Soft Velvet", size: "Medium (25-30 cm)" },
  { name: "Fluffy Cotton Bunny", category: "Cute Bunnies & Pets", material: "Organic Cotton Sherpa", size: "Medium (25-30 cm)" },
  { name: "Safari Spotted Giraffe", category: "Safari Friends", material: "Premium Microfiber", size: "Large (40-45 cm)" },
  { name: "Ocean Blue Whale", category: "Marine Life", material: "Hypoallergenic Polyester", size: "Large (40-45 cm)" },
  { name: "Enchanted Violet Unicorn", category: "Fantasy & Whimsical", material: "Super Soft Velvet", size: "Medium (25-30 cm)" },
  { name: "Custom Brand Mascot Bear", category: "Custom Mascots", material: "Premium Microfiber", size: "Medium (25-30 cm)" },
  { name: "Baby Brown Bear", category: "Classic Teddy", material: "Organic Cotton Sherpa", size: "Small (15-20 cm)" },
  { name: "Playful Pink Bunny", category: "Cute Bunnies & Pets", material: "Super Soft Velvet", size: "Small (15-20 cm)" },
  { name: "Jungle King Lion", category: "Safari Friends", material: "Premium Microfiber", size: "Large (40-45 cm)" },
  { name: "Cozy Giant Panda", category: "Safari Friends", material: "Super Soft Velvet", size: "Giant (55-60 cm)" },
  { name: "Silly Grey Koala", category: "Cute Bunnies & Pets", material: "Organic Cotton Sherpa", size: "Medium (25-30 cm)" },
  { name: "Sparkle Winged Dragon", category: "Fantasy & Whimsical", material: "Premium Microfiber", size: "Large (40-45 cm)" },
  { name: "Deep Sea Dolphin", category: "Marine Life", material: "Super Soft Velvet", size: "Medium (25-30 cm)" },
  { name: "Little Elephant Plush", category: "Safari Friends", material: "Hypoallergenic Polyester", size: "Small (15-20 cm)" },
  { name: "Snuggly Winter Penguin", category: "Marine Life", material: "Organic Cotton Sherpa", size: "Small (15-20 cm)" },
  { name: "Llama Sweetheart", category: "Cute Bunnies & Pets", material: "Super Soft Velvet", size: "Large (40-45 cm)" },
  { name: "Retro Patchwork Teddy", category: "Classic Teddy", material: "Organic Cotton Sherpa", size: "Medium (25-30 cm)" },
  { name: "Forest Red Fox", category: "Safari Friends", material: "Premium Microfiber", size: "Small (15-20 cm)" },
  { name: "Rainbow Narwhal", category: "Marine Life", material: "Super Soft Velvet", size: "Medium (25-30 cm)" },
  { name: "Lazy Sloth Companion", category: "Safari Friends", material: "Hypoallergenic Polyester", size: "Medium (25-30 cm)" },
  { name: "Creamy Velvet Bunny", category: "Cute Bunnies & Pets", material: "Super Soft Velvet", size: "Large (40-45 cm)" },
  { name: "Royal Guard Lion", category: "Custom Mascots", material: "Premium Microfiber", size: "Large (40-45 cm)" },
  { name: "Happy Hippo Plush", category: "Safari Friends", material: "Hypoallergenic Polyester", size: "Medium (25-30 cm)" },
  { name: "Fancy Starry Pegasus", category: "Fantasy & Whimsical", material: "Super Soft Velvet", size: "Large (40-45 cm)" },
  { name: "Chubby Polar Bear", category: "Marine Life", material: "Organic Cotton Sherpa", size: "Giant (55-60 cm)" },
  { name: "Hoppy Meadow Frog", category: "Cute Bunnies & Pets", material: "Premium Microfiber", size: "Small (15-20 cm)" },
  { name: "Sleepy Sheep Plush", category: "Cute Bunnies & Pets", material: "Organic Cotton Sherpa", size: "Medium (25-30 cm)" },
  { name: "Highland Fluffy Cow", category: "Cute Bunnies & Pets", material: "Super Soft Velvet", size: "Large (40-45 cm)" },
  { name: "Playful Tiger Cub", category: "Safari Friends", material: "Premium Microfiber", size: "Medium (25-30 cm)" },
  { name: "Stardust Purple Cat", category: "Fantasy & Whimsical", material: "Super Soft Velvet", size: "Small (15-20 cm)" }
];

// Generate products array dynamically to cover all 53 files with exact extensions
const products = [];

for (let i = 1; i <= 53; i++) {
  // Determine file extension based on listing
  let ext = "jpg";
  if (i >= 43 && i <= 48) {
    ext = "jpeg";
  } else if (i === 49) {
    ext = "png";
  } else if (i >= 50 && i <= 52) {
    ext = "jpeg";
  } else if (i === 53) {
    ext = "png";
  }

  // Pick attributes deterministically based on index to ensure complete, clean mock data
  const baseIndex = (i - 1) % baseProductDetails.length;
  const base = baseProductDetails[baseIndex];
  
  // Custom naming variation based on index to keep names unique
  let name = base.name;
  if (i > baseProductDetails.length) {
    const round = Math.ceil(i / baseProductDetails.length);
    name = `${base.name} (Series ${round})`;
  }
  
  // Add product object
  products.push({
    id: i,
    name: name,
    category: base.category,
    size: sizes[i % sizes.length],
    material: materials[i % materials.length],
    image: `assets/products/Product ${i}.${ext}`,
    moq: "1000 pcs",
    packaging: `Export-grade corrugated box (${i % 2 === 0 ? "24 pcs" : "36 pcs"}/carton, polybagged per unit)`,
    description: `A premium, export-quality ${base.category.toLowerCase()} plush toy. Crafted with high-density ${materials[i % materials.length].toLowerCase()} and featuring reinforced child-safe lock-stitching. Meets global safety guidelines including EN71 and ASTM standards.`,
    features: [
      "EN71 Part 1, 2, 3 Compliant",
      "Hypoallergenic Filling",
      "Stitch-reinforced Seams",
      "100% Machine Washable"
    ]
  });
}

// Export data for use in script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products, categories, materials, sizes };
}
