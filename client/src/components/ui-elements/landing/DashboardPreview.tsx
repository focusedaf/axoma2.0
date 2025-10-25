"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  Eye,
  BarChart2,
  ShieldAlert,
  LucideIcon, 
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import DashNavItem from "./DashNavItem"; 

const performanceData = [
  { name: "Exam 1", avgScore: 65 },
  { name: "Quiz 1", avgScore: 78 },
  { name: "Exam 2", avgScore: 72 },
  { name: "Midterm", avgScore: 80 },
  { name: "Quiz 2", avgScore: 85 },
  { name: "Final", avgScore: 79 },
];

const monitoredStudents = [
  {
    name: "Alex Johnson",
    course: "CS 101: Intro to Programming",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "Stable",
  },
  {
    name: "Samantha Lee",
    course: "MATH 203: Linear Algebra",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    status: "Flagged: Eye-gaze",
  },
  {
    name: "Michael Chen",
    course: "PHYS 105: Classical Mechanics",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
    status: "Stable",
  },
];

export function DashboardPreview() {
  return (
    <section className="pb-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-8 shadow-2xl bg-slate-50 overflow-hidden">
            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex flex-col justify-between">
                <nav className="space-y-2">
                  <DashNavItem
                    icon={BarChart2}
                    label="Dashboard"
                    href="#"
                    isActive
                  />
                  <DashNavItem icon={GraduationCap} label="Exams" href="#" />
                  <DashNavItem icon={BookOpen} label="Courses" href="#" />
                  <DashNavItem icon={Users} label="Students" href="#" />
                  <DashNavItem icon={Eye} label="Proctoring" href="#" />
                </nav>

                <div className="pt-6 mt-6 border-t">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">
                        Prof. John Doe
                      </div>
                      <div className="text-xs text-gray-500">Professor</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-9 space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Ongoing Exams
                    </div>
                    <div className="text-3xl mb-2">5</div>
                    <div className="text-xs text-gray-500 mb-3">
                      3 exams ending soon
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 text-sm inline-flex items-center gap-1"
                    >
                      View live feed <ArrowRight className="w-3 h-3" />
                    </a>
                  </Card>

                  <Card className="p-6">
                    <div className="text-sm text-red-700 mb-2">
                      Cheating Alerts
                    </div>
                    <div className="text-3xl mb-2 text-red-900">
                      12 <ShieldAlert className="inline w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-xs text-red-600 mb-3">
                      4 critical flags detected
                    </div>
                    <a
                      href="#"
                      className="text-red-700 text-sm inline-flex items-center gap-1"
                    >
                      Review flags <ArrowRight className="w-3 h-3" />
                    </a>
                  </Card>

                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Grading Progress
                    </div>
                    <div className="relative w-32 h-32 mx-auto my-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${
                            2 * Math.PI * 40
                          }`}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dy="7"
                          className="text-2xl fill-gray-900"
                        >
                          85%
                        </text>
                      </svg>
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 text-sm inline-flex items-center gap-1"
                    >
                      See reports <ArrowRight className="w-3 h-3" />
                    </a>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">Student Performance</div>
                      <Badge variant="secondary">Full Analytics</Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient
                            id="colorPerformance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Area
                          type="monotone"
                          dataKey="avgScore"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorPerformance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm">Live Monitoring</div>
                        <Badge variant="secondary">View All</Badge>
                      </div>
                      <div className="space-y-3">
                        {monitoredStudents.map((user, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">
                                {user.course}
                              </div>
                            </div>
                            <Badge
                              variant={
                                user.status === "Stable"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 md:col-span-2">
                    <div className="text-sm text-gray-600 mb-3">
                      Recent Exam Reports
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                        <span className="text-sm">CS 101 - Final Exam</span>
                        <span className="text-xs text-gray-500">
                          Graded: 98/100
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                        <span className="text-sm">MATH 203 - Midterm</span>
                        <span className="text-xs text-gray-500">
                          Graded: 85/90
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
                        <span className="text-sm">PHYS 105 - Quiz 3</span>
                        <span className="text-xs text-gray-500">
                          Graded: 150/150
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="text-sm text-gray-600 mb-3">
                      Quick Actions
                    </div>
                    <div className="space-y-2">
                      <Badge className="w-full justify-center cursor-pointer py-1.5">
                        Create New Exam
                      </Badge>
                      <Badge
                        variant="outline"
                        className="w-full justify-center cursor-pointer py-1.5"
                      >
                        Register Students
                      </Badge>
                      <Badge
                        variant="outline"
                        className="w-full justify-center cursor-pointer py-1.5"
                      >
                        View All Reports
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
