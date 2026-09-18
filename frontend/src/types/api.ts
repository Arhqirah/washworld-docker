// TypeScript-typer der matcher den faktiske MariaDB-database (init.sql)

export type VehicleType = "car" | "motorcycle" | "truck" | "bus";

export type User = {
  user_id: string;            // char(32) UUID
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_phone: string;
  user_created_at: string;
  user_updated_at: string;
  user_deleted_at: string | null;
  user_verified_at: string | null;
};

export type Car = {
  car_id: string;             // char(32) UUID
  user_id: string;
  car_license_plate: string;
  car_name: string | null;
  car_is_ev: boolean | number;
  car_country_code: string;
  car_vehicle_type: string;
  car_is_active: boolean | number;
};

export type Product = {
  product_id: string;
  product_name: string;
  product_price: number;
  product_category: string;
};

export type Offer = {
  offer_id: string;
  product_id: string | null;
  offer_description: string;
  offer_discount_percentage: number;
  offer_start_date: string;
  offer_end_date: string;
  offer_photo_url: string | null;
};

export type Subscription = {
  subscription_id: string;
  product_id: string;
  car_id: string;
  subscriptions_name: string;
  subscriptions_price: number;
  subscriptions_status: string;
  subscriptions_start_date: string;
  subscriptions_end_date: string;
  subscriptions_next_billing_date: string;
  car_name?: string | null;
  car_license_plate?: string | null;
  location_id?: string | null;
};

export type WashLog = {
  wash_log_id: string;
  car_id: string;
  product_id: string;
  location_id: string;
  wash_log_start_time: string;
};

export type WashLogEntry = {
  wash_log_id: string;
  wash_log_start_time: string;
  car_id: string;
  car_license_plate: string;
  product_id: string | null;
  product_name: string | null;
  product_price: number | null;
  location_id: string | null;
  location_name: string | null;
  location_address: string | null;
  location_zipcode: string | null;
};

export type Location = {
  location_id: string;
  location_name: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

export type Badge = {
  badges_id: string;
  badge_label: string;
  badge_description: string;
  badge_icon: string;
};

export type UserBadge = {
  user_badges_id: string;
  user_fk: string;
  badges_fk: string;
  achieved: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  error: string;
  message?: string;
};
