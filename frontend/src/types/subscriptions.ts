export type SubscriptionFeature = {
  text: string
  level: number
}

export type SubscriptionPlan = {
  slug: "guld" | "premium" | "brilliant"
  name: string
  price: string
  priceNumber: number
  singleWashPrice: number
  productId: string
  firstMonth: string
  description: string
  features: SubscriptionFeature[]
}

export type SubscriptionOption = {
  value: string
  label: string
}
