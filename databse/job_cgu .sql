-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2025 at 08:07 PM
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
-- Database: `job_cgu`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL COMMENT 'PRIMARY KEY',
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`, `admin_name`) VALUES
(1, 'admin@gmail.com', 'abcd1234', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `application_id` int(11) NOT NULL,
  `student_id` int(10) UNSIGNED NOT NULL,
  `job_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `application_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`application_id`, `student_id`, `job_id`, `status`, `application_date`) VALUES
(3, 5, 14, 'pending', '2025-07-20 12:23:16'),
(4, 5, 2, 'pending', '2025-07-20 12:23:21'),
(5, 3, 14, 'pending', '2025-07-20 13:21:08'),
(6, 3, 1, 'pending', '2025-07-20 13:21:12'),
(7, 3, 2, 'pending', '2025-07-20 18:00:37');

-- --------------------------------------------------------

--
-- Table structure for table `cgu`
--

CREATE TABLE `cgu` (
  `user-name` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cgu`
--

INSERT INTO `cgu` (`user-name`, `password`) VALUES
('admin@example.com', 'abcd1234');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL COMMENT 'PRIMARY',
  `com_name` varchar(50) NOT NULL,
  `reg_no` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(250) NOT NULL,
  `bussiness_type` varchar(50) NOT NULL,
  `url` varchar(150) NOT NULL,
  `bio` text NOT NULL,
  `contact_no` char(12) NOT NULL,
  `address` varchar(255) NOT NULL,
  `no_of_employees` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `com_name`, `reg_no`, `email`, `password`, `bussiness_type`, `url`, `bio`, `contact_no`, `address`, `no_of_employees`, `image`, `status`, `isDeleted`) VALUES
