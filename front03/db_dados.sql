CREATE DATABASE  IF NOT EXISTS `instituto_criativo_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `instituto_criativo_db`;
-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: instituto_criativo_db
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `doacoes`
--

DROP TABLE IF EXISTS `doacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome_completo` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `doacoes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doacoes`
--

LOCK TABLES `doacoes` WRITE;
/*!40000 ALTER TABLE `doacoes` DISABLE KEYS */;
INSERT INTO `doacoes` VALUES (2,3,'Renan Damprelli Cardoso da Sil','renandamprelli@gmail.com',1.00,''),(3,6,'Marcos','m@gmail.com',100.00,''),(4,5,'João','jota@gmail.com',10000.00,'to rico'),(5,3,'Renan Damprelli','renandamprelli@gmail.com',150.00,'');
/*!40000 ALTER TABLE `doacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `data` date NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `capacidade_total` int DEFAULT '0',
  `participantes` int DEFAULT '0',
  `endereco` varchar(255) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (4,'JUNINA WE MAKE l Open Food Junino','ÊÊÊH TREM BÃO, A JUNINA WE MAKE VORTOU! \r\n\r\nPega aquele xadrez bunitim, passa um batom de coração, ajeita o chapéu de palha na cabeça e chama o par pra dançá coladim, que esse ano o arrasta-pé vem de love gostosin junto do Nattanzinho!\r\n\r\nNosso arraiá é daquele jeito: tem bandeirinha pra todo lado, tem brincadeiras, tem OPEN BAR PREMIUM & OPEN FOOD JUNINO parrudo.','2025-06-06','/uploads/1748405766014-junina.webp',500,3,'Rua Ninete, 2054','Joinville','SC'),(6,'Desafios da Mente – Oficina de Raciocínio Lógico','Prepare-se para exercitar o cérebro! Nesta oficina dinâmica e divertida, crianças e jovens serão convidados a resolver enigmas, jogos e atividades que estimulam o raciocínio lógico e a criatividade. O evento tem como objetivo desenvolver habilidades importantes para a resolução de problemas, pensamento crítico e trabalho em equipe – tudo de forma leve, acessível e interativa. Venha descobrir que pensar pode ser muito divertido!\r\n','2025-05-30','/uploads/1748448573586-6228f12f96439-lg.png',300,1,'Rua Tarcon, 81','São Paulo','SP'),(7,'FECAP | Fecapejada com Instituto Criativo','Como um bom Alvarista sabe, o semestre só começa depois de uma FECAPejada! ?\r\n\r\n\r\n\r\nO primeiro BAILÃO do ano tá chegando e essa edição PROMETE! ?\r\n\r\n\r\n\r\nA Atlética FECAP apresenta:\r\n\r\n\r\n\r\nFECAPejada: Joguem como bebemos! ?♣\r\n\r\n\r\n\r\nJoguem os dados, embaralhem as cartas e se preparem porque dia 04/04 às 23h a sorte vai estar do seu lado! Não vai perder, né? ?\r\n\r\n\r\n\r\n?Open bar\r\n\r\n \r\n\r\n? Cerveja \r\n\r\n? Yakultão\r\n\r\n?Coquetel de sabores\r\n\r\n? Água\r\n\r\n\r\n\r\n?Line up \r\n\r\n\r\n\r\n* 8H MEGATRON \r\n\r\n\r\n\r\n* Dj Tico\r\n\r\n\r\n\r\n* ⁠C15 da ZO\r\n\r\n\r\n\r\n* Marat\r\n\r\n\r\n\r\n* Igor Vilão\r\n\r\n\r\n\r\n* Romano\r\n\r\n\r\n\r\n* Dj Petrone\r\n\r\n\r\n\r\n?Rosas de ouro\r\n\r\n\r\n\r\nRua Cel. Euclides Machado, 1066\r\n\r\n','2025-05-21','/uploads/1747611809258-7a790a38c09ef96bdd7c84a6eb980615.png',500,9,'Rua Euclides, 1066','São Paulo','SP'),(8,'Celebrando a Diversidade com Alegria!','Um dia especial para receber nossas crianças com carinho, respeito e muita diversão! Neste evento, vamos promover atividades lúdicas, culturais e interativas que valorizam as diferenças e mostram como cada criança é única e importante. Com jogos, contação de histórias e momentos de convivência, queremos criar um ambiente acolhedor onde a diversidade seja vivida com empatia, amizade e inclusão','2025-05-29','/uploads/1748448422472-oficina.png',5,1,'Rua Tarcon, 81','São Luís','MA');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projetos`
--

DROP TABLE IF EXISTS `projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projetos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text,
  `categoria` varchar(100) DEFAULT NULL,
  `dataInicio` date NOT NULL,
  `dataFim` date DEFAULT NULL,
  `horario` time NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `responsavelId` int DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `responsavelId` (`responsavelId`),
  CONSTRAINT `projetos_ibfk_1` FOREIGN KEY (`responsavelId`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projetos`
--

LOCK TABLES `projetos` WRITE;
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
INSERT INTO `projetos` VALUES (1,'Oficina Preparatória para o Mercado de Tecnologia','Participe da nossa oficina especial voltada para jovens que desejam ingressar no mercado de tecnologia! Promovida pela nossa ONG, essa iniciativa oferece uma introdução prática a áreas como programação, design digital, e habilidades profissionais essenciais, com mentoria de especialistas do setor. Uma oportunidade única para dar os primeiros passos rumo a uma carreira promissora!','Mentoria','2025-05-27','2025-05-29','15:00:00','Av. da Liberdade, 532 - Liberdade, São Paulo - SP',4,'/uploads/1748448196055-1747610081632-pexels-mikhail-nilov-8296970.jpg'),(2,'Oficina de Integração – Bem-vindos ao Futuro da Tecnologia!','Nossa jornada começa aqui! Nesta oficina de integração, vamos nos conhecer, trocar experiências e criar conexões entre os participantes que estão iniciando sua trajetória no universo da tecnologia. A atividade é promovida pela nossa ONG como parte do acolhimento inicial, com dinâmicas leves e inspiradoras para fortalecer o espírito de equipe e apresentar o propósito do projeto. Vamos juntos construir um caminho de aprendizado e transformação!','Oficina','2025-05-27','2025-05-29','16:07:00','Rua A',5,'/uploads/1747613265504-20230506_141722.jpg');
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('admin','voluntario','participante','doador','instrutor') NOT NULL DEFAULT 'participante',
  `telefone` varchar(20) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `dataCadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (3,'Renan Damprelli','renandamprelli@gmail.com','123','admin','11943009795','551165487','2025-05-17 23:45:06',1),(4,'Deborah da Silva Souza','deborah@yahoo.com','123','doador','1125281283','551163841','2025-05-18 03:44:59',0),(5,'João','jota@gmail.com','123','doador','11943009795','55116381-1','2025-05-18 22:14:34',0),(6,'Marcos','m@gmail.com','123','participante','1125281283','55116472','2025-05-18 22:21:34',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 13:19:39
