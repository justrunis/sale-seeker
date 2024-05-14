import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../Header";
import { Link } from "react-router-dom";
import { FaReact, FaNodeJs, FaCreditCard, FaGithub } from "react-icons/fa";
import {
  TbBrandFramerMotion,
  TbBrandRedux,
  TbBrandTailwind,
} from "react-icons/tb";
import { SiPostgresql, SiReactquery } from "react-icons/si";
import { GrToast } from "react-icons/gr";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-10 bg-secondary h-100 flex-grow">
        <h1 className="text-3xl font-bold uppercase mb-10 text-center">
          About this website
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="menu bg-base-100 rounded-box py-12 flex flex-col"
          >
            <h2 className="text-2xl font-semibold mb-10">Sale Seeker</h2>
            <div className="text-base">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <p>
                  Sale Seeker is a platform that allows users to buy items
                  online. Users can create an account and purchase items from
                  the store and rate them via star system. Administrator can
                  manage users, items, and orders. Sale Seeker is a great way to
                  find deals on items you need.
                </p>
              </motion.div>
              <br />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <p className="text-lg font-semibold">
                  Here are some key functionalities for the User:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>Create an account to access personalized features</li>
                  <li>Browse a wide range of items available for purchase</li>
                  <li>Rate items using a star rating system</li>
                  <li>Manage user profiles and preferences</li>
                  <li>Add items to a shopping cart for easy checkout</li>
                  <li>View order history and track shipping status</li>
                  <li>Contact customer support for assistance</li>
                </ul>
              </motion.div>
              <br />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <p className="text-lg font-semibold">
                  Here are some key functionalities for the Seller:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>Add, edit, and delete items in the store</li>
                  <li>Set prices and update inventory levels</li>
                  <li>View and respond to customer reviews</li>
                </ul>
              </motion.div>
              <br />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1 }}
              >
                <p className="text-lg font-semibold">
                  Here are some key functionalities for the Admin:
                </p>
                <ul className="list-disc list-inside pl-4">
                  <li>Manage user accounts and permissions</li>
                  <li>Add, edit, and delete items in the store</li>
                  <li>View and process orders from customers</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="menu bg-base-100 rounded-box py-12 flex flex-col"
          >
            <h2 className="text-2xl font-semibold mb-2">Used technologies</h2>
            <div className="grid grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-base rounded-lg p-2"
              >
                <FaReact className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">React</h3>
                <p>A JavaScript library for building user interfaces.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="bg-base rounded-lg p-2"
              >
                <FaNodeJs className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">ExpressJs</h3>
                <p>A backend framework for Node.js.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="bg-base rounded-lg p-2"
              >
                <SiPostgresql className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">PostgreSQL</h3>
                <p>
                  A powerful, open source object-relational database system.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1 }}
                className="bg-base rounded-lg p-2"
              >
                <TbBrandFramerMotion className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">Framer Motion</h3>
                <p>An open source and production-ready motion library.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="bg-base rounded-lg p-2"
              >
                <TbBrandRedux className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">Redux</h3>
                <p>A powerful state container for JavaScript apps.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.4 }}
                className="bg-base rounded-lg p-2"
              >
                <SiReactquery className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">TanStack Query</h3>
                <p>
                  A data-fetching library for React that helps you fetch, cache,
                  and update data in your React applications.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.6 }}
                className="bg-base rounded-lg p-2"
              >
                <GrToast className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">React Toastify</h3>
                <p>
                  A React library that helps you add notifications to your app.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.8 }}
                className="bg-base rounded-lg p-2"
              >
                <FaReact className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">React Icons</h3>
                <p>
                  A library that provides popular icons for your React projects.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 2 }}
                className="bg-base rounded-lg p-2"
              >
                <FaCreditCard className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">React Credit Cards</h3>
                <p>
                  A library that provides credit card components for your React
                  projects.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 2.2 }}
                className="bg-base rounded-lg p-2"
              >
                <TbBrandTailwind className="text-4xl text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold">Tailwind and daisyUI</h3>
                <p>
                  A utility-first CSS framework for rapidly building custom
                  designs.
                </p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="menu bg-base-100 rounded-box py-12 flex flex-col"
          >
            <h2 className="text-2xl font-semibold mb-10">Contact me</h2>
            <p className="text-base">
              Thank you for your interest in Sale Seeker! If you have any
              questions, feedback, or inquiries, please don't hesitate to reach
              out to me.
              <br />
              <br />
              You can contact me through various channels:
              <br />
              <br />
              <ul className="list-disc list-inside pl-4">
                <li>
                  Send me a message on{" "}
                  <a
                    href="https://github.com/justrunis"
                    className="text-blue-500 hover:underline"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  Connect with me on{" "}
                  <a
                    href="https://discord.com/users/264059136378011649"
                    className="text-blue-500 hover:underline"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  Write me an email at{" "}
                  <a
                    href="mailto:justrunis@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    justrunis@gmail.com
                  </a>
                </li>
              </ul>
              <br />
              I'm looking forward to hearing from you and will do my best to
              respond promptly.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
