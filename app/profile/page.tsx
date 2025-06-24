'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AuthService, getAvatarUrl, formatUserName } from '@/lib/supabase'
import { useDemoBookingCheck } from '@/hooks/useDemoBookingCheck'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/app/sales-dashboard/components/LoadingSpinner'
import { ErrorBoundary } from '@/app/sales-dashboard/components/ErrorBoundary'
import { Header } from '@/components/header'
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Globe, 
  Camera, 
  Save, 
  AlertCircle,
  CheckCircle,
  Settings,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileFormData {
  name: string
  email: string
  company: string
  phone: string
  timezone: string
  salesTarget: number
  role: 'admin' | 'manager' | 'sales_rep' | 'viewer'
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    dashboardLayout: string[]
  }
}

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const { isLoading: demoCheckLoading } = useDemoBookingCheck()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
    timezone: user?.timezone || 'UTC',
    salesTarget: user?.sales_target || 0,
    role: user?.role || 'sales_rep',
    preferences: {
      theme: user?.preferences?.theme || 'system',
      notifications: user?.preferences?.notifications ?? true,
      dashboardLayout: user?.preferences?.dashboardLayout || ['overview', 'focus', 'analytics']
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <LoadingSpinner text="Loading profile..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProfileFormData] as any,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      // Convert camelCase to snake_case for Supabase
      const supabaseData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        timezone: formData.timezone,
        sales_target: formData.salesTarget,
        role: formData.role,
        preferences: formData.preferences
      }
      
      await updateProfile(supabaseData)
      setSaveSuccess(true)
      setIsEditing(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      setSaveError(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (!user) return

    setIsUploadingAvatar(true)
    setSaveError(null)

    try {
      await AuthService.uploadAvatar(user.id, file)
      // The auth context will automatically update with the new user data
    } catch (error: any) {
      setSaveError(error.message || 'Failed to upload avatar')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveError('Avatar file size must be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setSaveError('Please select an image file')
        return
      }

      handleAvatarUpload(file)
    }
  }

  const avatarUrl = user.avatar_url ? getAvatarUrl(user) : null

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
            
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form data
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      company: user.company || '',
                      phone: user.phone || '',
                      timezone: user.timezone || 'UTC',
                      salesTarget: user.sales_target || 0,
                      role: user.role || 'sales_rep',
                      preferences: {
                        theme: user.preferences?.theme || 'system',
                        notifications: user.preferences?.notifications ?? true,
                        dashboardLayout: user.preferences?.dashboardLayout || ['overview', 'focus', 'analytics']
                      }
                    })
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          {/* Success/Error Messages */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Profile updated successfully!</span>
              </div>
            </div>
          )}

          {saveError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{saveError}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        {isUploadingAvatar ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground">
                      {formatUserName(user)}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border p-6 space-y-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                        placeholder="Enter your company"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Sales Target */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Monthly Sales Target
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.salesTarget}
                        onChange={(e) => handleInputChange('salesTarget', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Timezone
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        value={formData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="pt-6 border-t">
                  <h4 className="text-md font-medium mb-4">Preferences</h4>
                  
                  <div className="space-y-4">
                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Theme
                      </label>
                      <select
                        value={formData.preferences.theme}
                        onChange={(e) => handleInputChange('preferences.theme', e.target.value)}
                        disabled={!isEditing}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg",
                          isEditing ? "border-gray-300 focus:ring-2 focus:ring-blue-500" : "border-gray-200 bg-gray-50"
                        )}
                      >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-foreground">
                          Email Notifications
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about your sales activities
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications}
                          onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}