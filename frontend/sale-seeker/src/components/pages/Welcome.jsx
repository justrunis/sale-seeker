import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../Header";

import logo from "../../../public/logos/png/logo-color.png";

export default function Welcome() {
  return (
    <div className="flex flex-col h-screen">
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
          className="text-4xl font-bold mt-5"
        >
          Welcome to Sale Seeker
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-xl mt-4"
        >
          Find the best deals on the internet
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-8"
        >
          <Link
            to="/home"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
