"use client";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const floatingIcons = [
    { Icon: FileText, top: "top-40", left: "left-8 xl:left-20", delay: 0 },
    { Icon: Shield, top: "top-32", right: "right-8 xl:right-24", delay: 0.2 },
    { Icon: Award, top: "top-64", left: "left-16 xl:left-32", delay: 0.4 },
    { Icon: Users, top: "top-56", right: "right-16 xl:right-32", delay: 0.6 },
  ];

  return (
    <section className="pt-32 pb-16 relative overflow-hidden min-h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/50 to-white"></div>


      {floatingIcons.map((item, i) => {
        const { Icon, top, left, right, delay } = item;
        return (
          <motion.div
            key={i}
            className={`hidden lg:block absolute ${top} ${left || ""} ${
              right || ""
            } p-4 bg-blue-100 rounded-2xl shadow-lg`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -20, 0],
            }}
            transition={{
              opacity: { delay, duration: 0.5 },
              scale: { delay, duration: 0.5 },
              y: {
                delay: delay + 0.5,
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Icon className="w-8 h-8 text-blue-600" />
          </motion.div>
        );
      })}

      <div className="container mx-auto px-6 lg:px-12 xl:px-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-30 text-gray-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Redefining Exam Integrity with AI
          </motion.h2>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
