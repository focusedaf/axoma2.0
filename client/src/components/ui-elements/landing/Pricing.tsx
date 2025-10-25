"use client"
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$39",
      period: "/MO",
      description: "Great for small teams getting started.",
      features: [
        "5,000 tracked users",
        "1-year data history",
        "Simple dashboards",
        "Email support",
        "World-e-exports"
      ],
      highlighted: false
    },
    {
      name: "Growth",
      price: "$99",
      period: "/MO",
      description: "For fast- growing teams who are scaling.",
      features: [
        "Everything in starter",
        "50,000 tracked users",
        "Fund-X-time API analytics",
        "Custom dashboards",
        "Team collaboration tools",
        "Priority support"
      ],
      highlighted: true
    },
    {
      name: "Premium",
      price: "$299",
      period: "/MO",
      description: "Exactly for enterprise to connect more.",
      features: [
        "Everything in Growth",
        "Unlimited tracked users",
        "Dedicated account manager",
        "SLA compliance & support",
        "Advanced integrations"
      ],
      highlighted: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
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
          <Badge variant="outline" className="mb-4">Our Pricing</Badge>
          <h2 className="text-4xl md:text-5xl mb-4">
            Choose The Best Plan That Suites You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Paid plans built to scale for expert teams -- from startups to enterprise sized teams.
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="monthly" className="w-fit">
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annually">Annually</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card 
                className={`p-8 hover:shadow-xl transition-all h-full ${
                  plan.highlighted ? 'border-2 border-blue-500 shadow-lg scale-105' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="text-sm mb-3">What's Included</div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}