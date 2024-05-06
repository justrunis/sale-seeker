import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Header";

import logo from "../../../public/logos/png/logo-color.png";
import welcomeImage from "../../../public/images/welcome.jpg";

export default function Welcome() {
  return (
    <div
      className="flex flex-col h-screen"
      style={{
        backgroundImage: `url(${welcomeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <div className="flex flex-col items-center justify-center h-full">
        <motion.img
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          src={logo}
          alt="Sale Seeker"
          className="h-32 w-32"
        />
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-4xl font-bold mt-5 text-black"
        >
          Welcome to Sale Seeker
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-xl mt-4 text-black"
        >
          Find the best deals on the internet
        </motion.p>
        <div className="max-w-md text-justify">
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-lg mt-8 text-black "
          >
            Sale Seeker brings you the latest deals and discounts from your
            favorite stores. Explore a wide range of products and save big on
            your purchases!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
            className="text-lg mt-8 text-black"
          >
            With Sale Seeker, you can easily compare prices and find the best
            offers available. Save time and money by shopping smart!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="text-lg mt-8 text-black"
          >
            Discover new products, get exclusive discounts, and stay up to date
            with the latest trends in online shopping with Sale Seeker.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="mt-8 flex justify-center"
          >
            <Link
              to="/home"
              className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
            >
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
