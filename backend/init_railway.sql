-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: May 18, 2026 at 12:12 PM
-- Server version: 12.2.2-MariaDB-ubu2404
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `washworld_backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `badge`
--

CREATE TABLE `badge` (
  `badges_id` char(32) NOT NULL,
  `badge_label` varchar(20) NOT NULL,
  `badge_description` varchar(50) NOT NULL,
  `badge_icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `car_id` char(32) NOT NULL,
  `user_id` char(32) NOT NULL,
  `car_license_plate` varchar(12) NOT NULL,
  `car_name` varchar(50) DEFAULT NULL,
  `car_is_ev` tinyint(1) NOT NULL DEFAULT 0,
  `car_country_code` varchar(2) NOT NULL DEFAULT 'DK',
  `car_vehicle_type` varchar(20) NOT NULL DEFAULT 'car',
  `car_is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `favorites_id` char(32) NOT NULL,
  `user_fk` char(32) NOT NULL,
  `location_fk` char(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` char(32) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `location_address` varchar(255) NOT NULL,
  `location_zipcode` varchar(12) NOT NULL,
  `location_coordinate_x` decimal(9,6) NOT NULL,
  `location_coordinate_y` decimal(9,6) NOT NULL,
  `location_open_hours` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `location_name`, `location_address`, `location_zipcode`, `location_coordinate_x`, `location_coordinate_y`, `location_open_hours`) VALUES
