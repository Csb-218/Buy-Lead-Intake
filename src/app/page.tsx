'use client'

import { useAuth } from '@/components/auth-provider'
import { getAdminBadgeProps } from '@/lib/admin'

export default function Dashboard() {
  const { user, loading, isAdmin, signingOut, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Buy Lead Intake Dashboard
                </h1>
                {isAdmin && (
                  <span {...getAdminBadgeProps()}>
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.661 2.237a.5.5 0 01.678 0 1.518 1.518 0 002.122 0 .5.5 0 01.678.678 1.518 1.518 0 000 2.122.5.5 0 01-.678.678 1.518 1.518 0 00-2.122 0 .5.5 0 01-.678-.678 1.518 1.518 0 000-2.122zM5 6a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-9A.5.5 0 015 15V6z" clipRule="evenodd" />
                    </svg>
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={signOut}
                disabled={signingOut}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              >
                {signingOut && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {signingOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  User Information
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user?.email}
                    {isAdmin && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Admin User
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">User ID:</span> {user?.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Role:</span>{' '}
                    <span className={`font-medium ${isAdmin ? 'text-purple-600' : 'text-gray-800'}`}>
                      {isAdmin ? 'Administrator' : 'Standard User'}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Signed up:</span>{' '}
                    {user?.created_at && new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Welcome!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your app is now protected with Supabase authentication. Only authenticated users can access this dashboard.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Authentication enabled
                  </div>
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Route protection active
                  </div>
                  <div className="flex items-center text-green-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Session management ready
                  </div>
                </div>
              </div>
            </div>
            
            {/* Admin-Only Section */}
            {isAdmin && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-xl font-semibold text-purple-900">Admin Control Panel</h2>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    Admin Only
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-purple-100">
                    <h3 className="font-medium text-purple-900 mb-2">User Management</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage user accounts and permissions</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      Manage Users
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm border border-purple-100">
                    <h3 className="font-medium text-purple-900 mb-2">Lead Analytics</h3>
                    <p className="text-sm text-gray-600 mb-3">View detailed analytics and reports</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      View Analytics
                    </button>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm border border-purple-100">
                    <h3 className="font-medium text-purple-900 mb-2">System Settings</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure system-wide settings</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                      System Config
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Next Steps
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Add your lead intake forms and functionality</li>
                <li>Configure your Supabase database tables</li>
                <li>Set up row-level security (RLS) policies</li>
                <li>Add email templates and confirmation flows</li>
                <li>Implement role-based access control if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
