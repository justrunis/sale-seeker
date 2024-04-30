import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../../../public/logos/png/logo-color.png";
import Header from "../Header";

export default function AboutUs() {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const yLogo = useTransform(scrollYProgress, [0, 200], [0, -150]);

  return (
    <div>
      <Header />
      <motion.div
        style={{
          opacity,
          transform: `translateY(-${translateY}%)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mt-10">About us</h1>
        <motion.img
          src={logo}
          alt="Logo"
          className="w-64 h-64 object-contain p-8"
        />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </motion.div>
    </div>
  );
}