('1003', 'FrederiksvÃ¦rk', 'Hanehovedvej 49', '3300', 12.007447, 55.977559, '7-22'),
('1004', 'NykÃ¸bing Falster', 'Guldborgsundcentret 32', '4800', 11.851437, 54.758801, '7-22'),
('1005', 'Slagelse Ã˜st', 'Smedegade 77', '4200', 11.367846, 55.407685, '7-22'),
('1006', 'Slagelse', 'IdagÃ¥rdsvej 2', '4200', 11.353002, 55.391735, '7-22'),
('1007', 'Randers NV', 'UdbyhÃ¸jvej 7', '8930', 10.054250, 56.466047, '7-22'),
('1008', 'SorÃ¸', 'Apotekervej 14', '4180', 11.563255, 55.445137, '7-22'),
('1009', 'Randers Syd', 'Messingvej 10', '8940', 10.053815, 56.430362, '7-22'),
('1010', 'TÃ¸nder', 'Centerbuen 5', '6270', 8.887800, 54.951505, '7-22'),
('1011', 'Roskilde', 'Byleddet 2', '4000', 12.109114, 55.643709, '7-22'),
('1012', 'Frederikssund', 'Askelundsvej 8', '3600', 12.074291, 55.845151, '7-22'),
('1013', 'Ringsted', 'Frejasvej 43', '4100', 11.801419, 55.430669, '7-22'),
('1014', 'Viborg Nord', 'Vognmagervej 21E', '8800', 9.409431, 56.469366, '7-22'),
('1015', 'Ebeltoft', 'FÃ¦rgevejen 3', '8400', 10.672123, 56.190809, '7-22'),
('1016', 'Svendborg Vest', 'Odensevej 94', '5700', 10.582398, 55.072950, '7-22'),
('1017', 'Svendborg', 'Nyborgvej 4', '5700', 10.618592, 55.062893, '7-22'),
('1018', 'Odense SÃ˜', 'Nyborgvej 343', '5220', 10.435819, 55.391530, '7-22'),
('1019', 'Ringsted Nord', 'NÃ¸rregade 70', '4100', 11.790082, 55.451392, '7-22'),
('1020', 'SÃ¸nderborg', 'Centerpassagen 4', '6400', 9.808034, 54.919430, '7-22'),
('1021', 'Farum', 'GammelgÃ¥rdsvej 84', '3520', 12.370350, 55.816943, '7-22'),
('1022', 'NÃ¦stved', 'Erantisvej 52', '4700', 11.777977, 55.239173, '7-22'),
('1023', 'NÃ¦stved Nord', 'Gammel Holstedvej 1', '4700', 11.782031, 55.249681, '7-22'),
('1024', 'Middelfart', 'Skovsvinget 27c', '5500', 9.766181, 55.512013, '7-22'),
('1025', 'Odense V', 'BystÃ¦vnevej 5', '5200', 10.346525, 55.395026, '7-22'),
('1026', 'Kolding', 'Vejlevej 132', '6000', 9.458227, 55.504039, '7-22'),
('1027', 'HolbÃ¦k', 'Springstrup 5', '4300', 11.666091, 55.703026, '7-22'),
('1028', 'Fredericia', 'Strevelinsvej 5', '7000', 9.718700, 55.535519, '7-22'),
('1029', 'Aalborg SÃ˜', 'Gammel Vissevej 1C', '9210', 9.925946, 57.006314, '7-22'),
('1030', 'Vejle Syd', 'Soldalen 4', '7100', 9.567456, 55.681238, '7-22'),
('1031', 'Silkeborg', 'Nordre Ringvej 90', '8600', 9.536954, 56.181413, '7-22'),
('1032', 'Vejle Nord', 'Solkilde Alle 11', '7100', 9.584778, 55.723459, '7-22'),
('1033', 'Aalborg SV', 'Otto MÃ¸nsteds Vej 5', '9200', 9.896256, 57.015248, '7-22'),
('1034', 'HjÃ¸rring', 'SprogÃ¸vej 2', '9800', 10.039465, 57.455594, '7-22'),
('1035', 'Vordingborg', 'Valdemarsgade 57', '4760', 11.910489, 55.010855, '7-22'),
('1036', 'Nyborg', 'StorebÃ¦ltsvej 7F', '5800', 10.809624, 55.308498, '7-22'),
('1037', 'Esbjerg', 'SÃ¦dding Ringvej 6', '6710', 8.407419, 55.503728, '7-22'),
('1038', 'Holstebro', 'Nybo Bakke 2', '7500', 8.635395, 56.341889, '7-22'),
('1039', 'Herning', 'DÃ¦mningen 21', '7400', 8.959350, 56.132141, '7-22'),
('1040', 'Tilst', 'Blomstervej 2T', '8381', 10.125000, 56.181787, '7-22'),
('1041', 'Brande', 'VestergÃ¥rdsvej 3', '7330', 9.103426, 55.960647, '7-22'),
('1042', 'Viborg Syd', 'Falkevej 25', '8800', 9.388456, 56.444161, '7-22'),
('1043', 'BrÃ¸ndby Strand', 'Gammel KÃ¸ge Landevej 690', '2660', 12.423950, 55.618231, '7-22'),
('1044', 'Roskilde Vest', 'Ringstedvej 73', '4000', 12.066559, 55.628427, '7-22'),
('1045', 'SÃ¸borg', 'Dynamovej 4', '2860', 12.459961, 55.733731, '7-22'),
('1046', 'Lystrup', 'LÃ¦gÃ¥rdsvej 4', '8520', 10.238525, 56.225669, '7-22'),
('1047', 'Risskov', 'RavnsÃ¸vej 48B', '8240', 10.244490, 56.202062, '7-22'),
('1048', 'Ballerup', 'Industriparken 6', '2750', 12.373295, 55.728714, '7-22'),
('1049', 'Herlev', 'NÃ¸rrelundvej 2', '2730', 12.416697, 55.725365, '7-22'),
('1050', 'Viby J', 'Gunnar Clausens Vej 2A', '8260', 10.125033, 56.111373, '7-22'),
('1051', 'HelsingÃ¸r', 'Klostermosevej 103', '3000', 12.571863, 56.024018, '7-22'),
('1052', 'Horsens', 'Vejlevej 102', '8700', 9.804744, 55.833085, '7-22'),
('1053', 'Ikast', 'Europavej 3', '7430', 9.175422, 56.123699, '7-22'),
('1054', 'Thisted', 'Ã˜sterbakken 111', '7700', 8.735134, 56.968852, '7-22'),
('1055', 'Kalundborg', 'HolbÃ¦kvej 74', '4400', 11.135830, 55.678767, '7-22'),
('1056', 'Kolding Nord', 'Vejlevej 251', '6000', 9.454697, 55.513664, '7-22'),
('1057', 'Ribe', 'Trojels KnÃ¦ 6', '6760', 8.780311, 55.351485, '7-22'),
('1058', 'KÃ¸ge', 'KÃ¸benhavnsvej 86', '4600', 12.181953, 55.471805, '7-22'),
('1059', 'Aabenraa', 'Egevej 4', '6200', 9.364450, 55.065643, '7-22'),
('1060', 'GrenÃ¥', 'Hesselvang 1', '8500', 10.864451, 56.383895, '7-22'),
('1061', 'NÃ¸rresundby', 'Loftbrovej 2', '9400', 9.969241, 57.089142, '7-22'),
('1062', 'Frederikshavn', 'Apholmenvej 9', '9900', 10.519448, 57.462193, '7-22'),
('1063', 'IshÃ¸j', 'VejleÃ¥vej 19', '2635', 12.321167, 55.623385, '7-22'),
('1064', 'Haderslev', 'Sverigesvej 2M', '6100', 9.474129, 55.259211, '7-22'),
('1065', 'HÃ¸jbjerg', 'BjÃ¸dstrupvej 20E', '8270', 10.166967, 56.107525, '7-22'),
('1066', 'Herning Nord', 'Guldborgvej 2-4', '7400', 8.984745, 56.153554, '7-22'),
('1067', 'Nakskov', 'LÃ¸jtoftevej 6', '4900', 11.149662, 54.832475, '7-22'),
('1068', 'HillerÃ¸d', 'IndustrivÃ¦nget 3', '3400', 12.282996, 55.931481, '7-22'),
('1069', 'Taastrup', 'Roskildevej 376', '2630', 12.294712, 55.658037, '7-22'),
('1070', 'Skive', 'Ã˜ster FÃ¦lled vej 4', '7800', 9.039567, 56.561567, '7-22'),
('1071', 'Struer', 'Bredgade 58', '7600', 8.585535, 56.480435, '7-22'),
('1072', 'Odense SÃ˜', 'Ã˜rbÃ¦kvej 99', '5220', 10.433066, 55.379874, '7-22'),
('1073', 'Fredericia Nord', 'Vejlevej 20', '7000', 9.727622, 55.569691, '7-22');

