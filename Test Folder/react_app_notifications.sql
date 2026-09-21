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
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `type` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `is_read` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `visitor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-19 09:44:47',NULL),(2,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-19 12:11:52',NULL),(3,'New Visitor Request','Akanksha P requested a visit','visitor',10,1,'2026-06-19 12:14:09',NULL),(4,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-19 12:16:58',NULL),(5,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-22 06:51:07',NULL),(6,'New Visitor Request','Akanksha requested a visit','visitor',10,1,'2026-06-22 07:50:53',NULL),(7,'New Visitor Request','Akanksha Test requested a visit','visitor',9,1,'2026-06-23 07:19:41',NULL),(8,'New Visitor Request','Akanksha Test requested a visit','visitor',9,1,'2026-06-23 07:32:45',NULL),(9,'New Visitor Request','Akanksha Test requested a visit','visitor',9,1,'2026-06-23 09:19:41',NULL),(10,'New Visitor Request','Akanksha Test requested a visit','visitor',9,1,'2026-06-23 10:08:46',NULL),(11,'New Visitor Request','Akanksha P requested a visit','visitor',9,1,'2026-06-23 11:41:59',NULL),(12,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-23 11:52:15',NULL),(13,'New Visitor Request','Akanksha requested a visit','visitor',9,1,'2026-06-23 12:32:51',NULL),(14,'New Visitor Request','Akanksha Test requested a visit','visitor',9,1,'2026-06-24 10:44:24',41),(15,'New Visitor Request','Akanksha requested a visit','visitor',9,0,'2026-06-30 05:35:22',42),(16,'New Visitor Request','Akanksha 1 requested a visit','visitor',10,0,'2026-06-30 06:20:17',43),(17,'New Visitor Request','Akanksha requested a visit','visitor',10,0,'2026-06-30 06:31:09',44),(18,'New Visitor Request','Akanksha 1 requested a visit','visitor',9,0,'2026-06-30 06:50:35',45),(19,'New Visitor Request','Akanksha P requested a visit','visitor',10,0,'2026-06-30 07:02:52',46),(20,'New Visitor Request','Akanksha 1 requested a visit','visitor',10,0,'2026-06-30 07:15:13',47),(21,'New Visitor Request','Akanksha 1 requested a visit','visitor',10,0,'2026-06-30 07:25:36',48),(22,'New Visitor Request','Akanksha 1 requested a visit','visitor',10,0,'2026-06-30 09:07:55',49),(23,'New Visitor Request','Akanksha 1 requested a visit','visitor',10,0,'2026-06-30 09:11:50',50),(24,'New Visitor Request','Akanksha 1 requested a visit','visitor',7,0,'2026-06-30 09:39:11',51),(25,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-06-30 10:03:44',52),(26,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-06-30 11:01:31',53),(27,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-02 07:28:44',54),(28,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-02 07:35:55',55),(29,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-07 09:59:50',55),(30,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-09 07:12:05',56),(31,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-09 07:18:23',56),(32,'Visitor Checked Out','Akanksha has left the premises',NULL,NULL,0,'2026-07-10 05:56:16',55),(33,'Visitor Checked Out','Akanksha has left the premises',NULL,NULL,0,'2026-07-10 06:04:29',56),(34,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-10 06:48:36',57),(35,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-10 06:50:48',57),(36,'Visitor Checked Out','Akanksha has left the premises',NULL,NULL,0,'2026-07-10 06:51:24',57),(37,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-20 13:42:34',58),(38,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-20 13:43:50',59),(39,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-20 13:57:58',57),(40,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:08:00',60),(41,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:08:54',61),(42,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:14:30',62),(43,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:17:00',63),(44,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:24:06',64),(45,'New Visitor Request','bvjmbn requested a visit',NULL,NULL,0,'2026-07-21 11:25:51',65),(46,'New Visitor Request','bvjmbn requested a visit',NULL,NULL,0,'2026-07-21 11:30:16',66),(47,'New Visitor Request','bvjmbn requested a visit',NULL,NULL,0,'2026-07-21 11:31:03',67),(48,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:37:20',68),(49,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-21 11:44:19',69),(50,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-22 06:43:37',70),(51,'Visitor Checked In','Akanksha 1 has arrived',NULL,NULL,0,'2026-07-23 06:33:51',70),(52,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-23 06:35:42',71),(53,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-23 10:53:49',72),(54,'Visitor Checked In','Akanksha Test has arrived',NULL,NULL,0,'2026-07-23 10:54:38',72),(55,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-23 12:16:01',71),(56,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-23 12:32:13',73),(57,'Visitor Checked In','Akanksha Test has arrived',NULL,NULL,0,'2026-07-23 12:32:49',73),(58,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-23 13:03:49',74),(59,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-23 16:47:45',75),(60,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-23 16:50:28',76),(61,'New Visitor Request','Akanksha P requested a visit',NULL,NULL,0,'2026-07-23 17:10:29',77),(62,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-24 05:05:47',78),(63,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-24 05:27:36',79),(64,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-24 06:27:48',80),(65,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-24 06:36:21',81),(66,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-24 06:55:38',82),(67,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-24 08:50:52',83),(68,'Visitor Checked Out','Akanksha 1 has left the premises',NULL,NULL,0,'2026-07-24 12:39:32',70),(69,'Visitor Checked Out','Akanksha has left the premises',NULL,NULL,0,'2026-07-24 12:49:06',57),(70,'New Visitor Request','Akanksha P requested a visit',NULL,NULL,0,'2026-07-24 13:23:25',84),(71,'Visitor Checked In','Akanksha 1 has arrived',NULL,NULL,0,'2026-07-24 13:25:42',81),(72,'Visitor Checked Out','Akanksha Test has left the premises',NULL,NULL,0,'2026-07-24 13:26:05',72),(73,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-27 05:48:57',85),(74,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-27 05:51:45',85),(75,'Visitor Checked Out','Akanksha has left the premises',NULL,NULL,0,'2026-07-27 05:55:39',85),(76,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-28 05:21:49',86),(77,'Visitor Checked In','Akanksha P has arrived',NULL,NULL,0,'2026-07-28 06:26:14',84),(78,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-28 07:41:55',87),(79,'Visitor Checked In','Akanksha 1 has arrived',NULL,NULL,0,'2026-07-28 11:11:09',83),(80,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-28 11:18:07',82),(81,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-28 11:25:22',82),(82,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-29 12:09:28',88),(83,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-30 05:41:42',89),(84,'New Visitor Request','Akanksha P requested a visit',NULL,NULL,0,'2026-07-30 06:11:13',90),(85,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-30 06:12:57',91),(86,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-30 06:41:52',92),(87,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-30 06:56:31',93),(88,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-30 07:11:46',94),(89,'New Visitor Request','Akanksha Test requested a visit',NULL,NULL,0,'2026-07-30 07:28:38',95),(90,'Visitor Checked In','Akanksha Test has arrived',NULL,NULL,0,'2026-07-30 09:07:39',80),(91,'New Visitor Request','Akanksha 1 requested a visit',NULL,NULL,0,'2026-07-30 09:25:19',96),(92,'Visitor Checked In','Akanksha 1 has arrived',NULL,NULL,0,'2026-07-30 09:34:41',96),(93,'New Visitor Request','Akanksha requested a visit',NULL,NULL,0,'2026-07-30 09:52:16',97),(94,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-30 09:53:23',97),(95,'Visitor Checked In','Akanksha has arrived',NULL,NULL,0,'2026-07-30 10:31:32',86);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-21 12:01:44
