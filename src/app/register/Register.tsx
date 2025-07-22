"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Building,
  Briefcase,
  MessageSquare,
  CreditCard,
  Check,
  Award,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"

interface FormData {
  name: string
  email: string
  phone: string
  school: string
  position: string
  experience: string
  dietary: string
  accommodation: string
  message: string
  registrationType: string
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    school: "",
    position: "",
    experience: "",
    dietary: "",
    accommodation: "",
    message: "",
    registrationType: "standard",
  })

  const createRegistration = api.registration.create.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true)
      setSubmitError(null)
      // Redirect to success page or home after a delay
      setTimeout(() => {
        router.push("/?registered=true")
      }, 2000)
    },
    onError: (error) => {
      setSubmitError(error.message)
      setIsSubmitting(false)
    },
  })

  const steps = [
    {
      id: "personal",
      title: "Personal Information",
      icon: User,
      fields: ["name"],
    },
    {
      id: "contact",
      title: "Contact Details",
      icon: Mail,
      fields: ["email", "phone"],
    },
    {
      id: "professional",
      title: "Professional Background",
      icon: Building,
      fields: ["school"],
    },
    {
      id: "position",
      title: "Your Role",
      icon: Briefcase,
      fields: ["position", "experience"],
    },
    {
      id: "preferences",
      title: "Preferences",
      icon: MessageSquare,
      fields: ["dietary", "accommodation"],
    },
    {
      id: "registration",
      title: "Registration Type",
      icon: CreditCard,
      fields: ["registrationType"],
    },
    {
      id: "additional",
      title: "Additional Information",
      icon: MessageSquare,
      fields: ["message"],
    },
    {
      id: "confirmation",
      title: "Confirmation",
      icon: Check,
      fields: [],
    },
  ]

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await createRegistration.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        position: formData.position,
        experience: formData.experience,
        dietary: formData.dietary || undefined,
        accommodation: formData.accommodation || undefined,
        message: formData.message || undefined,
        registrationType: formData.registrationType as "early-bird" | "standard" | "student",
      })
    } catch {
      // Error is already handled in the mutation's onError callback
      console.error("Error submitting registration")
    }
  }

  const isStepValid = () => {
    const currentStepData = steps[currentStep]
    if (currentStepData?.fields.length === 0) return true

    return currentStepData?.fields.every((field) => {
      if (field === "dietary") return true // Optional field
      if (field === "message") return true // Optional field

      return formData[field as keyof FormData].trim() !== ""
    })
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">{`What's your full name?`}</h2>
              <p className="text-gray-600 mt-2">{`Let's start with your personal details`}</p>
            </div>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="text-lg py-3 text-center"
              autoFocus
            />
          </div>
        )

      case 1: // Contact Details
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">How can we reach you?</h2>
              <p className="text-gray-600 mt-2">{`We'll need your contact information`}</p>
            </div>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="text-lg py-3"
              />
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="text-lg py-3"
              />
            </div>
          </div>
        )

      case 2: // Professional Background
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Which school do you represent?</h2>
              <p className="text-gray-600 mt-2">Tell us about your institution</p>
            </div>
            <Input
              type="text"
              placeholder="Enter your school or institution name"
              value={formData.school}
              onChange={(e) => updateFormData("school", e.target.value)}
              className="text-lg py-3 text-center"
            />
          </div>
        )

      case 3: // Position
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">{`What's your role?`}</h2>
              <p className="text-gray-600 mt-2">Tell us about your position and experience</p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="e.g., Principal, Vice Principal, Teacher"
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
                className="text-lg py-3"
              />
              <Select
                value={formData.experience}
                onValueChange={(value) => updateFormData("experience", value)}
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Any special requirements?</h2>
              <p className="text-gray-600 mt-2">Help us make your experience comfortable</p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Dietary requirements (e.g., vegetarian, allergies)"
                value={formData.dietary}
                onChange={(e) => updateFormData("dietary", e.target.value)}
                className="text-lg py-3"
              />
              <Select
                value={formData.accommodation}
                onValueChange={(value) => updateFormData("accommodation", value)}
              >
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Do you need accommodation assistance?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, please help with accommodation</SelectItem>
                  <SelectItem value="no">No, I have my own arrangements</SelectItem>
                  <SelectItem value="maybe">I might need assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 5: // Registration Type
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Choose your registration type</h2>
              <p className="text-gray-600 mt-2">Select the option that best fits your needs</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "early-bird",
                  title: "Early Bird Registration",
                  price: "FJD $350",
                  description: "Available until william decides",
                  badge: "Save $100",
                },
                {
                  id: "standard",
                  title: "Standard Registration",
                  price: "FJD $450",
                  description: "Regular conference registration",
                  badge: null,
                },
                {
                  id: "student",
                  title: "Student Rate",
                  price: "FJD $200",
                  description: "For full-time students with valid ID",
                  badge: "Special Rate",
                },
              ].map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 ${formData.registrationType === option.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-md"
                    }`}
                  onClick={() => updateFormData("registrationType", option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${formData.registrationType === option.id
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                              }`}
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{option.title}</h3>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{option.price}</div>
                        {option.badge && <Badge className="mt-1 bg-green-100 text-green-800">{option.badge}</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 6: // Additional Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageSquare className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Anything else we should know?</h2>
              <p className="text-gray-600 mt-2">Share any additional comments or questions (optional)</p>
            </div>
            <Textarea
              placeholder="Any additional comments, questions, or special requests..."
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              className="text-lg py-3 min-h-[120px]"
              rows={5}
            />
          </div>
        )

      case 7: // Confirmation
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              {submitSuccess ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
                  <p className="text-gray-600 mt-2">Thank you for registering. You will be redirected shortly.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Review your registration</h2>
                  <p className="text-gray-600 mt-2">Please confirm your details before submitting</p>
                </>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {!submitSuccess && (
              <Card className="text-left">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Personal Information</h4>
                      <p className="text-gray-600">{formData.name}</p>
                      <p className="text-gray-600">{formData.email}</p>
                      <p className="text-gray-600">{formData.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Professional Details</h4>
                      <p className="text-gray-600">{formData.school}</p>
                      <p className="text-gray-600">{formData.position}</p>
                      <p className="text-gray-600">{formData.experience} experience</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Registration Type</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        {formData.registrationType === "early-bird" && "Early Bird Registration"}
                        {formData.registrationType === "standard" && "Standard Registration"}
                        {formData.registrationType === "student" && "Student Rate"}
                      </span>
                      <span className="font-bold text-lg">
                        {formData.registrationType === "early-bird" && "FJD $350"}
                        {formData.registrationType === "standard" && "FJD $450"}
                        {formData.registrationType === "student" && "FJD $200"}
                      </span>
                    </div>
                  </div>

                  {formData.dietary && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900">Dietary Requirements</h4>
                      <p className="text-gray-600">{formData.dietary}</p>
                    </div>
                  )}

                  {formData.accommodation && (
                    <div className={`${formData.dietary ? '' : 'border-t'} pt-4`}>
                      <h4 className="font-semibold text-gray-900">Accommodation</h4>
                      <p className="text-gray-600">
                        {formData.accommodation === "yes" && "Yes, please help with accommodation"}
                        {formData.accommodation === "no" && "No, I have my own arrangements"}
                        {formData.accommodation === "maybe" && "I might need assistance"}
                      </p>
                    </div>
                  )}

                  {formData.message && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900">Additional Message</h4>
                      <p className="text-gray-600">{formData.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FPA Conference</h1>
                <p className="text-sm text-gray-600">Registration</p>
              </div>
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardContent className="p-8">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={currentStep}
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {currentStep === steps.length - 1 ? (
                  !submitSuccess && (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Registration</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid() || isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
