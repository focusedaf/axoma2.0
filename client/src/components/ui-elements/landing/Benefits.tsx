"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  FileText,
  TrendingUp,
  BarChart,
  Target,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

export function Benefits() {
  const benefits = [
    {
      icon: Eye,
      title: "Real-Time AI Proctoring",
      description:
        "Actively detects cheating by monitoring candidate behavior, device usage, and environment.",
    },
    {
      icon: BarChart,
      title: "Tamper-Proof Blockchain Security",
      description:
        "Exam papers and results are stored on the blockchain, making them immutable and auditable.",
    },
    {
      icon: TrendingUp,
      title: "Enhanced Academic Integrity",
      description:
        "Drastically reduces cheating incidents and builds institutional trust with a verifiable, fair process.",
    },
    {
      icon: FileText,
      title: "Immutable Audit Trails",
      description:
        "Provides verifiable, cryptographic proof of all exam activities and results for total transparency.",
    },
    {
      icon: Target,
      title: "Automated Exam Workflows",
      description:
        "Automates paper distribution and proctoring to reduce manual workload for faculty.",
    },
    {
      icon: Calendar,
      title: "Secure Paper Distribution",
      description:
        "Uses IPFS and smart contracts for secure, time-locked question paper delivery, eliminating leaks.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl mb-4">
            Strengthening Academic Integrity with Intelligence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Designed to ensure fairness, transparency, and accountability in
            digital examinations.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <motion.div
                    className="p-3 bg-blue-100 rounded-lg w-fit mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  <h3 className="text-xl mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
