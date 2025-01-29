// User Types
export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: number
  userId: number
  phoneNumber?: string
  avatar?: string
  settings: UserSettings
}

export interface UserSettings {
  notifications: {
    email: boolean
    whatsapp: boolean
  }
  theme: 'light' | 'dark'
  language: string
}

// Authentication Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Plan Types
export interface Plan {
  id: number
  name: string
  description: string
  price: number
  messageLimit: number
  durationDays: number
  features: string[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface UserPlan {
  id: number
  userId: number
  planId: number
  startDate: string
  endDate: string
  messagesRemaining: number
  status: 'active' | 'expired' | 'cancelled'
}

// Message Types
export interface Message {
  id: number
  userId: number
  targetNumber: string
  content: string
  mediaUrl?: string
  scheduleTime?: string
  status: MessageStatus
  errorMessage?: string
  metadata: MessageMetadata
  createdAt: string
  updatedAt: string
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface MessageMetadata {
  deviceInfo?: string
  deliveryAttempts: number
  recipientName?: string
  recipientStatus?: 'valid' | 'invalid' | 'blocked'
}

export interface BulkMessage {
  id: number
  userId: number
  message: string
  targetNumbers: string[]
  baseDelay: number
  intervalDelay: number
  status: BulkMessageStatus
  progress: BulkMessageProgress
  createdAt: string
  completedAt?: string
}

export type BulkMessageStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface BulkMessageProgress {
  totalMessages: number
  sentMessages: number
  failedMessages: number
  failedNumbers: string[]
}

// WhatsApp Types
export interface WhatsAppSession {
  id: number
  userId: number
  phoneNumber: string
  status: 'pending' | 'active' | 'disconnected'
  deviceInfo: DeviceInfo
  createdAt: string
  lastActive: string
}

export interface DeviceInfo {
  platform: string
  version: string
  battery?: {
    level: number
    charging: boolean
  }
}

export interface WhatsAppBinding {
  sessionId: string
  qrCode: string
  expiresAt: string
}

// Payment Types
export interface PaymentTransaction {
  id: number
  userId: number
  planId: number
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: string
  transactionId: string
  metadata: PaymentMetadata
  createdAt: string
  updatedAt: string
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface PaymentMetadata {
  gateway: string
  gatewayResponse?: any
  customerInfo?: {
    name: string
    email: string
    phone?: string
  }
  billingAddress?: Address
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer' | 'ewallet'
  name: string
  description: string
  icon: string
  enabled: boolean
  metadata: {
    processingTime: string
    fees: {
      fixed: number
      percentage: number
    }
  }
}

// Common Types
export interface Address {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
}

// Admin Types
export interface AdminMetrics {
  users: {
    total: number
    active: number
    newToday: number
    growth: number
  }
  messages: {
    total: number
    sent: number
    failed: number
    successRate: number
  }
  revenue: {
    total: number
    today: number
    monthly: number
    growth: number
  }
  sessions: {
    active: number
    total: number
  }
}

export interface SystemSettings {
  maintenance: {
    enabled: boolean
    message: string
  }
  notifications: {
    email: {
      enabled: boolean
      provider: string
    }
    sms: {
      enabled: boolean
      provider: string
    }
  }
  security: {
    maxLoginAttempts: number
    passwordPolicy: {
      minLength: number
      requireNumbers: boolean
      requireSymbols: boolean
    }
  }
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: ApiError[]
}

export interface ApiError {
  code: string
  message: string
  field?: string
}

// Event Types
export interface WebhookEvent {
  type: 'message.sent' | 'message.delivered' | 'message.failed' | 'session.connected' | 'session.disconnected'
  timestamp: string
  data: any
}

// Chart Types
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  scales?: {
    y?: {
      beginAtZero: boolean
    }
  }
  plugins?: {
    legend?: {
      position: 'top' | 'bottom' | 'left' | 'right'
    }
    tooltip?: {
      enabled: boolean
    }
  }
}