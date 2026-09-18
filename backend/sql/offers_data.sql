-- Eksempel-tilbud til dashboard (kør efter init.sql).
-- Denne seed bruger offer_photo_url (sti/URL til billedfil).

INSERT INTO `offers` (
  `offer_id`,
  `product_id`,
  `offer_description`,
  `offer_discount_percentage`,
  `offer_start_date`,
  `offer_end_date`,
  `offer_photo_url`
) VALUES
(
  'o1a2b3c4d5e6478990aabbccddeeff01',
  NULL,
  'Start nemt din bilvask med appen',
  0.00,
  '2024-01-01 00:00:00',
  '2030-12-31 23:59:59',
  '/images/offers/offer1.png'
),
(
  'o2a3b4c5d6e6478990aabbccddeeff02',
  NULL,
  'Tank oktan 100% Køreglæde',
  0.00,
  '2024-01-01 00:00:00',
  '2030-12-31 23:59:59',
  '/images/offers/offer2.png'
),
(
  'o3a4b5c6d7e6478990aabbccddeeff03',
  NULL,
  'Vask 10 gange og få premium for 1 kr.',
  0.00,
  '2024-01-01 00:00:00',
  '2030-12-31 23:59:59',
  '/images/offers/offer3.png'
),
(
  'o4a5b6c7d8e6478990aabbccddeeff04',
  NULL,
  'Spar 50% på alle vaske i denne uge',
  50.00,
  '2024-01-01 00:00:00',
  '2030-12-31 23:59:59',
  '/images/offers/offer4.png'
);
