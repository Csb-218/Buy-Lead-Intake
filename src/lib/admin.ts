import { User } from '@supabase/supabase-js'

// Admin detection based on email domains or specific emails
const ADMIN_EMAIL_DOMAINS = ['admin.com', 'gmail.com'] // Add your admin domains
const ADMIN_EMAILS = ['csbhagwant@gmail.com'] // Add specific admin emails

export function isAdminUser(user: User | null): boolean {
  if (!user) return false
  
  // Primary check: Supabase admin role
  if (user.role === 'supabase_admin') {
    return true
  }
  
  // Fallback: Check user metadata for admin role (if set in Supabase)
  if (user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') {
    return true
  }
  
  // Fallback: Check if email is in the admin emails list
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return true
  }
  
  // Fallback: Check if email domain is an admin domain
  if (user.email) {
    const emailDomain = user.email.split('@')[1]?.toLowerCase()
    if (emailDomain && ADMIN_EMAIL_DOMAINS.includes(emailDomain)) {
      return true
    }
  }
  
  return false
}

export function getAdminBadgeProps() {
  return {
    className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
    style: {
      background: 'linear-gradient(45deg, #f3e8ff, #fce7f3)',
      boxShadow: '0 2px 4px rgba(139, 92, 246, 0.1)'
    }
  }
}

// Check if user has specific admin permissions
export function hasAdminPermission(user: User | null, permission: string): boolean {
  if (!isAdminUser(user)) return false
  
  // For supabase_admin role, grant all permissions
  if (user?.role === 'supabase_admin') {
    return true
  }
  
  // Add specific permission checks if needed
  switch (permission) {
    case 'edit_buyer':
    case 'create_buyer':
    case 'delete_buyer':
    case 'view_analytics':
      return isAdminUser(user)
    default:
      return false
  }
}

// Check if user can perform action on specific buyer record
export function canAccessBuyer(user: User | null, buyerOwnerId?: string, action: 'view' | 'edit' | 'delete' = 'view'): boolean {
  if (!user) return false
  
  // Admin users can access any buyer record
  if (isAdminUser(user)) {
    return true
  }
  
  // Regular users can only access their own records
  if (action === 'view') {
    // All authenticated users can view any buyer (for now - you can restrict this if needed)
    return true
  }
  
  // For edit/delete, user must own the record
  return buyerOwnerId === user.id
}

// Check if user can create buyer records
export function canCreateBuyer(user: User | null): boolean {
  // All authenticated users can create buyers
  return user !== null
}

// Get permission context for a user and buyer
export function getBuyerPermissions(user: User | null, buyerOwnerId?: string) {
  const isAdmin = isAdminUser(user)
  const isOwner = user?.id === buyerOwnerId
  
  return {
    canView: canAccessBuyer(user, buyerOwnerId, 'view'),
    canEdit: canAccessBuyer(user, buyerOwnerId, 'edit'),
    canDelete: canAccessBuyer(user, buyerOwnerId, 'delete'),
    isAdmin,
    isOwner,
    canCreateNew: canCreateBuyer(user)
  }
}

// Throw error if user doesn't have required permission
export function requireAdminPermission(user: User | null, permission: string) {
  if (!hasAdminPermission(user, permission)) {
    throw new Error(`Admin permission required: ${permission}. Only users with 'supabase_admin' role can ${permission.replace('_', ' ')}.`)
  }
}
