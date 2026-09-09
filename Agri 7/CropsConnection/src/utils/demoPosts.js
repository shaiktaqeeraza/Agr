const demoPosts = [
  {
    $id: "demo-post-tomatoes",
    userId: "demo-farmer-asha",
    userName: "Asha Patil (Demo)",
    location: "Nashik, Maharashtra",
    cropName: "Fresh Tomatoes",
    price: "32",
    quantity: "180",
    caption: "Naturally grown tomatoes, ready for local delivery.",
    imageUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
    status: "available",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isDemo: true,
    likeCount: 12,
  },
  {
    $id: "demo-post-wheat",
    userId: "demo-farmer-rajesh",
    userName: "Rajesh Kumar (Demo)",
    location: "Amritsar, Punjab",
    cropName: "Golden Wheat",
    price: "28",
    quantity: "500",
    caption: "Clean, sun-dried wheat from this season's harvest.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    status: "available",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isDemo: true,
    likeCount: 8,
  },
];

export default demoPosts;
