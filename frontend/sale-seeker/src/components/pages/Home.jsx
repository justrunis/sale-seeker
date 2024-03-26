import Header from "../Header";
import ItemCard from "../ItemCard";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../../store/slices/itemsSlice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const dummyItems = [
    {
      id: 1,
      title: "iPhone 12 Pro",
      description:
        "The iPhone 12 Pro is a powerful and feature-packed smartphone with a stunning design.",
      price: 999,
      image: "https://images.kaina24.lt/43/69/apple-iphone-12-pro-1.jpg",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Samsung Galaxy S21",
      description:
        "The Samsung Galaxy S21 is a flagship Android smartphone with a beautiful display and excellent camera capabilities.",
      price: 899,
      image: "https://images.kaina24.lt/43/14/samsung-galaxy-s21-128gb-2.jpg",
      rating: 4.7,
    },
    {
      id: 3,
      title: "Google Pixel 5",
      description:
        "The Google Pixel 5 is a top-notch Android phone with a clean software experience and impressive camera performance.",
      price: 699,
      image: "https://images.kaina24.lt/43/52/google-pixel-5.jpg",
      rating: 4.5,
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
    },
    {
      id: 5,
      title: "Yamaha YAS-209",
      description:
        "The Yamaha YAS-209 is a high-quality soundbar with built-in Alexa voice control and immersive sound.",
      price: 349,
      image:
        "https://www.audiocentras.lt/4398-big_default_2x/yamaha-yas-209.jpg",
      rating: 4.7,
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
    },
    {
      id: 7,
      title: "Apple MacBook Pro",
      description:
        "The Apple MacBook Pro is a high-performance laptop with a sleek design and powerful hardware.",
      price: 1999,
      image: "https://images.kaina24.lt/9/2/apple-macbook-pro-13-m2-1.jpg",
      rating: 4.7,
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
    },
    {
      id: 9,
      title: "Sony PlayStation 5",
      description:
        "The Sony PlayStation 5 is a next-generation gaming console with powerful hardware and immersive gaming experiences.",
      price: 499,
      image: "https://images.kaina24.lt/167/21/sony-playstation-5.jpg",
      rating: 4.9,
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
    },
  ];

  useEffect(() => {
    async function getAllItems() {
      dispatch(itemsActions.setItems(dummyItems));
    }
    getAllItems();
  }, []);

  const items = useSelector((state) => state.items.items);

  return (
    <>
      <Header />
      <div className="container mx-auto px-auto">
        <h1 className="text-3xl font-bold text-center mt-10">Home</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 justify-items-center align-items-center">
          {items.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}