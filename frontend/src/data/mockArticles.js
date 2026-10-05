const mockArticles = [
    {
      id: 1,
      title: "ChatGPT 5 Launches with Major Upgrades",
      slug: "chatgpt-5-launches",
      summary: "OpenAI's newest model brings major reasoning upgrades.",
      content: "OpenAI has officially launched ChatGPT 5 with significant improvements in reasoning, speed, and multimodal understanding. The model shows major gains in coding and complex problem solving.",
      coverImage: "https://placehold.co/600x400?text=ChatGPT+5",
      category: "Artificial Intelligence",
      author: "Rahil Koshti",
      status: "published",
      views: 128,
      tags: ["AI", "OpenAI", "ChatGPT"]
    },
    {
      id: 2,
      title: "Apple Unveils New M5 Chip",
      slug: "apple-m5-chip",
      summary: "Apple's latest silicon promises a huge leap in performance.",
      content: "Apple has introduced its new M5 chip, featuring improved GPU cores, better battery efficiency, and faster neural engine performance for on-device AI tasks.",
      coverImage: "https://placehold.co/600x400?text=Apple+M5",
      category: "Gadgets",
      author: "Priya Shah",
      status: "published",
      views: 89,
      tags: ["Apple", "Hardware", "Chip"]
    },
    {
      id: 3,
      title: "Startup Raises $20M for Quantum Computing",
      slug: "quantum-startup-funding",
      summary: "A new startup is pushing boundaries in quantum research.",
      content: "A Bangalore-based quantum computing startup has raised $20 million in Series A funding to scale its quantum processor research and development.",
      coverImage: "https://placehold.co/600x400?text=Quantum+Computing",
      category: "Startups",
      author: "Rahil Koshti",
      status: "published",
      views: 54,
      tags: ["Quantum", "Startup", "Funding"]
    }
  ];
  
  export const mockComments = [
    { id: 1, articleSlug: "chatgpt-5-launches", user: "Amit", text: "Really excited about this!" },
    { id: 2, articleSlug: "chatgpt-5-launches", user: "Neha", text: "Does it support multimodal input?" },
  ];
  
  export default mockArticles;