import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

import Hero from "../../Components/Hero/Hero";

import aboutHeroImage from "../../assets/hero02.webp"; 
import aboutStoryImage from "../../assets/image03.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function About() {
  const values = [
    {
      title: "Unmatched Quality",
      description:
        "Every piece is crafted from the finest materials, built to last and to be cherished for generations.",
    },
    {
      title: "Timeless Design",
      description:
        "We blend classic craftsmanship with modern aesthetics to create furniture that is both elegant and timeless.",
    },
    {
      title: "Customer Focus",
      description:
        "Your home is your sanctuary. We are dedicated to helping you find the perfect pieces to complete it.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-white font-sans">
        <Hero
          image={aboutHeroImage}
          title={
            <>
              About <span className="text-amber-400">FurniQ</span>
            </>
          }
          subtitle="Crafting timeless furniture for the modern home. We believe in quality, design, and comfort that lasts a lifetime."
        />

        {/* Section 2: Our Story & Image */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <img
                src={aboutStoryImage}
                alt="FurniQ Showroom Interior"
                className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
              />
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 relative">
                <span className="relative z-10">Our Story</span>
                <span className="absolute left-0 top-2 w-20 h-1 bg-amber-300 rounded-full z-0"></span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                Welcome to{" "}
                <span className="font-bold text-gray-800">FurniQ</span>, where
                our passion for design meets the art of craftsmanship. Founded
                on the principle that furniture should be both beautiful and
E               enduring, our journey began with a simple idea: to bring
                high-quality, stylish, and comfortable pieces into every home.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg font-light">
                From our showroom in Matara, we source and design collections
                that speak to a modern sensibility while honoring traditional
                techniques. We are more than just a furniture store; we are
                curators of comfort and style, dedicated to helping you create
                a space that truly feels like home.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Our Values */}
        <section className="py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-16"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  className="bg-white rounded-2xl p-8 text-center 
                             border border-neutral-200/80 shadow-lg shadow-black/5 
                             hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  variants={itemVariants}
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section 4: Contact & Location */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
                Visit Our Showroom
              </h2>
              <div className="space-y-6">
                <a
                  href="https://goo.gl/maps/bY9zEb2N3vR8Z2qF7" // Example Google Maps link for Nupe Junction
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start text-lg text-gray-700 hover:text-amber-500 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-amber-400 mr-4 flex-shrink-0 mt-1" />
                  <span>No. 112/2, Nupe Junction, Matara</span>
                </a>
                <a
                  href="tel:0412226512"
                  className="flex items-center text-lg text-gray-700 hover:text-amber-500 transition-colors"
                >
                  <Phone className="w-6 h-6 text-amber-400 mr-4 flex-shrink-0" />
                  <span>041 2226512</span>
                </a>
                <a
                  href="mailto:furniq@gmail.com"
                  className="flex items-center text-lg text-gray-700 hover:text-amber-500 transition-colors"
                >
                  <Mail className="w-6 h-6 text-amber-400 mr-4 flex-shrink-0" />
                  <span>furniq@gmail.com</span>
                </a>
              </div>
            </motion.div>

            {/* Google Map Embed */}
            <motion.div
              className="h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.106437989354!2d80.5204489147679!3d5.957713995633519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae139b0394c8f35%3A0x833b6f1218f4a1f!2sNupe%2C%20Matara!5e0!3m2!1sen!2slk!4v1678888888888!5m2!1sen!2slk" // Placeholder for Nupe Junction, Matara
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl shadow-xl"
              ></iframe>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default About;