"use client"
import type React from "react"
import { motion } from "motion/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Calendar, MapPin, Users, Award, BookOpen, Network, Mic, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Navbar from "~/components/Navbar"
import Link from "next/link"

export default function HomePage({ recent }: { recent: any | null }) {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative py-12 sm:py-16 lg:py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs sm:text-sm">
                Educational Excellence in the Pacific
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Fiji Principals Association
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                  Conference 2025
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                Join educational leaders from across the Pacific for three days of inspiring sessions, networking, and
                professional development in the heart of Fiji.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 w-full sm:w-auto touch-manipulation"
                  onClick={() => (window.location.href = "/register")}
                >
                  Register Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent w-full sm:w-auto touch-manipulation "
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative mx-4 sm:mx-0">
                <Image
                  src="/fiji.jpg"
                  alt="Fiji Conference Venue"
                  width={500}
                  height={400}
                  className="rounded-xl sm:rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg max-w-[200px] sm:max-w-none">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">August 15-17, 2025</p>
                      <p className="text-xs sm:text-sm text-gray-600">Somewhere in Fiji</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Blog Post */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Latest from the Blog</h2>
            <Link href="/blog" className="text-blue-600 hover:underline">View all</Link>
          </div>
          {recent[0] ? (
            <Link href={`/blog/${recent[0]?.slug}`} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-900">{recent[0]?.title}</CardTitle>
                  {recent[0]?.publishedAt && (
                    <p className="text-sm text-gray-500">{new Date(recent[0]!.publishedAt!).toLocaleDateString()} • {recent[0]?.author?.name ?? "Unknown"}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {recent[0]?.excerpt && (
                    <CardDescription className="text-gray-700 leading-relaxed">{recent[0]?.excerpt}</CardDescription>
                  )}
                </CardContent>
              </Card>
            </Link>
          ) : (
            <p className="text-gray-600">No posts yet.</p>
          )}
        </div>
      </section>

      {/* Why Join Our Conference Section */}
      <section id="benefits" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Why Join Our Conference?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Discover the transformative benefits of connecting with educational leaders and innovators from across the
              Pacific region.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              {
                icon: Network,
                title: "Professional Networking",
                description:
                  "Connect with principals, educators, and thought leaders from across the Pacific region to build lasting professional relationships.",
              },
              {
                icon: BookOpen,
                title: "Latest Educational Insights",
                description:
                  "Gain access to cutting-edge research, innovative teaching methods, and best practices in educational leadership.",
              },
              {
                icon: Mic,
                title: "Inspiring Keynote Speakers",
                description:
                  "Learn from renowned educational experts and successful principals who will share their experiences and vision.",
              },
              {
                icon: Users,
                title: "Collaborative Workshops",
                description:
                  "Participate in hands-on workshops designed to enhance your leadership skills and school management capabilities.",
              },
              {
                icon: Award,
                title: "Professional Recognition",
                description:
                  "Celebrate excellence in education and gain recognition for outstanding contributions to the field.",
              },
              {
                icon: MapPin,
                title: "Cultural Exchange",
                description:
                  "Experience the rich culture of Fiji while engaging in meaningful discussions about Pacific education.",
              },
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-gray-900 px-2">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 text-center leading-relaxed text-sm sm:text-base px-2">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Conference Details Section */}
      <section id="details" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">Conference Details</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to know about the 2025 Fiji Principals Association Conference.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Event Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center flex-wrap gap-2">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <span>Event Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Dates</h4>
                      <p className="text-gray-600 text-sm sm:text-base">August 15-17, 2025 (3 Days)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Location</h4>
                      <p className="text-gray-600 text-sm sm:text-base">Somewhere in Fiji</p>
                      <p className="text-xs sm:text-sm text-gray-500">Somewhere in Fiji</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Expected Attendance</h4>
                      <p className="text-gray-600 text-sm sm:text-base">200B+ Educational Leaders</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Registration Fee</h4>
                      <p className="text-gray-600 text-sm sm:text-base">FJD $450 (Early Bird: FJD $350)</p>
                      <p className="text-xs sm:text-sm text-gray-500">Includes meals and materials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Speakers */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 flex items-center flex-wrap gap-2">
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                    <span>Keynote Speakers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {[
                    {
                      name: "Dr. Maria Tavola",
                      title: "Minister of Education, Fiji",
                      topic: "Future of Pacific Education",
                    },
                    {
                      name: "Prof. James Wilson",
                      title: "University of Auckland",
                      topic: "Leadership in Digital Age",
                    },
                    {
                      name: "Sarah Nakamura",
                      title: "Principal, International School",
                      topic: "Inclusive Education Practices",
                    },
                  ].map((speaker, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{speaker.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{speaker.title}</p>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium">{speaker.topic}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="register" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">Ready to Join Us?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              {`Don't miss this opportunity to connect with educational leaders from across the Pacific region.`}
            </p>
            <div className="px-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto touch-manipulation h-12 sm:h-auto"
                onClick={() => (window.location.href = "/register")}
              >
                Start Registration Process
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">FPA Conference</h3>
                  <p className="text-gray-400 text-sm">2025</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-4 sm:px-0">
                Empowering educational leaders across the Pacific region through collaboration, innovation, and
                professional development.
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400 text-sm sm:text-base">+64 0800 838383</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400 text-sm sm:text-base break-all">legal@dcralph.com</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400 text-sm sm:text-base">Somewhere in Fiji</span>
                </div>
              </div>
            </div>

            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:flex-col sm:gap-2 sm:space-y-0">
                <a href="#home" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation py-1">
                  Home
                </a>
                <a href="#benefits" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation py-1">
                  Benefits
                </a>
                <a href="#details" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation py-1">
                  Details
                </a>
                <a href="/register" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation py-1">
                  Register
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">© 2025 DCRalph Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
