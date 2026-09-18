export type ReceiptDetailFieldKey =
  | "washType"
  | "station"
  | "payment"
  | "orderId"

export type ReceiptDetailField = {
  name: string
  key: ReceiptDetailFieldKey
}

export type LatestSingleWashReceiptInput = {
  planName: string
  price: string
  plate: string
  payment: string
  location?: string
  station?: string
}
