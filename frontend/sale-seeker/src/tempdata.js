const dummyItems = [
  {
    id: 1,
    title: "iPhone 12 Pro",
    description:
      "The iPhone 12 Pro is a powerful and feature-packed smartphone with a stunning design.",
    price: 999,
    image: "https://images.kaina24.lt/43/69/apple-iphone-12-pro-1.jpg",
    rating: 4.8,
    category: "Electronics",
  },
  {
    id: 2,
    title: "Samsung Galaxy S21",
    description:
      "The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities. The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities. The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities. ",
    price: 899,
    image: "https://images.kaina24.lt/43/14/samsung-galaxy-s21-128gb-2.jpg",
    rating: 4.7,
    category: "Electronics",
  },
  {
    id: 3,
    title: "Google Pixel 5",
    description:
      "The Google Pixel 5 is a top-notch Android phone with a clean software experience and impressive camera performance.",
    price: 699,
    image: "https://images.kaina24.lt/43/52/google-pixel-5.jpg",
    rating: 4.5,
    category: "Electronics",
  },
  {
    id: 4,
    title: "Razer Blade 15",
    description:
      "The Razer Blade 15 is a high-performance gaming laptop with a sleek design and powerful hardware.",
    price: 1499,
    image:
      "https://www.shop24.lt/images/detailed/790/4zu3_Razer_Blade_15_Advanced_Model_2020.jpg",
    rating: 4.6,
    category: "Electronics",
  },
  {
    id: 5,
    title: "Yamaha YAS-209",
    description:
      "The Yamaha YAS-209 is a high-quality soundbar with built-in Alexa voice control and immersive sound.",
    price: 349,
    image: "https://www.audiocentras.lt/4398-big_default_2x/yamaha-yas-209.jpg",
    rating: 4.7,
    category: "Electronics",
  },
  {
    id: 6,
    title: "Nintendo Switch",
    description:
      "The Nintendo Switch is a versatile gaming console with a unique design and a wide selection of games.",
    price: 299,
    image:
      "https://ksd-images.lt/display/aikido/cache/79ddf8525126efeffa10a64f34c58bbc.jpeg",
    rating: 4.8,
    category: "Electronics",
  },
  {
    id: 7,
    title: "Apple MacBook Pro",
    description:
      "The Apple MacBook Pro is a high-performance laptop with a sleek design and powerful hardware.",
    price: 1999,
    image: "https://images.kaina24.lt/9/2/apple-macbook-pro-13-m2-1.jpg",
    rating: 4.7,
    category: "Electronics",
  },
  {
    id: 8,
    title: "Samsung QLED TV",
    description:
      "The Samsung QLED TV is a top-of-the-line television with stunning picture quality and smart features.",
    price: 1499,
    image:
      "https://images.samsung.com/is/image/samsung/p6pim/lt/qe65q80catxxh/gallery/lt-qled-q80c-qe65q80catxxh-535496721?$650_519_PNG$",
    rating: 4.6,
    category: "Electronics",
  },
  {
    id: 9,
    title: "Sony PlayStation 5",
    description:
      "The Sony PlayStation 5 is a next-generation gaming console with powerful hardware and immersive gaming experiences.",
    price: 499,
    image: "https://images.kaina24.lt/167/21/sony-playstation-5.jpg",
    rating: 4.9,
    category: "Electronics",
  },
  {
    id: 10,
    title: "Bose QuietComfort 35 II",
    description:
      "The Bose QuietComfort 35 II is a premium wireless headphone with excellent noise cancellation and audio quality.",
    price: 299,
    image:
      "https://m.media-amazon.com/images/I/61PzLRRxRbL._AC_UF894,1000_QL80_.jpg",
    rating: 4.8,
    category: "Electronics",
  },
  {
    id: 11,
    title: "Green T-shirt",
    description: "A simple and stylish green t-shirt for everyday wear.",
    price: 19,
    image:
      "https://media.istockphoto.com/id/1209887384/photo/green-t-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=8M4gaRs-fUz6CdYEl4OblIoDvNjcRs8_Sbzs0VxWlMY=",
    rating: 4.5,
    category: "Clothing",
  },
  {
    id: 12,
    title: "Blue Jeans",
    description: "Classic blue jeans for a casual and comfortable look.",
    price: 39,
    image:
      "https://isto.pt/cdn/shop/products/Everyday_Denim_Blue_1.jpg?v=1668613349&width=1946",
    rating: 4.6,
    category: "Clothing",
  },
];

const dummyReviews = [
  {
    id: 1,
    user: "John Doe",
    itemId: 1,
    rating: 4.5,
    comment: "Great product, highly recommended!",
  },
  {
    id: 2,
    user: "Jane Smith",
    itemId: 1,
    rating: 4.0,
    comment: "Good value for the price.",
  },
  {
    id: 3,
    user: "Alex Johnson",
    itemId: 1,
    rating: 4.2,
    comment: "I highly recommend this item!",
  },
  {
    id: 4,
    user: "Sarah Brown",
    itemId: 2,
    rating: 4.8,
    comment: "Excellent product, exceeded my expectations!",
  },
  {
    id: 5,
    user: "Michael Davis",
    itemId: 2,
    rating: 4.5,
    comment: "Great phone, love the camera quality!",
  },
  {
    id: 6,
    user: "Emily Wilson",
    itemId: 2,
    rating: 4.2,
    comment: "Good value for money.",
  },
  {
    id: 7,
    user: "David Thompson",
    itemId: 3,
    rating: 4.7,
    comment: "Impressive camera performance.",
  },
  {
    id: 8,
    user: "Olivia Johnson",
    itemId: 3,
    rating: 4.6,
    comment: "Sleek design and smooth software experience.",
  },
  {
    id: 9,
    user: "Daniel Smith",
    itemId: 4,
    rating: 4.9,
    comment: "Best gaming laptop I've ever used!",
  },
  {
    id: 10,
    user: "Jessica Lee",
    itemId: 4,
    rating: 2.5,
    comment: "Disappointing performance and poor build quality.",
  },
  {
    id: 11,
    user: "Ryan Wilson",
    itemId: 5,
    rating: 3.0,
    comment: "Average sound quality and limited features.",
  },
];

const categories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Books" },
  { id: 4, name: "Home & Kitchen" },
  { id: 5, name: "Beauty & Personal Care" },
  { id: 6, name: "Sports & Outdoors" },
  { id: 7, name: "Toys & Games" },
  { id: 8, name: "Health & Household" },
  { id: 9, name: "Automotive" },
  { id: 10, name: "Tools & Home Improvement" },
  { id: 11, name: "Baby" },
  { id: 12, name: "Pet Supplies" },
  { id: 13, name: "Office Products" },
  { id: 14, name: "Grocery & Gourmet Food" },
  { id: 15, name: "Movies & TV" },
  { id: 16, name: "Music" },
  { id: 17, name: "Industrial & Scientific" },
  { id: 18, name: "Arts, Crafts & Sewing" },
  { id: 19, name: "Patio, Lawn & Garden" },
  { id: 20, name: "Jewelry" },
];

export { dummyItems, dummyReviews };