(13, 'Virtusa', '12345', 'virtusa@gmail.com', '$2y$10$IXhT.EPsuZV2/wCp43US8uPjhGiftspyuc8nx/KA.uTsDEmHa4bm6', '', 'https://www.virtusa.com/', 'Virtusa is a US‐based global digital engineering and IT consulting firm founded in 1996. Headquartered in Southborough, Massachusetts, it delivers digital transformation, AI, cloud, data analytics, and application services across industries like banking, healthcare, and telecom. It operates in 25+ countries with ~35,000 employees.', '0766345445', 'Colombo', 201, '', 1, 0),
(14, 'Brandix', '1234', 'brandix@gmail.com', '$2y$10$yk/UwwLP3T35e1vGFqvZRevkV9SBGhqy8nf.Dl5fz1.is7kxxekGi', 'manufacturing', 'https://brandix.com/', 'Brandix Apparel Limited, founded in Sri Lanka in 1969, is a major apparel manufacturer headquartered in Colombo. The company specializes in casualwear, intimates, active and sleepwear, and is the country\'s largest apparel exporter with 60,000+ employees and a presence in multiple countries.', '0766345445', 'Colombo', 501, '', 0, 1),
(19, 'JohnKeels', '1234567', 'johnkeels@gmail.com', '$2y$10$4YyBRGmDjxFDltEcja1S2e3TrMbSne2VzpyXRzVWgxbaI6byf2NES', 'retail', 'https://www.keells.com/', 'John Keells Holdings PLC, founded in 1870 and listed on the Colombo Stock Exchange, is Sri Lanka’s largest diversified conglomerate. Operating across leisure, transportation, retail, consumer food, financial services, property, plantation & IT sectors, it employs over 14,000 people and plays a major national economic role.', '0766345445', 'Colombo', 1000, '', 1, 0),
(20, 'Dialog', '124578', 'dialog@gmail.com', '$2y$10$P4zdyY5rdIQ0Cxl/ojFVxelMHtiegx4S4O1PrLI2sRhKkWq.PQCJe', 'telecommunications', 'https://www.dialog.lk/', 'Dialog Axiata, established in 1993 and headquartered in Colombo, is Sri Lanka’s largest telecommunications provider. A subsidiary of Malaysia\'s Axiata Group Berhad, it offers mobile, broadband, satellite TV, and 5G services, with over 20 million subscribers.', '0766345445', 'Colombo', 501, '', 1, 0),
(21, 'Mas Holdings', '134679', 'masholdings@gmail.com', '$2y$10$aBWPIIzng4T6x5aVt9Jj1uezE9jakiLbNPGb4DOaHytZ18pyH4TIu', 'manufacturing', 'https://masholdings.com/', 'MAS Holdings, founded in 1987 in Panadura, Sri Lanka, is a leading apparel-tech conglomerate, offering concept-to-delivery manufacturing solutions (lingerie, sportswear, swimwear, medical apparel). With operations in 15+ countries and ~100,000 employees, it\'s among South Asia’s largest.', '0766345445', 'Colombo', 1000, '', 0, 0),
(22, 'WSO2', '159753', 'wso2@gmail.com', '$2y$10$G7ddqsoXCUl9TtMROdcTHOQd8.2cv95iz2xIm5zub54U1jXat.R6K', 'technology', 'https://wso2.com/', 'WSO2, founded in 2005 by Paul Fremantle and Sanjiva Weerawarana, is a Silicon Valley–headquartered private company specializing in open-source middleware. It provides solutions for API management, integration, and IAM. Acquired by EQT Private Capital Asia in 2024, it maintains R&D offices globally—including Colombo and Santa Clara—with around 900 employees.', '0766345445', 'Colombo', 201, '', 0, 1),
(25, 'Atlas', '12124578', 'atlas@gmail.com', '$2y$10$5hdRMwHE3SKHizi865pre.9jgZSeH8Z7X3ABTXIVBUfLtaAfqd3C6', 'manufacturing', '', '', '0766345445', 'colombo 10', 501, '', 0, 0),
(26, 'kandypvtltd', '124578623', 'kandy@gmail.com', '$2y$10$4jLp3nHovhuG.O/8ZjTKluXTZ5iAFTvF26mFeDC2XmopAOHhpLYxa', 'transportation_logistics', '', '', '0725219315', 'dfvervreververvr', 11, '', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `job`
--

CREATE TABLE `job` (
  `job_id` int(11) NOT NULL COMMENT 'PRIMARY',
  `com_id` int(11) NOT NULL,
  `job_title` varchar(150) NOT NULL,
  `job_type` varchar(50) NOT NULL,
  `job_location` varchar(300) NOT NULL COMMENT 'job location',
  `job_description` text NOT NULL,
  `job_category` varchar(200) NOT NULL COMMENT 'job category',
  `requirements` text NOT NULL,
  `responsibilities` text NOT NULL,
  `no_of_applicants` int(11) NOT NULL DEFAULT 0,
  `job_tags` varchar(100) NOT NULL,
  `closing_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Job details';

--
-- Dumping data for table `job`
--

INSERT INTO `job` (`job_id`, `com_id`, `job_title`, `job_type`, `job_location`, `job_description`, `job_category`, `requirements`, `responsibilities`, `no_of_applicants`, `job_tags`, `closing_date`, `created_at`) VALUES
(1, 13, 'Frontend Developer', 'internship', 'Colombo', 'Join our dynamic team to work on cutting-edge web applications using React and TypeScript.', 'technology', 'Proficiency in React and JavaScript,\r\nExperience with TypeScript,\r\nKnowledge of CSS and responsive design,\r\nUnderstanding of version control (Git)', 'Develop user-facing features using React,\r\nCollaborate with design team to implement UI/UX,\r\nWrite clean, maintainable code,\r\nParticipate in code reviews', 15, 'React,\r\nTypeScript,\r\nCSS,\r\nGit', '2025-07-30', '2025-06-30 15:12:44'),
(2, 21, 'Marketing Assistant', 'Part-Time', 'Colombo', 'Support our marketing team with campaign management and content creation.', '', 'Strong communication skills,\r\nExperience with social media platforms,\r\nBasic knowledge of marketing principles,\r\nProficiency in Microsoft Office', 'Assist in campaign development,\r\nCreate social media content,\r\nAnalyze marketing metrics,\r\nSupport event planning', 12, 'Marketing,\r\nSocial Media,\r\nContent,\r\nAnalytics', '2025-07-10', '2025-06-29 19:12:10'),
(3, 22, 'Software Engineer', 'Full-Time', 'Colombo', 'Build scalable backend systems and APIs for our data processing platform.', '', 'Bachelor\'s degree in Computer Science\r\n3+ years of backend development experience\r\nProficiency in Python or Java\r\nExperience with databases and cloud platforms', 'Design and implement backend services\r\nOptimize database queries and performance\r\nCollaborate with frontend developers\r\nMaintain and improve existing systems', 200, 'Python,\r\nJava,\r\nAPI,\r\nDatabase,\r\nCloud', '2025-07-10', '2025-06-29 19:12:10'),
(4, 20, 'UX Design Intern', 'Internship', 'Colombo', 'Learn and contribute to user experience design for mobile and web applications.', '', 'Currently pursuing degree in Design or related field,\r\nBasic knowledge of design tools (Figma, Sketch),\r\nUnderstanding of UX principles,\r\nPortfolio of design work', 'Create wireframes and prototypes,\r\nConduct user research,\r\nCollaborate with development team,\r\nPresent design concepts', 30, 'UX Design,\r\nFigma,\r\nPrototyping,\r\nUser Research', '2025-07-11', '2025-06-29 19:12:10'),
(5, 14, 'Data Analyst', 'Full-Time', 'Colombo', 'Analyze complex datasets to provide actionable insights for business decisions.', '', 'Bachelor\'s degree in Statistics Mathematics or related field,\r\nProficiency in SQL and Python/R,\r\nExperience with data visualization tools,\r\nStrong analytical and problem-solving skills', 'Analyze large datasets for trends and patterns,\r\nCreate reports and dashboards,\r\nPresent findings to stakeholders\r\nCollaborate with cross-functional teams', 25, 'SQL,\r\nPython,\r\nData Visualization,\r\nAnalytics', '2025-07-19', '2025-06-29 19:12:10'),
(6, 19, 'Customer Support Specialist', 'Part-Time', 'Colombo', 'Provide excellent customer support through various channels including chat, email, and phone.', '', 'Excellent communication skills,\r\nPrevious customer service experience preferred,\r\nAbility to work flexible hours,\r\nProblem-solving mindset', 'Respond to customer inquiries promptly,\r\nResolve customer issues and complaints,\r\nDocument customer interactions,\r\nCollaborate with other departments', 50, 'Customer Service,\r\nCommunication,\r\nProblem Solving', '2025-07-16', '2025-06-29 19:12:10'),
(14, 13, 'Product Manager', 'Full-time', 'Colombo', 'This is the manager post ', 'Technology', 'Bsc', 'Lead the project', 0, '', '2025-08-27', '2025-07-20 12:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'PRIMARY',
  `f_name` varchar(15) NOT NULL,
  `l_name` varchar(20) NOT NULL,
  `year` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `dgree` varchar(50) NOT NULL,
  `dep_name` varchar(30) NOT NULL,
  `reg_no` varchar(15) NOT NULL,
  `linkedin_url` varchar(400) NOT NULL COMMENT 'url',
  `CV` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Student Detail Tabel';

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `f_name`, `l_name`, `year`, `email`, `password`, `dgree`, `dep_name`, `reg_no`, `linkedin_url`, `CV`) VALUES
(2, 'Tharindu', 'Dananjaya', 2, 'thari@gmai.com', '$2y$10$dWKjiTkQFAEDanzvoCnW8uuF/WwKY6Tp1FG0HS7VxmwUWQfifwVW.', 'bsc_hons', 'computer_science', 'fc115538', 'https://linkedin.com/in/thaindu', ''),
(3, 'Tharindu', 'ev', 1, 'tharindu@gmail.com', '$2y$10$X1PtvJJSGHi5bv2JhEV.8uT.6cQ2UisJvOwkcy7aS7W0NbkzLoqp.', 'ba', 'veterinary', 'dsfer', 'https://linkedin.com/in/thaindu', ''),
(4, 'Venuka', 'kavishka', 2, 'venuka@gmail.com', '$2y$10$bs97sJAHiaGckK.tHcc.NOhf2.NNl6GXud24T6yRb7NKpLPg4dDpC', 'bmlt', 'architecture', 'fc115548', 'https://linkedin.com/in/venuka', ''),
(5, 'Thinil Sandru', 'Sandru', 2, 'thinil@gmail.com', '$2y$10$TxL4vvecBGhuNAV7LBrDgOxkyjyPSKOE42Bddm2bJflD4VoYRoHLW', 'bsc_engineering', 'computer_science', 'FC115578', 'https://linkedin.com/in/thinil', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_reg` (`reg_no`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `FORIEGN KEY` (`com_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY KEY', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY', AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `job`
--
ALTER TABLE `job`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY', AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PRIMARY', AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `application_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  ADD CONSTRAINT `application_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job` (`job_id`);

--
-- Constraints for table `job`
--
ALTER TABLE `job`
  ADD CONSTRAINT `FORIEGN KEY` FOREIGN KEY (`com_id`) REFERENCES `company` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
