export interface User {
    id: number
    username: string
    email: string
    role: 'admin' | 'user'
    status: 'active' | 'inactive'
  }
  
  export interface Plan {
    id: number
    name: string
    messageLimit: number
    price: number
    durationDays: number
    status: 'active' | 'inactive'
  }
  
  export interface Message {
    id: number
    targetNumber: string
    message: string
    status: 'pending' | 'sent' | 'failed'
    createdAt: string
    userId: number
  }
  
  export interface WhatsAppSession {
    id: number
    phoneNumber: string
    status: 'active' | 'inactive'
    userId: number
    createdAt: string
  }
  
  export interface BulkMessage {
    id: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    totalMessages: number
    sentMessages: number
    failedMessages: number
    createdAt: string
  }
  
  export interface MessageForm {
    targetNumber: string
    message: string
    media?: File | null
    scheduleEnabled: boolean
    scheduleTime: Date | null
  }