-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 31, 2025 at 04:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `raidanalyst`
--

-- --------------------------------------------------------

--
-- Table structure for table `signals`
--

CREATE TABLE `signals` (
  `id` int(11) NOT NULL,
  `symbol` varchar(20) NOT NULL,
  `signal_type` varchar(50) NOT NULL,
  `entry_price` decimal(12,5) NOT NULL,
  `stop_loss` decimal(12,5) NOT NULL,
  `take_profit` decimal(12,5) NOT NULL,
  `status` varchar(20) NOT NULL,
  `direction` varchar(10) NOT NULL,
  `timestamp` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `signals`
--

INSERT INTO `signals` (`id`, `symbol`, `signal_type`, `entry_price`, `stop_loss`, `take_profit`, `status`, `direction`, `timestamp`, `created_at`) VALUES
(1, 'XAUUSD', 'CONNECTION_TEST', 1.00000, 0.99900, 1.00100, 'TEST', 'BUY', '2025-10-31 16:27:52', '2025-10-31 14:27:52'),
(2, 'XAUUSD', 'NEW_SIGNAL', 4014.80000, 4017.78000, 4010.62800, 'PENDING', 'SELL', '2025-10-31 16:39:00', '2025-10-31 14:39:00'),
(3, 'XAUUSD', 'ENTRY_TRIGGERED', 4014.80000, 4017.78000, 4010.62800, 'ACTIVE', 'SELL', '2025-10-31 16:46:00', '2025-10-31 14:46:00'),
(4, 'XAUUSD', 'SL_HIT', 4014.80000, 4017.78000, 4010.62800, 'CLOSED_SL', 'SELL', '2025-10-31 16:46:00', '2025-10-31 14:46:00'),
(5, 'XAUUSD', 'NEW_SIGNAL', 4013.93000, 4017.96000, 4008.28800, 'PENDING', 'SELL', '2025-10-31 17:03:00', '2025-10-31 15:02:59'),
(6, 'XAUUSD', 'ENTRY_TRIGGERED', 4013.93000, 4017.96000, 4008.28800, 'ACTIVE', 'SELL', '2025-10-31 17:04:00', '2025-10-31 15:03:59'),
(7, 'XAUUSD', 'SL_HIT', 4013.93000, 4017.96000, 4008.28800, 'CLOSED_SL', 'SELL', '2025-10-31 17:16:00', '2025-10-31 15:15:59'),
(8, 'XAUUSD', 'NEW_SIGNAL', 4015.84000, 4018.08000, 4012.70400, 'PENDING', 'SELL', '2025-10-31 17:24:00', '2025-10-31 15:24:00'),
(9, 'XAUUSD', 'FAILED_BREAKOUT', 4015.84000, 4018.08000, 4012.70400, 'FAILED', 'SELL', '2025-10-31 17:25:00', '2025-10-31 15:25:00'),
(10, 'XAUUSD', 'NEW_SIGNAL', 4015.64000, 4018.45000, 4011.70600, 'PENDING', 'SELL', '2025-10-31 17:32:00', '2025-10-31 15:32:00'),
(11, 'XAUUSD', 'FAILED_BREAKOUT', 4015.64000, 4018.45000, 4011.70600, 'FAILED', 'SELL', '2025-10-31 17:34:00', '2025-10-31 15:34:00'),
(12, 'XAUUSD', 'NEW_SIGNAL', 4022.44000, 4020.46000, 4025.21200, 'PENDING', 'BUY', '2025-10-31 17:43:00', '2025-10-31 15:42:59'),
(13, 'XAUUSD', 'FAILED_BREAKOUT', 4022.44000, 4020.46000, 4025.21200, 'FAILED', 'BUY', '2025-10-31 17:46:00', '2025-10-31 15:46:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `signals`
--
ALTER TABLE `signals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_symbol` (`symbol`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_timestamp` (`timestamp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `signals`
--
ALTER TABLE `signals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
