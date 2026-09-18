-- Testkøretøjer knyttet til brugeren i users_data.sql.
-- Kør efter users_data.sql / når cars-tabellen findes.

INSERT INTO `cars` (
  `car_id`, `user_id`, `car_license_plate`, `car_name`, `car_is_ev`, `car_country_code`, `car_vehicle_type`
) VALUES
('c1a2b3c4d5e6478990aabbccddeeff01', 'a1b2c3d4e5f6478990aabbccddeeff01', 'CP 69 910', 'Primær', 0, 'DK', 'car'),
('c2a3b4c5d6e6478990aabbccddeeff02', 'a1b2c3d4e5f6478990aabbccddeeff01', 'AF 67 802', 'Secondær', 0, 'DK', 'car');
