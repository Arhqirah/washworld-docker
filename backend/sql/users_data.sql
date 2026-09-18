-- Testbruger til login (email + kodeord nedenfor).
-- Kør efter init.sql / når users-tabellen findes.

INSERT INTO `users` (
  `user_id`,
  `user_email`,
  `user_password_hashed`,
  `user_firstname`,
  `user_lastname`,
  `user_phone`,
  `user_created_at`,
  `user_updated_at`,
  `user_deleted_at`,
  `user_verification_key`,
  `user_verified_at`,
  `user_reset_password`
) VALUES (
  'a1b2c3d4e5f6478990aabbccddeeff01',
  'buchandreas@icloud.com',
  'pbkdf2:sha256:1000000$4oHC5rEMRzFpxuVV$edb6c970b853d0291f5a3c64f6122c051717b1d96c14646eb6c9ba3d29169765',
  'andreas',
  'buch',
  '29868755',
  NOW(),
  NOW(),
  NULL,
  'b1b2c3d4e5f6478990aabbccddeeff02',
  NOW(),
  NULL
);

-- Login: buchandreas@icloud.com / password123
