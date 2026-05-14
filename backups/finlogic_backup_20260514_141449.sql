-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: finlogic
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,'income',3000.00,'NÃ³mina Mensual','Salary','2026-05-01','2026-05-13 13:52:57'),(2,1,'expense',800.00,'Alquiler Piso','Housing','2026-05-02','2026-05-13 13:52:57'),(3,1,'expense',150.00,'Supermercado Mensual','Food','2026-05-03','2026-05-13 13:52:57'),(4,1,'expense',50.00,'Factura de Luz','Utilities','2026-05-04','2026-05-13 13:52:57');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_debts`
--

DROP TABLE IF EXISTS `user_debts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_debts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT '0.00',
  `monthly_payment` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_debts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_debts`
--

LOCK TABLES `user_debts` WRITE;
/*!40000 ALTER TABLE `user_debts` DISABLE KEYS */;
INSERT INTO `user_debts` VALUES (1,1,'PrÃ©stamo Coche',12000.00,5.50,250.00,'2026-05-13 13:52:57'),(2,1,'Tarjeta de CrÃ©dito',2500.00,15.00,100.00,'2026-05-13 13:52:57'),(3,2,'tarjeta',4342.00,0.00,0.00,'2026-05-13 13:53:36'),(5,2,'coche',38888.00,0.00,0.00,'2026-05-13 13:54:06'),(8,3,'Tarjeta de Crédito',5000.00,18.50,150.00,'2026-05-14 11:20:28'),(10,5,'Tarjeta de Crédito',5000.00,18.50,150.00,'2026-05-14 11:25:27');
/*!40000 ALTER TABLE `user_debts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_investments`
--

DROP TABLE IF EXISTS `user_investments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_investments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `ticker` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `annual_return` decimal(5,2) DEFAULT '0.00',
  `monthly_contribution` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_investments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_investments`
--

LOCK TABLES `user_investments` WRITE;
/*!40000 ALTER TABLE `user_investments` DISABLE KEYS */;
INSERT INTO `user_investments` VALUES (1,1,'Apple Inc.','AAPL',1750.00,8.50,100.00,'2026-05-13 13:52:57'),(2,1,'Bitcoin','BTC-USD',3200.00,12.00,50.00,'2026-05-13 13:52:57'),(3,2,'Ampco-Pittsburgh Corporation','AP',5646.00,0.00,0.00,'2026-05-13 13:54:41'),(4,2,'BTIC on Adjusted Interest Rate ','AST=F',543510.00,0.00,0.00,'2026-05-13 13:54:48'),(5,2,'Devon Energy Corporation','DVN',43253.00,0.00,0.00,'2026-05-13 13:54:54'),(8,4,'Fondo Indexado','SPY',10000.00,8.00,500.00,'2026-05-14 11:20:28'),(10,6,'Fondo Indexado','SPY',10000.00,8.00,500.00,'2026-05-14 11:25:27');
/*!40000 ALTER TABLE `user_investments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `net_monthly_income` decimal(10,2) DEFAULT '0.00',
  `fixed_loads` decimal(10,2) DEFAULT '0.00',
  `housing` decimal(10,2) DEFAULT '0.00',
  `utilities` decimal(10,2) DEFAULT '0.00',
  `total_debt` decimal(10,2) DEFAULT '0.00',
  `has_emergency_fund` tinyint(1) DEFAULT '0',
  `stable_job` tinyint(1) DEFAULT '0',
  `onboarding_completed` tinyint(1) DEFAULT '0',
  `planning_model` varchar(50) DEFAULT NULL,
  `debt_strategy` varchar(50) DEFAULT 'avalanche',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@finlogic.com','$2a$10$bJWlegIDIlfoIzgxu9oXduFsTKNKWQh/ULEEZvdUPWU.xbQNgB4DW',3000.00,12000.00,800.00,200.00,14500.00,0,0,1,'50/30/20','avalanche','2026-05-13 13:52:57','2026-05-13 13:52:57'),(2,'sangel@gmail.com','$2a$10$6D36/ruWavf1WpS4PMwbFeYEbFhprmIO1s.VY6AX9mt0YgNUF3rbS',7000.00,1332.00,666.00,666.00,43230.00,1,0,1,'escudo','avalanche','2026-05-13 13:53:01','2026-05-13 13:54:06'),(3,'debt-test-1778757627887@finlogic.com','$2a$10$ZFaAYjiWSaK3U6vfn.mglujYW5.IBX7UDseeu8BSxvvt74.0PFhym',0.00,0.00,0.00,0.00,5000.00,0,0,0,NULL,'avalanche','2026-05-14 11:20:27','2026-05-14 11:20:28'),(4,'invest-test-1778757628102@finlogic.com','$2a$10$cJ9msLnPzj/Q5KJt6XqLtOmRbXEzdcksNKgLnm3ijbHXUwjuRgP82',0.00,0.00,0.00,0.00,0.00,0,0,0,NULL,'avalanche','2026-05-14 11:20:28','2026-05-14 11:20:28'),(5,'debt-test-1778757927494@finlogic.com','$2a$10$HMjB2h0LIHG8CngIYQVfcOy1HTcHrvZuqyriau1bHvVV40.ateju.',0.00,0.00,0.00,0.00,5000.00,0,0,0,NULL,'avalanche','2026-05-14 11:25:27','2026-05-14 11:25:27'),(6,'invest-test-1778757927665@finlogic.com','$2a$10$v3nV2Jdg/7ZyA/aEt8zPae5ojUHJaiZSRcLVgKkf8Z65g4zaZ03ri',0.00,0.00,0.00,0.00,0.00,0,0,0,NULL,'avalanche','2026-05-14 11:25:27','2026-05-14 11:25:27');
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

-- Dump completed on 2026-05-14 12:14:49
