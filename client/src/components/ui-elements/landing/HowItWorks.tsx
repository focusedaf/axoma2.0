"use client"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, TrendingUp, Zap, Circle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

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
            Secure Exams in 3 Simple Steps
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started instantly — monitor easily — stay in control.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Set Up Your Exam */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-lg transition-shadow h-full">
              <div className="mb-6">
                <h3 className="text-xl mb-4">Set Up Your Exam</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Configure exam rules and monitoring preferences.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Code, color: 'bg-gray-100', iconColor: 'text-gray-700' },
                    { icon: Zap, color: 'bg-blue-100', iconColor: 'text-blue-600' },
                    { icon: TrendingUp, color: 'bg-blue-100', iconColor: 'text-blue-600' },
                    { icon: Circle, color: 'bg-blue-100', iconColor: 'text-blue-600' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`${item.color} rounded-lg p-4 flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${item.iconColor}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Monitor Behavior */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-lg transition-shadow h-full">
              <div className="mb-6">
                <h3 className="text-xl mb-4">Monitor Behavior</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Track candidates and AI alerts in real time.
                </p>
                <div className="relative">
                  <div className="w-48 h-48 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        strokeDasharray={`${2 * Math.PI * 35 * 0.75} ${2 * Math.PI * 35}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 25 * 0.5} ${2 * Math.PI * 25}`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Review Reports */}
          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-lg transition-shadow h-full">
              <div className="mb-6">
                <h3 className="text-xl mb-4">Review Reports</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Analyze logs and integrity summaries with confidence.
                </p>
                <div className="space-y-3">
                  {[
                    'Integrity summary',
                    'Behavior analytics',
                    'Risk assessment'
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-1 bg-blue-600 rounded">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}