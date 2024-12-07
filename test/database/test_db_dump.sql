

-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 192.168.1.213    Database: procurementpro
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `action_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'User Created','2024-11-27 22:07:33','{\"role\": \"buyer\", \"email\": \"buyer@example.com\"}'),(2,2,'Procurement Created','2024-11-27 22:07:33','{\"type\": \"RFQ\", \"title\": \"Office Supplies RFQ\"}'),(3,3,'Bid Submitted','2024-11-27 22:07:33','{\"bid_amount\": 5000.00, \"procurement_id\": 1}');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bids` (
  `bid_id` int NOT NULL AUTO_INCREMENT,
  `procurement_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `bid_amount` decimal(15,2) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  PRIMARY KEY (`bid_id`),
  KEY `procurement_id` (`procurement_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `bids_ibfk_1` FOREIGN KEY (`procurement_id`) REFERENCES `procurements` (`procurement_id`),
  CONSTRAINT `bids_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bids`
--

LOCK TABLES `bids` WRITE;
/*!40000 ALTER TABLE `bids` DISABLE KEYS */;
INSERT INTO `bids` VALUES (1,1,3,5000.00,'2024-11-27 22:07:33','pending'),(2,2,3,75000.00,'2024-11-27 22:07:33','pending'),(3,3,3,300000.00,'2024-11-27 22:07:33','pending');
/*!40000 ALTER TABLE `bids` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `organization_id` int NOT NULL AUTO_INCREMENT,
  `organization_name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`organization_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'Tech Supplies Inc.','123 Tech Street, Tech City','contact@techsupplies.com'),(2,'Procurement Experts Ltd.','456 Procurement Ave, Biz City','contact@procurex.com');
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurements`
--

DROP TABLE IF EXISTS `procurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procurements` (
  `procurement_id` int NOT NULL AUTO_INCREMENT,
  `procurement_type` enum('RFQ','RFP','Tender','RFI') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('open','closed','awarded') DEFAULT 'open',
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`procurement_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `procurements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurements`
--

LOCK TABLES `procurements` WRITE;
/*!40000 ALTER TABLE `procurements` DISABLE KEYS */;
INSERT INTO `procurements` VALUES (1,'RFQ','Office Supplies RFQ','Request for quotation for office supplies',2,'2024-11-27 22:07:33','2024-11-27 22:07:33','open','2024-12-01'),(2,'RFP','Software Development RFP','Request for proposal for a software project',2,'2024-11-27 22:07:33','2024-11-27 22:07:33','open','2024-12-05'),(3,'Tender','Construction Tender','Tender for a new office building',2,'2024-11-27 22:07:33','2024-11-27 22:07:33','open','2024-12-10'),(4,'RFI','Market Research RFI','Request for information on market trends',2,'2024-11-27 22:07:33','2024-11-27 22:07:33','open','2024-12-15');
/*!40000 ALTER TABLE `procurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `po_id` int NOT NULL AUTO_INCREMENT,
  `procurement_id` int DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `status` enum('pending','completed') DEFAULT 'pending',
  PRIMARY KEY (`po_id`),
  KEY `procurement_id` (`procurement_id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`procurement_id`) REFERENCES `procurements` (`procurement_id`),
  CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (1,1,3,'2024-11-15','2024-11-30',15000.00,'pending');
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reverse_auctions`
--

DROP TABLE IF EXISTS `reverse_auctions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reverse_auctions` (
  `auction_id` int NOT NULL AUTO_INCREMENT,
  `procurement_id` int DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `minimum_bid` decimal(15,2) DEFAULT NULL,
  `current_highest_bid` decimal(15,2) DEFAULT NULL,
  `winning_supplier_id` int DEFAULT NULL,
  PRIMARY KEY (`auction_id`),
  KEY `procurement_id` (`procurement_id`),
  KEY `winning_supplier_id` (`winning_supplier_id`),
  CONSTRAINT `reverse_auctions_ibfk_1` FOREIGN KEY (`procurement_id`) REFERENCES `procurements` (`procurement_id`),
  CONSTRAINT `reverse_auctions_ibfk_2` FOREIGN KEY (`winning_supplier_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reverse_auctions`
--

LOCK TABLES `reverse_auctions` WRITE;
/*!40000 ALTER TABLE `reverse_auctions` DISABLE KEYS */;
INSERT INTO `reverse_auctions` VALUES (1,4,'2024-11-20 17:00:00','2024-11-25 22:00:00',40000.00,45000.00,NULL);
/*!40000 ALTER TABLE `reverse_auctions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `permissions` json DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','{\"manage_users\": true, \"manage_procurements\": true}'),(2,'buyer','{\"manage_bids\": false, \"create_procurements\": true}'),(3,'supplier','{\"submit_bids\": true, \"view_procurements\": true}');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `organization_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John','Doe','superadmin','amircanteetu@gmail.com','$2b$10$Gq6ebBkrXc/N3p5HyNHsTOCxqrr1bSZFPNdwPaVZ.95Cay7P4l83q',1,NULL),(2,'Alice','Smith','alicesmith','buyer@example.com','$2b$10$Gq6ebBkrXc/N3p5HyNHsTOCxqrr1bSZFPNdwPaVZ.95Cay7P4l83q',2,2),(3,'Bob','Johnson','benjohnson','supplier@example.com','$2b$10$Gq6ebBkrXc/N3p5HyNHsTOCxqrr1bSZFPNdwPaVZ.95Cay7P4l83q',3,1),(4,NULL,NULL,'jaysonraye','jaysonraye@gmail.com','$2b$10$JVhvTtE3vFqXfiVWTbCWkOWi8iTxLjlLFz6wVbdeziQvcUKZigcbq',2,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01  8:23:08
