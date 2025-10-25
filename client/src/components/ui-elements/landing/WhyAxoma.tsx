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
} from "lucide-react";
import { motion } from "framer-motion";

export function WhyAxomaSection() {
  const features = [
    {
      icon: BarChart,
      text: "Decentralized Distribution: Uses blockchain for secure, tamper-proof question paper delivery.",
    },
    {
      icon: TrendingUp,
      text: "AI-Powered Proctoring: Employs centralized AI monitoring to ensure exam integrity.",
    },
    {
      icon: PieChart,
      text: "Immutable Records: All results and actions are stored on a blockchain, making them verifiable and permanent.",
    },
    {
      icon: Activity,
      text: "Hybrid Architecture: Combines centralized efficiency with decentralized security.",
    },
    {
      icon: Zap,
      text: "Enhanced Security: Protects against data breaches and unauthorized access.",
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
          <Badge variant="outline" className="mb-4">
            Why Axoma
          </Badge>
          <h2 className="text-4xl md:text-5xl mb-4">
            Strengthening Academic Integrity with Intelligence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Designed to ensure fairness, transparency, and accountability in
            digital examinations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gray-50 h-full">
              <h3 className="text-xl mb-4">The Problem</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">•</span>
                  <span>
                    Risk of single-point failure with centralized servers.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">•</span>
                  <span>Results and records are vulnerable to tampering.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">•</span>
                  <span>Concerns over proctoring bias and effectiveness.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">•</span>
                  <span>Lack of transparency in the exam process.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="mt-1">•</span>
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
            <Card className="p-8 bg-blue-100 text-black shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-white rounded">
                  <BarChart className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl">The Axoma Solution</h3>
              </div>
              <ul className="space-y-3">
                {features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    >
                      <div className="p-1 bg-white/20 border border-gray-300 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
