import { prisma } from './db'

export interface NotificationData {
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  userId?: string | null
  businessId?: string | null
  actionUrl?: string
}

export async function createNotification(data: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        userId: data.userId || null,
        businessId: data.businessId || null,
        actionUrl: data.actionUrl || null
      }
    })

    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Send notification to all users in a business
export async function notifyBusiness(businessId: string, data: Omit<NotificationData, 'businessId'>) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        businessId,
        userId: null, // null means all users in the business
        actionUrl: data.actionUrl || null
      }
    })

    return notification
  } catch (error) {
    console.error('Error notifying business:', error)
    throw error
  }
}

// Send notification to SuperAdmin
export async function notifySuperAdmin(data: Omit<NotificationData, 'userId' | 'businessId'>) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        userId: null, // null with no businessId means SuperAdmin
        businessId: null,
        actionUrl: data.actionUrl || null
      }
    })

    return notification
  } catch (error) {
    console.error('Error notifying SuperAdmin:', error)
    throw error
  }
}

// Send notification to specific user
export async function notifyUser(userId: string, data: Omit<NotificationData, 'userId'>) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        userId,
        businessId: data.businessId || null,
        actionUrl: data.actionUrl || null
      }
    })

    return notification
  } catch (error) {
    console.error('Error notifying user:', error)
    throw error
  }
}
