"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  TrendingUp,
  Zap,
  Rss,
  FileLock,
  ShieldCheck,
  ListTree,
} from "lucide-react";
import { motion } from "framer-motion";


const metricsData = [
  { month: "Jan", flags: 100 },
  { month: "Feb", flags: 400 },
  { month: "Mar", flags: 700 },
  { month: "Apr", flags: 600 },
  { month: "May", flags: 800 },
  { month: "Jun", flags: 800 },
  { month: "Jul", flags: 700 },
  { month: "Aug", flags: 1000 },
  { month: "Sep", flags: 900 },
  { month: "Oct", flags: 1100 },
  { month: "Nov", flags: 1000 },
  { month: "Dec", flags: 1206 },
];

export function Features() {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4">
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-5xl mb-4">
            Make Your Exams Smarter, Safer, and More Reliable
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Axoma merges real-time AI proctoring with blockchain-based
            distribution to ensure total exam integrity.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <div className="text-3xl mb-2">
                  1206 <span className="text-red-600">Flags Detected</span>
                </div>
                <div className="text-sm text-gray-500">
                  Real-time anomaly detection
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={metricsData}>
                  <Line
                    type="monotone"
                    dataKey="flags"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-6">
                <h3 className="text-xl mb-2">Live Proctoring Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Monitor all candidates in real-time, with AI flagging
                  suspicious behavior and environment changes.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex flex-col space-y-3 gap-2 mb-6">
                <div className="bg-blue-200 rounded-md p-3 text-sm ">
                  Impersonation detected
                </div>
                <div className="bg-blue-300 rounded-md p-3 text-sm ">
                  Suspicious behavior
                </div>
                <div className="bg-white rounded-md p-3 text-sm ">
                  Real-time alert
                </div>
                <div className="text-xs ml-2 text-gray-600">
                  AI analysis active
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl mb-2">
                  AI-Driven Malpractice Detection
                </h3>
                <p className="text-gray-600 text-sm">
                  Identify impersonation, hidden devices, and suspicious
                  behavior patterns in real time.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-600 rounded">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">Device & Network Log</div>
                  <Badge>ACTIVE</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-600 rounded">
                    <Rss className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">Attempt History</div>
                  <Badge variant="outline">SYNCED</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-600 rounded">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">Behavior Pattern</div>
                  <Badge>LIVE</Badge>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl mb-2">Candidate Activity Tracking</h3>
                <p className="text-gray-600 text-sm">
                  View immutable device logs, attempt history, and behavioral
                  patterns for a complete audit.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                  <FileLock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-600 rounded">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">Tamper-Proof Papers</div>
                  <Badge variant="outline">IMMUTABLE</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-600 rounded">
                    <FileLock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">
                    Encrypted Distribution
                  </div>
                  <Badge variant="outline">SECURE</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-gray-600 rounded">
                    <ListTree className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 font-medium">
                    Verifiable Audit Trail
                  </div>
                  <Badge variant="outline">AUDITABLE</Badge>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl mb-2">
                  Blockchain-Secured Distribution
                </h3>
                <p className="text-gray-600 text-sm">
                  Exam papers are stored securely and time-locked on the
                  blockchain, eliminating leaks and ensuring tamper-proof
                  results.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
