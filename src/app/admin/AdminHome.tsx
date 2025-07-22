"use client"

import { api } from "~/trpc/react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Settings,
  FileText,
  Calendar,
  Award,
  RefreshCw,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "~/components/Navbar"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Fetch registration stats
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = api.adminRegistration.getStats.useQuery()

  // Check if user is admin
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push("/")
    return null
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">{`You don't have permission to access the admin dashboard.`}</p>
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">FPA Conference 2024 - Administrative Panel</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <Award className="w-4 h-4 mr-1" />
              Admin
            </Badge>
            <Button
              onClick={() => refetchStats()}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.totalRegistrations ?? 0}
                </p>
                <p className="text-sm text-gray-600">Total Registrations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.totalUsers ?? 0}
                </p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <UserCheck className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.byStatus?.confirmed ?? 0}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex items-center p-6">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.byStatus?.pending ?? 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Registration Management */}
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/admin/registrations">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Registration Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  View, confirm, and manage all conference registrations.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {statsLoading ? "..." : stats?.totalRegistrations ?? 0} registrations
                    </Badge>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Reports */}
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate detailed reports and analytics for the conference.
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Conference Settings */}
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-600" />
                Conference Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage conference details, pricing, and system settings.
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/registrations">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Users className="w-4 h-4 mr-2" />
                  View All Registrations
                </Button>
              </Link>

              <Button variant="outline" disabled>
                <FileText className="w-4 h-4 mr-2" />
                Export Data
              </Button>

              <Button variant="outline" disabled>
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 