-- --------------------------------------------------------

--
-- Table structure for table `location_equipment`
--

CREATE TABLE `location_equipment` (
  `location_equipment_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` char(32) DEFAULT NULL,
  `location_equipment_type` varchar(50) NOT NULL,
  `location_equipment_number` int(11) NOT NULL,
  `location_equipment_status` varchar(50) NOT NULL,
  `location_equipment_max_height` float NOT NULL,
  `location_equipment_max_width` float NOT NULL,
  PRIMARY KEY (`location_equipment_id`),
  KEY `location_id` (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `location_equipment`
--

INSERT INTO `location_equipment` (
  `location_id`,
  `location_equipment_type`,
  `location_equipment_number`,
  `location_equipment_status`,
  `location_equipment_max_height`,
  `location_equipment_max_width`
) VALUES
-- 1059: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1059', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1059', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1059', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1059', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1059', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1059', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1059', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1059', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1059', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1033: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1033', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1033', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1033', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1033', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1033', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1033', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1033', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1033', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1029: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1029', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1029', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1029', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1029', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1029', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1029', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1029', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1029', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1029', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1029', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1048: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1048', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1048', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1048', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1048', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1048', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1048', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1041: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1041', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1041', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1041', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1041', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1041', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1041', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1041', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1041', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1041', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1043: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1043', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1043', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1043', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1043', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1043', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1043', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1043', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1043', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1043', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1015: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1015', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1015', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1015', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1015', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1015', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1015', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1015', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1015', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1015', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1037: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1037', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1037', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1037', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1037', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1037', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1037', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1037', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1037', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1037', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1037', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1021: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1021', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1021', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1021', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1021', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1021', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1021', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1021', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1021', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1021', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1028: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1028', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1028', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1028', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1028', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1028', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1028', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1028', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1028', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1073: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1073', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1073', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1073', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1073', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1073', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1073', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1073', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1073', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1073', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1073', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1062: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1062', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1062', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1062', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1062', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1062', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1062', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1012: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1012', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1012', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1012', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1012', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1012', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1012', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1012', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1012', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1012', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1003: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1003', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1003', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1003', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1003', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1003', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1003', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1003', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1003', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1003', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1060: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1060', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1060', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1060', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1060', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1060', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1060', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1060', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1060', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1060', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1064: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1064', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1064', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1064', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1064', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1064', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1064', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1064', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1064', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1064', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1064', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1051: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1051', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1051', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1051', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1051', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1051', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1051', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1051', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1051', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1051', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1049: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1049', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1049', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1049', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1049', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1049', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1049', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1049', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1049', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1039: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1039', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1039', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1039', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1039', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1039', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1039', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1039', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1039', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1039', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1039', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1066: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1066', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1066', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1066', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1066', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1066', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1066', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1068: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1068', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1068', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1068', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1068', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1068', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1068', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1068', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1068', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1068', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1034: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1034', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1034', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1034', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1034', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1034', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1034', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1034', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1034', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1034', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1027: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1027', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1027', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1027', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1027', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1027', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1027', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1027', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1027', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1027', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1038: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1038', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1038', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1038', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1038', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1038', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1038', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1038', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1038', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1038', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1038', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1052: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1052', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1052', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1052', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1052', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1052', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1052', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1052', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1052', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1052', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1065: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1065', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1065', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1065', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1065', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1065', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1065', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1065', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1065', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1053: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1053', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1053', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1053', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1053', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1053', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1053', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1053', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1053', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1053', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1053', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1063: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1063', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1063', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1063', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1063', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1063', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1063', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1055: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1055', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1055', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1055', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1055', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1055', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1055', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1055', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1055', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1055', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1026: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1026', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1026', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1026', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1026', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1026', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1026', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1026', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1026', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1026', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1056: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1056', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1056', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1056', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1056', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1056', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1056', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1056', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1056', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1056', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1058: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1058', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1058', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1058', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1058', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1058', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1058', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1058', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1058', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1058', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1058', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1046: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1046', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1046', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1046', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1046', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1046', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1046', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1046', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1046', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1046', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1024: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1024', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1024', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1024', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1024', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1024', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1024', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1024', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1024', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1067: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1067', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1067', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1067', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1067', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1067', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1067', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1067', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1067', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1067', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1067', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1036: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1036', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1036', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1036', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1036', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1036', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1036', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1004: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1004', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1004', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1004', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1004', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1004', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1004', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1004', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1004', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1004', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1022: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1022', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1022', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1022', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1022', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1022', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1022', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1022', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1022', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1022', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1023: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1023', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1023', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1023', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1023', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1023', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1023', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1023', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1023', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1023', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1061: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1061', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1061', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1061', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1061', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1061', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1061', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1061', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1061', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1061', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1061', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1018: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1018', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1018', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1018', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1018', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1018', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1018', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1018', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1018', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1018', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1072: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1072', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1072', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1072', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1072', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1072', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1072', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1072', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1072', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1025: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1025', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1025', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1025', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1025', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1025', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1025', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1025', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1025', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1025', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1025', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1009: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1009', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1009', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1009', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1009', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1009', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1009', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1007: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1007', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1007', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1007', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1007', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1007', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1007', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1007', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1007', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1007', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1057: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1057', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1057', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1057', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1057', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1057', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1057', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1057', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1057', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1057', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1013: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1013', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1013', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1013', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1013', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1013', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1013', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1013', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1013', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1013', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1019: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1019', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1019', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1019', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1019', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1019', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1019', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1019', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1019', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1019', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1019', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1047: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1047', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1047', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1047', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1047', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1047', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1047', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1047', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1047', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1047', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1011: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1011', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1011', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1011', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1011', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1011', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1011', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1011', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1011', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1044: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1044', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1044', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1044', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1044', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1044', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1044', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1044', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1044', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1044', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1044', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1031: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1031', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1031', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1031', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1031', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1031', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1031', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1070: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1070', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1070', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1070', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1070', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1070', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1070', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1070', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1070', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1070', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1006: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1006', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1006', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1006', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1006', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1006', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1006', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1006', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1006', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1006', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1005: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1005', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1005', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1005', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1005', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1005', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1005', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1005', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1005', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1005', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1008: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1008', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1008', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1008', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1008', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1008', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1008', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1008', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1008', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1008', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1008', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1071: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1071', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1071', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1071', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1071', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1071', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1071', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1071', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1071', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1071', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1017: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1017', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1017', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1017', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1017', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1017', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1017', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1017', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1017', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1016: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1016', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1016', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1016', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1016', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1016', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1016', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1016', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1016', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1016', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1016', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1045: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1045', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1045', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1045', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1045', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1045', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1045', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1020: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1020', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1020', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1020', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1020', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1020', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1020', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1020', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1020', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1020', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1069: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1069', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1069', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1069', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1069', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1069', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1069', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1069', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1069', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1069', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1054: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1054', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1054', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1054', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1054', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1054', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1054', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1054', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1054', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1054', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15),
-- 1040: P7 (4 vaskehal, 4 stovsuger, 2 vask_selv)
('1040', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1040', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1040', 'vaskehal', 3, 'Optaget', 2.6, 2.15),
('1040', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1040', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1040', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1040', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1040', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1040', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1040', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
-- 1010: P0 (4 vaskehal, 2 stovsuger, 3 vask_selv)
('1010', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1010', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1010', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1010', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1010', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1010', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1010', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1010', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1010', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1030: P1 (2 vaskehal, 4 stovsuger, 2 vask_selv)
('1030', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1030', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1030', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1030', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1030', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1030', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1030', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1030', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1032: P2 (3 vaskehal, 3 stovsuger, 4 vask_selv)
('1032', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1032', 'vaskehal', 2, 'Ud af drift', 2.6, 2.15),
('1032', 'vaskehal', 3, 'Ledig', 2.6, 2.15),
('1032', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1032', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1032', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1032', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1032', 'vask_selv', 2, 'Optaget', 2.6, 2.15),
('1032', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
('1032', 'vask_selv', 4, 'Ledig', 2.6, 2.15),
-- 1042: P3 (1 vaskehal, 2 stovsuger, 3 vask_selv)
('1042', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1042', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1042', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1042', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1042', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1042', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
-- 1014: P4 (4 vaskehal, 3 stovsuger, 2 vask_selv)
('1014', 'vaskehal', 1, 'Optaget', 2.6, 2.15),
('1014', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1014', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1014', 'vaskehal', 4, 'Ledig', 2.6, 2.15),
('1014', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1014', 'stovsuger', 2, 'Optaget', 2.6, 2.15),
('1014', 'stovsuger', 3, 'Ledig', 2.6, 2.15),
('1014', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1014', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
-- 1050: P5 (2 vaskehal, 4 stovsuger, 3 vask_selv)
('1050', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1050', 'vaskehal', 2, 'Ledig', 2.6, 2.15),
('1050', 'stovsuger', 1, 'Ledig', 2.6, 2.15),
('1050', 'stovsuger', 2, 'Ud af drift', 2.6, 2.15),
('1050', 'stovsuger', 3, 'Optaget', 2.6, 2.15),
('1050', 'stovsuger', 4, 'Ledig', 2.6, 2.15),
('1050', 'vask_selv', 1, 'Optaget', 2.6, 2.15),
('1050', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1050', 'vask_selv', 3, 'Ledig', 2.6, 2.15),
-- 1035: P6 (3 vaskehal, 2 stovsuger, 4 vask_selv)
('1035', 'vaskehal', 1, 'Ledig', 2.6, 2.15),
('1035', 'vaskehal', 2, 'Optaget', 2.6, 2.15),
('1035', 'vaskehal', 3, 'Ud af drift', 2.6, 2.15),
('1035', 'stovsuger', 1, 'Optaget', 2.6, 2.15),
('1035', 'stovsuger', 2, 'Ledig', 2.6, 2.15),
('1035', 'vask_selv', 1, 'Ledig', 2.6, 2.15),
('1035', 'vask_selv', 2, 'Ledig', 2.6, 2.15),
('1035', 'vask_selv', 3, 'Optaget', 2.6, 2.15),
('1035', 'vask_selv', 4, 'Ud af drift', 2.6, 2.15);

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `offer_id` char(32) NOT NULL,
  `product_id` char(32) DEFAULT NULL,
  `offer_description` varchar(255) NOT NULL,
  `offer_discount_percentage` decimal(5,2) NOT NULL,
  `offer_start_date` datetime NOT NULL,
  `offer_end_date` datetime NOT NULL,
  `offer_photo_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` char(32) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_price`, `product_category`) VALUES
('a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', 'Guld', 59.00, 'enkelt_vask'),
('b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', 'Premium', 89.00, 'enkelt_vask'),
('c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', 'Brilliant', 119.00, 'enkelt_vask'),
('d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', 'Vask Selv', 6.00, 'vask_selv'),
('e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', 'Stoevsuger', 6.00, 'stoevsuger');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscription_id` char(32) NOT NULL,
  `product_id` char(32) DEFAULT NULL,
  `car_id` char(32) DEFAULT NULL,
  `location_id` char(32) DEFAULT NULL,
  `subscriptions_name` varchar(50) NOT NULL,
  `subscriptions_price` decimal(10,2) NOT NULL,
  `subscriptions_status` varchar(20) NOT NULL,
  `subscriptions_start_date` datetime NOT NULL,
  `subscriptions_end_date` datetime NOT NULL,
  `subscriptions_next_billing_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(32) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password_hashed` varchar(255) NOT NULL,
  `user_firstname` varchar(50) NOT NULL,
  `user_lastname` varchar(50) NOT NULL,
  `user_phone` varchar(20) NOT NULL,
  `user_created_at` datetime NOT NULL,
  `user_updated_at` datetime NOT NULL,
  `user_deleted_at` datetime DEFAULT NULL,
  `user_verification_key` char(32) NOT NULL,
  `user_verified_at` datetime DEFAULT NULL,
  `user_reset_password` char(75) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `location_equipment`
--

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

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`car_id`, `user_id`, `car_license_plate`) VALUES
('c1a2b3c4d5e6478990aabbccddeeff01', 'a1b2c3d4e5f6478990aabbccddeeff01', 'CP 69 910'),
('c2a3b4c5d6e6478990aabbccddeeff02', 'a1b2c3d4e5f6478990aabbccddeeff01', 'AF 67 802');

-- --------------------------------------------------------

--
-- Table structure for table `user_badges`
--

CREATE TABLE `user_badges` (
  `user_badges_id` char(32) NOT NULL,
  `user_fk` char(32) NOT NULL,
  `badges_fk` char(32) NOT NULL,
  `achieved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wash_log`
--

CREATE TABLE `wash_log` (
  `wash_log_id` char(32) NOT NULL,
  `car_id` char(32) DEFAULT NULL,
  `product_id` char(32) DEFAULT NULL,
  `location_id` char(32) DEFAULT NULL,
  `wash_log_start_time` datetime NOT NULL,
  `wash_log_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`badges_id`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`car_id`),
  ADD UNIQUE KEY `car_license_plate` (`car_license_plate`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favorites_id`),
  ADD UNIQUE KEY `user_fk` (`user_fk`,`location_fk`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`offer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscription_id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- Indexes for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD PRIMARY KEY (`user_badges_id`),
  ADD KEY `badges_user_fk` (`user_fk`),
  ADD KEY `badges_badges_fk` (`badges_fk`);

--
-- Indexes for table `wash_log`
--
ALTER TABLE `wash_log`
  ADD PRIMARY KEY (`wash_log_id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `cars_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `location_equipment`
--
ALTER TABLE `location_equipment`
  ADD CONSTRAINT `location_equipment_location_fk` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`);

--
-- Constraints for table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_car_fk` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`),
  ADD CONSTRAINT `subscriptions_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `user_badges`
--
ALTER TABLE `user_badges`
  ADD CONSTRAINT `badges_badges_fk` FOREIGN KEY (`badges_fk`) REFERENCES `badge` (`badges_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `badges_user_fk` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wash_log`
--
ALTER TABLE `wash_log`
  ADD CONSTRAINT `wash_log_car_fk` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`),
  ADD CONSTRAINT `wash_log_product_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `wash_log_location_fk` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
