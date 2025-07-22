"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  RefreshCw,
  ArrowLeft,
  Home,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Registration } from "@prisma/client"
import Navbar from "~/components/Navbar"
import Link from "next/link"

export default function AdminRegistrations() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Fetch registrations
  const {
    data: registrations,
    isLoading: registrationsLoading,
    refetch: refetchRegistrations,
  } = api.adminRegistration.getAll.useQuery()

  // Fetch stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = api.adminRegistration.getStats.useQuery()

  // Update status mutation
  const updateStatusMutation = api.adminRegistration.updateStatus.useMutation({
    onSuccess: () => {
      void refetchRegistrations()
      void refetchStats()
    },
  })

  // Filter registrations
  const filteredRegistrations = registrations?.filter((reg: Registration) => {
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    const matchesType = typeFilter === "all" || reg.registrationType === typeFilter
    return matchesStatus && matchesType
  })

  const handleStatusUpdate = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      await updateStatusMutation.mutateAsync({ id, status })
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "early-bird":
        return "bg-blue-100 text-blue-800"
      case "student":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypePrice = (type: string) => {
    switch (type) {
      case "early-bird":
        return "FJD $350"
      case "student":
        return "FJD $200"
      default:
        return "FJD $450"
    }
  }

  if (registrationsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Loading registrations...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 mb-6">
          <Link
            href="/admin"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-1" />
            Admin Dashboard
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Registration Management</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link
                href="/admin"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Registration Management</h1>
            </div>
            <p className="text-gray-600">FPA Conference 2024 - Admin Dashboard</p>
          </div>
          <Button
            onClick={() => {
              void refetchRegistrations()
              void refetchStats()
            }}
            variant="outline"
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalRegistrations ?? 0}</p>
                <p className="text-sm text-gray-600">Total Registrations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <UserCheck className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.byStatus?.confirmed ?? 0}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.byStatus?.pending ?? 0}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <UserX className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.byStatus?.cancelled ?? 0}</p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="early-bird">Early Bird</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Registration Type Stats */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Registration Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats?.byType?.["early-bird"] ?? 0}</p>
                <p className="text-sm text-gray-600">Early Bird (FJD $350)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{stats?.byType?.standard ?? 0}</p>
                <p className="text-sm text-gray-600">Standard (FJD $450)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{stats?.byType?.student ?? 0}</p>
                <p className="text-sm text-gray-600">Student (FJD $200)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registrations List */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Registrations ({filteredRegistrations?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRegistrations?.map((registration) => (
                <div key={registration.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors bg-white/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{registration.email}</span>
                            <Phone className="w-3 h-3 ml-2" />
                            <span>{registration.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          <span>{registration.school}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2" />
                          <span>{registration.position}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <Badge className={getStatusColor(registration.status)}>
                          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                        </Badge>
                        <Badge className={getTypeColor(registration.registrationType)}>
                          {registration.registrationType === "early-bird" ? "Early Bird" :
                            registration.registrationType === "student" ? "Student" : "Standard"}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          {getTypePrice(registration.registrationType)}
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Registered {formatDistanceToNow(new Date(registration.createdAt))} ago</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                      {registration.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(registration.id, "confirmed")}
                            disabled={updateStatusMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(registration.id, "cancelled")}
                            disabled={updateStatusMutation.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      {registration.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(registration.id, "cancelled")}
                          disabled={updateStatusMutation.isPending}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}

                      {registration.status === "cancelled" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(registration.id, "confirmed")}
                          disabled={updateStatusMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredRegistrations?.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No registrations found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 