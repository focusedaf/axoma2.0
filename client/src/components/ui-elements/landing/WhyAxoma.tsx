"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  BarChart,
  TrendingUp,
  PieChart,
  Activity,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export function WhyAxomaSection() {
  const steps = [
    {
      title: "Secure Exams",
      description:
        "Professors upload exams, which are stored on the blockchain (IPFS) to make them leak-proof.",
    },
    {
      title: "Verify Student Identity",
      description:
        "Students undergo multi-factor identity verification and live face matching before the exam begins.",
    },
    {
      title: "Real-Time AI Proctoring",
      description:
        "AI monitors student behavior, environment, and device usage, flagging any suspicious activity.",
    },
    {
      title: "Store Immutable Results",
      description:
        "Results are hashed and stored on the blockchain, creating a permanent, verifiable academic record.",
    },
  ];

  return (
    <section className="py-20 bg-white">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gray-50 shadow-xl h-full">
              <h3 className="text-xl font-semibold mb-4">The Problem</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span>
                    Risk of single-point failure with centralized servers.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span>Results and records are vulnerable to tampering.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span>Concerns over proctoring bias and effectiveness.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span>Lack of transparency in the exam process.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <span>
                    Inefficient and insecure question paper distribution.
                  </span>
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 bg-blue-100 text-black shadow-xl h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded">
                  <BarChart className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">How Axoma Solves It</h3>
              </div>

              <ul className="space-y-4">
                {steps.map((step, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-200 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                      <p className="text-gray-700 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
