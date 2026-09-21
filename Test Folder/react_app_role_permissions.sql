CREATE DATABASE  IF NOT EXISTS `react_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `react_app`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: react_app
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int DEFAULT NULL,
  `module_name` varchar(100) DEFAULT NULL,
  `can_create` tinyint(1) DEFAULT '0',
  `can_read` tinyint(1) DEFAULT '0',
  `can_update` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (241,8,'Employees',0,0,0,0),(242,8,'Visitors',1,1,1,1),(243,8,'Dashboard',0,0,0,0),(244,8,'Roles',0,0,0,0),(245,8,'Profile',0,0,0,0),(246,7,'Employees',0,0,0,0),(247,7,'Visitors',0,0,0,0),(248,7,'Dashboard',1,1,1,1),(249,7,'Roles',0,0,0,0),(250,7,'Profile',0,0,0,0),(251,6,'Employees',0,1,0,1),(252,6,'Visitors',1,1,1,1),(253,6,'Dashboard',1,1,1,1),(254,6,'Roles',0,0,0,0),(255,6,'Profile',1,1,1,1),(256,5,'Employees',0,0,0,0),(257,5,'Visitors',0,0,0,0),(258,5,'Dashboard',1,1,1,1),(259,5,'Roles',0,0,0,0),(260,5,'Profile',0,0,0,0),(261,4,'Employees',0,0,0,0),(262,4,'Visitors',0,0,0,0),(263,4,'Dashboard',1,1,1,1),(264,4,'Roles',1,1,1,1),(265,4,'Profile',0,0,0,0),(266,3,'Employees',0,0,0,0),(267,3,'Visitors',0,0,0,0),(268,3,'Dashboard',1,1,1,1),(269,3,'Roles',0,0,0,0),(270,3,'Profile',0,0,0,0),(271,1,'Employees',1,1,1,1),(272,1,'Visitors',1,1,1,1),(273,1,'Dashboard',1,1,1,1),(274,1,'Roles',1,1,1,1),(275,1,'Profile',1,1,1,1);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-21 12:01:48
