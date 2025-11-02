import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Hero from "../../Components/Hero/Hero"; 
import { motion, AnimatePresence } from "framer-motion";

import { MapPin, Phone, Mail, Clock, ChevronDown } from "lucide-react";

import contactHeroImage from "../../assets/image07.webp";

const faqs = [
  {
    question: "Do you offer delivery?",
    answer:
      "Yes, FurniQ offers free delivery for all orders over $500 within the Matara district. For other areas, standard delivery charges apply.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on all non-custom items. The item must be in its original condition and packaging. Please visit our showroom or contact us to initiate a return.",
  },
  {
    question: "Can I order custom furniture?",
    answer:
      "Absolutely! We specialize in custom-made furniture. Please visit our showroom or email us at furniq@gmail.com with your requirements, and our design team will get in touch.",
  },
  {
    question: "How long will my order take?",
    answer:
      "In-stock items are typically delivered within 3-5 business days. Custom orders may take between 4-8 weeks, depending on the complexity and materials.",
  },
];

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });


  const [openFaq, setOpenFaq] = useState(null);
  

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    alert("Thank you for your message!");

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <div className="bg-white font-sans">

        <Hero
          image={contactHeroImage}
          title={<span className="text-amber-400">Get in Touch</span>}
          subtitle="We’d love to hear from you. Whether you have a question about our products, an order, or just want to say hello."
        />


        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
                Contact Details
              </h2>
              <div className="space-y-6 mb-8">
                <a
                  href="https://goo.gl/maps/bY9zEb2N3vR8Z2qF7" 
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
                <div className="flex items-start text-lg text-gray-700">
                  <Clock className="w-6 h-6 text-amber-400 mr-4 flex-shrink-0 mt-1" />
                  <span>
                    <strong>Open Hours:</strong>
                    <br />
                    Mon - Fri: 9:00 AM - 7:00 PM
                    <br />
                    Sat - Sun: 10:00 AM - 5:00 PM
                  </span>
                </div>
              </div>
              {/* Map Embed */}
              <div className="h-64 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.106437989354!2d80.5204489147679!3d5.957713995633519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae139b0394c8f35%3A0x833b6f1218f4a1f!2sNupe%2C%20Matara!5e0!3m2!1sen!2slk!4v1678888888888!5m2!1sen!2slk" // Placeholder
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl shadow-xl"
                ></iframe>
              </div>
            </motion.div>

            {/* Column 2: Contact Form */}
            <motion.div
              className="bg-neutral-50 p-8 md:p-12 rounded-2xl shadow-lg border border-neutral-200/80"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-gray-700 block mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-gray-700 block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="text-gray-700 block mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="text-gray-700 block mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  ></textarea>
                </div>
                <div>
                  <motion.button
                    type="submit"
                    className="w-full bg-amber-400 text-black py-3 px-6 rounded-lg font-semibold text-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Send Message
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>


        <section className="py-20 bg-neutral-50">
          <div className="max-w-4xl mx-auto px-5">
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-16"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = index === openFaq;
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden"
                    initial={false}
                    animate={{
                      backgroundColor: isOpen ? "#fff" : "#fff",
                      borderColor: isOpen ? "#fde047" : "#e5e5e5",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex justify-between items-center text-left p-6"
                    >
                      <span className="text-lg font-semibold text-gray-800">
                        {faq.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-gray-500" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial="collapsed"
                          animate="visible"
                          exit="collapsed"
                          variants={{
                            visible: {
                              opacity: 1,
                              height: "auto",
                              marginTop: "0px",
                              marginBottom: "24px",
                            },
                            collapsed: {
                              opacity: 0,
                              height: 0,
                              marginTop: "0px",
                              marginBottom: "0px",
                            },
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="px-6"
                        >
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Contact;