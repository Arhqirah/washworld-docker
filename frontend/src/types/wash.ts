export type PaymentPlanFeature = {
  text: string
  level: 0 | 1 | 2
}

export type PaymentPlan = {
  slug: string
  name: string
  price: string
  firstMonth: string
  description: string
  features: PaymentPlanFeature[]
}

export type SingleWashAdviceItem = {
  id: string
  title: string
  image: string
  alt: string
}
