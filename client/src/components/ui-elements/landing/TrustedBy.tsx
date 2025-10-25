"use client";
import { motion } from "framer-motion";

export function TrustedBy() {
  const logos = ["LOGO1", "logolassan", "LOGO2", "LOOP", "LOCO"];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.h3
          className="text-sm text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Blindly trusted by
        </motion.h3>
        <motion.div
          className="flex flex-wrap items-center justify-center gap-12 opacity-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              className="text-2xl text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
