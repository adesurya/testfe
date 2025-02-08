// composables/useToast.ts
import { useToast as useNuxtToast } from '@/components/ui/toast'

export function useToast() {
  const toast = useNuxtToast()

  return {
    success(message: string) {
      toast.add({
        title: 'Success',
        description: message,
        color: 'green'
      })
    },
    error(message: string) {
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
    },
    warning(message: string) {
      toast.add({
        title: 'Warning',
        description: message,
        color: 'yellow'
      })
    }
  }
}