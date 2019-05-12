-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2019 at 10:58 PM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `urlmanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `urlcategories`
--

CREATE TABLE `urlcategories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `urlcategories`
--

INSERT INTO `urlcategories` (`Id`, `Name`) VALUES
(1, 'Music'),
(3, 'News'),
(4, 'Science'),
(5, 'Article'),
(6, 'Entertainment'),
(7, 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `urls`
--

CREATE TABLE `urls` (
  `Id` int(11) NOT NULL,
  `Link` varchar(255) NOT NULL,
  `Description` varchar(1000) NOT NULL,
  `Category` int(12) NOT NULL,
  `AddedBy` int(12) NOT NULL,
  `AddedOn` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `urls`
--

INSERT INTO `urls` (`Id`, `Link`, `Description`, `Category`, `AddedBy`, `AddedOn`) VALUES
(2, 'https://soundcloud.com/mihaia-2/sets/ambient-chill-out', 'Ambient/Chill playlist', 1, 3, '2019-05-04 11:14:49'),
(9, 'https://www.cs.ubbcluj.ro/~forest/impulse/#', 'Forest', 4, 3, '2019-05-07 18:47:23'),
(18, 'Test', 'Add Test', 5, 9, '2019-05-07 19:18:02'),
(24, 'https://open.spotify.com/album/7CYDRyFCKtAYJBSpfovLyX', 'C418 Beta Album - Minecraft', 1, 3, '2019-05-11 10:52:19'),
(25, 'https://www.standalone-music.com/2017/05/01/list-of-free-kontakt-libraries/', 'Free Kontakt libraries', 1, 3, '2019-05-12 07:13:19'),
(26, 'test', 'test', 7, 3, '2019-05-12 19:20:21');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Username`, `Email`, `Password`) VALUES
(3, 'MihaiA', 'adrian_cs98@yahoo.co.uk', '$2y$10$8y.AWKa9aIddUtkSJsbP2.4zLB2T1akK6/MLsAi6a/1TSdwvxZYya'),
(8, 'Test', 'adrian_cs98@yahoo.com', '$2y$10$OywQ5SPqsFFj4twTzWnpwe6rkKhMxFOsQ9alN2P/attY8YnAFDenS'),
(9, 'Test User', 'test@gmail.com', '$2y$10$IM6hvqEDUMLwkV6RgrLrve24zD9Pq73OlHDd4s4j7pG7OSS7v.Fjy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `urlcategories`
--
ALTER TABLE `urlcategories`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `urls`
--
ALTER TABLE `urls`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `urlcategories`
--
ALTER TABLE `urlcategories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `urls`
--
ALTER TABLE `urls`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
