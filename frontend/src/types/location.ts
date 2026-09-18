export type MapLocation = {
  id: string
  name: string
  address: string
  coords: [number, number]
  openHours: string
}

export type Vaskehall = {
  id: number
  image: string
  title: string
  status: string
}

export type Vaskselv = {
  id: number
  image: string
  title: string
  status: string
}

export type Stovsuger = {
  id: number
  image: string
  title: string
  status: string
}
