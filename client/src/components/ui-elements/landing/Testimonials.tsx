"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "I'm used Axoma to review organizations and probably just succeed let results on every based-on-it in a comfortable app needed for review.",
      author: "Conner Jane",
      role: "CEO",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=100&h=100&fit=crop",
    },
    {
      quote:
        "I track exactly every milestone. Axoma has let me track the data easily. I track numbers just like that--it's a seamless app to count upon.",
      author: "Selena Polin",
      role: "Founder",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    {
      quote:
        "I'm the present academic families journey has been great on every comfort. My classroom got better in feedback to Axoma as all to count it.",
      author: "Johans Mor",
      role: "Developer",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl mb-4">
            Hear What Others Say About Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how experts and data-oriented teams use Axoma to make better
            decisions and grow like crazy.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <div className="mb-4">
                  <span className="text-4xl text-gray-300">"</span>
                </div>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                    <div>{testimonial.author}</div>
                    <div className="text-xs text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
