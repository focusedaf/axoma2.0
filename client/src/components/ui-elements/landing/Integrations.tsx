"use client"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Rss, Circle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function Integrations() {
  const integrations = [
    { name: 'X Tweet', icon: Zap, color: 'text-blue-600' },
    { name: 'N Pune', icon: Rss, color: 'text-orange-600' },
    { name: 'N App', icon: Circle, color: 'text-gray-600' },
    { name: 'R Sent', icon: TrendingUp, color: 'text-blue-600' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Badge variant="outline" className="mb-4">Integrations</Badge>
                  <h2 className="text-4xl mb-4">Seamless Integrations</h2>
                  <p className="text-gray-600 mb-6">
                    Connect Axoma with over 50+ tools. Works like Slack to Twitter and synchronize updates.
                  </p>
                  <Button>Get Started</Button>
                </motion.div>
                <div className="space-y-3">
                  {integrations.map((integration, i) => {
                    const Icon = integration.icon;
                    return (
                      <motion.div 
                        key={i} 
                        className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div 
                          className={`p-3 bg-gray-100 rounded-lg ${integration.color}`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <span className="flex-1">{integration.name}</span>
                        <motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}