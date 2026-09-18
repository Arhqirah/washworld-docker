export type ProfileBadge = {
  id: number
  label: string
  description: string
  achieved: boolean
  image: string
  lockedImage: string
}

export type ProfileMenuItem = {
  label: string
  href: string
  iconKey: "sparkles" | "calendar" | "credit-card" | "bell" | "question-mark"
}

export type ProfileStamp = {
  label: string
  filled: boolean
}

export type ProfileVehicle = {
  id: string
  plateNumber: string
  name: string
}

export type ProfilePaymentCard = {
  id: string
  brand: string
  last4: string
}
