
--
-- Database: `dopm`  Version pour déploiement nouveau client ou développeur avec quelques données de base
--

INSERT INTO `zone` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'UAP A', '', '2022-01-13 12:47:25.761', '2022-01-13 12:47:25.761'),
(2, 'UAP B', '', '2022-01-13 12:47:33.012', '2022-01-13 12:47:33.012'),
(3, 'UAP C', '', '2022-01-13 12:47:45.326', '2022-01-13 12:47:45.326'),
(4, 'Bâtiment administratif', '', '2022-01-13 12:48:17.411', '2022-01-13 12:48:17.411'),
(5, 'Technopôle', '', '2022-01-13 12:48:47.675', '2022-01-13 12:48:47.675'),
(6, 'Autre bâtiment ou extérieur', '', '2022-01-13 12:49:23.905', '2022-01-13 12:49:23.905');

INSERT INTO `subzone` (`id`, `name`, `description`, `zone_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Maintenance A', NULL, 1, '2022-01-13 12:50:45.717', '2022-01-13 12:50:45.717'),
(2, 'LD', NULL, 1, '2022-01-13 12:51:17.406', '2022-01-13 12:51:17.406'),
(3, 'HD', NULL, 1, '2022-01-13 12:51:28.081', '2022-01-13 12:51:28.081'),
(4, 'EPA', NULL, 1, '2022-01-13 12:51:36.488', '2022-01-13 12:51:36.488'),
(5, 'MHH', NULL, 1, '2022-01-13 12:51:42.660', '2022-01-13 12:51:42.660'),
(6, 'Magasin A', NULL, 1, '2022-01-13 12:51:51.823', '2022-01-13 12:51:51.823'),
(7, 'Laboratoire vie série', NULL, 1, '2022-01-13 12:52:09.964', '2022-01-13 12:52:09.964'),
(8, 'Usine M', NULL, 1, '2022-01-13 12:54:39.876', '2022-01-13 12:54:39.876'),
(9, 'Autre', NULL, 1, '2022-01-13 12:55:12.251', '2022-01-13 12:55:12.251'),
(10, 'Laboratoire prototype', NULL, 2, '2022-01-13 12:55:54.926', '2022-01-13 12:55:54.926'),
(11, 'stockage usine B', NULL, 2, '2022-01-13 12:56:24.322', '2022-01-13 12:56:24.322'),
(12, 'Autre', NULL, 2, '2022-01-13 12:59:22.429', '2022-01-13 12:59:22.429'),
(13, 'Maintenance C', NULL, 3, '2022-01-13 12:59:42.351', '2022-01-13 12:59:42.351'),
(14, 'Ilot CG 3', NULL, 3, '2022-01-13 13:01:08.425', '2022-01-13 13:01:08.425'),
(15, 'Ilot DIH', NULL, 3, '2022-01-13 13:01:31.390', '2022-01-13 13:01:31.390'),
(16, 'Ilot Knorr', NULL, 3, '2022-01-13 13:02:03.582', '2022-01-13 13:02:03.582'),
(17, 'Ilot PSA', NULL, 3, '2022-01-13 13:02:15.224', '2022-01-13 13:02:15.224'),
(18, 'Ilot Empos', NULL, 3, '2022-01-13 13:02:28.597', '2022-01-13 13:02:28.597'),
(19, 'Ilot ZF', NULL, 3, '2022-01-13 13:02:39.448', '2022-01-13 13:02:39.448'),
(20, 'Ilot CM', NULL, 3, '2022-01-13 13:02:52.016', '2022-01-13 13:02:52.016'),
(21, 'Ilot LPS', NULL, 3, '2022-01-13 13:03:01.318', '2022-01-13 13:03:01.318'),
(22, 'Magasin C', NULL, 3, '2022-01-13 13:03:11.794', '2022-01-13 13:03:11.794'),
(23, 'Autre', NULL, 3, '2022-01-13 13:04:27.733', '2022-01-13 13:04:27.733'),
(24, 'Etage', NULL, 4, '2022-01-13 13:05:58.383', '2022-01-13 13:05:58.383'),
(25, 'Rez de chaussée', NULL, 4, '2022-01-13 13:06:14.219', '2022-01-13 13:06:14.219'),
(26, 'Sous sol', NULL, 4, '2022-01-13 13:06:26.841', '2022-01-13 13:06:26.841'),
(27, 'Autre', NULL, 4, '2022-01-13 13:06:34.234', '2022-01-13 13:06:34.234'),
(28, 'Etage', NULL, 5, '2022-01-13 13:08:23.653', '2022-01-13 13:08:23.653'),
(29, 'Local étuve', NULL, 5, '2022-01-13 13:08:36.904', '2022-01-13 13:08:36.904'),
(30, 'Métrologie', NULL, 5, '2022-01-13 13:08:46.824', '2022-01-13 13:08:46.824'),
(31, 'Local banc linéaire', NULL, 5, '2022-01-13 13:08:57.536', '2022-01-13 13:08:57.536'),
(32, 'Local banc rotatif', NULL, 5, '2022-01-13 13:09:08.866', '2022-01-13 13:09:08.866'),
(33, 'Local CEM', NULL, 5, '2022-01-13 13:09:19.486', '2022-01-13 13:09:19.486'),
(34, 'Local pots vibrants', NULL, 5, '2022-01-13 13:09:44.408', '2022-01-13 13:09:44.408'),
(35, 'Autre', NULL, 5, '2022-01-13 13:10:00.356', '2022-01-13 13:10:00.356'),
(36, 'Parking', NULL, 6, '2022-01-13 13:10:19.080', '2022-01-13 13:10:19.080'),
(37, 'Parc à déchet', NULL, 6, '2022-01-13 13:10:52.453', '2022-01-13 13:10:52.453'),
(38, 'Autre bâtiment', NULL, 6, '2022-01-13 13:12:08.185', '2022-01-13 13:12:08.185'),
(39, 'Autre extérieur', NULL, 6, '2022-01-13 13:12:18.446', '2022-01-13 13:12:18.446');

--
-- Dumping data for table `period`
--

INSERT INTO `period` (`id`, `periodEnum`, `every`, `everyMonth`, `day`, `month`, `frequency`, `rank`, `checkpointId`) VALUES
(1, 2, 1, NULL, 'lundi,mercredi,samedi', 'Juin', NULL, '1', 1),
(2, 1, 1, 1, 'lundi,mercredi,vendredi', 'Octobre', NULL, 'Troisième', 2),
(3, 2, 1, NULL, 'mardi,jeudi,vendredi,dimanche', NULL, NULL, NULL, 3),
(4, 1, 1, NULL, NULL, NULL, NULL, NULL, 4),
(5, 2, 1, NULL, 'vendredi,samedi,dimanche', NULL, NULL, NULL, 5),
(6, 1, 1, NULL, NULL, NULL, NULL, NULL, 6),
(7, 1, 1, NULL, NULL, NULL, NULL, NULL, 7),
(8, 1, 1, NULL, NULL, NULL, NULL, NULL, 8),
(9, 1, 1, NULL, NULL, NULL, NULL, NULL, 9),
(10, 1, 1, NULL, NULL, NULL, NULL, NULL, 10),
(11, 1, 1, NULL, NULL, NULL, NULL, NULL, 11);

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Vert', '', '2021-12-30 21:32:26.557', '2022-01-13 12:45:44.800'),
(2, 'Bleu', '', '2021-12-31 10:10:28.219', '2022-01-13 12:45:55.377'),
(3, 'Noir', 'Nuit', '2022-01-13 12:46:14.224', '2022-01-13 12:46:14.224'),
(4, 'Journée', '', '2022-01-13 12:46:31.274', '2022-01-13 12:46:31.274'),
(5, 'Week-end', '', '2022-01-13 12:46:43.152', '2022-01-13 12:46:43.152');


INSERT INTO `as_categories` (`id`, `name`, `description`, `color`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `asBoardId`) VALUES
(1, 'HSE', '', '#28A745', '2022-09-29 14:56:13.593', '4', '2022-09-29 14:56:13.593', '4', 1),
(2, 'QUALITE', '', '#DC3545', '2022-09-29 14:56:22.875', '4', '2022-09-29 14:56:22.875', '4', 1),
(3, 'PRODUCTION', '', '#343A40', '2022-09-29 14:56:37.948', '4', '2022-09-29 14:56:37.948', '4', 1),
(4, 'PROD', '', '#343A40', '2023-02-08 17:48:33.504', '4', '2023-02-08 17:48:33.504', '4', 1);

--
-- Déchargement des données de la table `as_checklist`
--

INSERT INTO `as_checklist` (`id`, `label`, `done`, `taskId`) VALUES
(1, 'Tache 1', 1, 3),
(3, 'test', 1, 4),
(4, 'test 2', 0, 4),
(5, 'Verif 1', 1, 5),
(6, 'Verif 2', 0, 5),
(7, 'Tache 2', 0, 3),
(8, 'CDC', 1, 6),
(9, 'Go / No go direction test', 1, 6),
(10, 'Valider le CDC ok je valide', 0, 6),
(11, 'Test', 1, 2),
(12, 'A', 0, 7),
(13, 'B', 0, 7),
(14, 'C', 0, 7),
(15, 'P', 1, 12),
(16, 'D', 1, 12),
(17, 'C', 1, 12),
(19, 'Check date validité', 1, 16),
(20, 'Check emplacement', 0, 16);

--
-- Déchargement des données de la table `as_responsible`
--

INSERT INTO `as_responsible` (`taskId`, `userId`) VALUES
(1, 4),
(2, 4),
(2, 6),
(3, 4),
(3, 9),
(4, 9),
(5, 9),
(6, 4),
(6, 9),
(6, 60),
(7, 9),
(8, 4),
(11, 4),
(12, 4),
(12, 63),
(13, 4),
(14, 4),
(15, 4),
(16, 63);

--
-- Déchargement des données de la table `as_tables`
--

INSERT INTO `as_tables` (`id`, `name`, `description`, `color`, `orderTable`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `asBoardId`) VALUES
(1, 'Plan', 'Planification des tâches', '#3B7DDD', 1, '2022-09-29 13:28:21.054', '4', '2022-09-29 13:28:21.054', '4', 1),
(2, 'Do', 'Réalisation des tâches', '#E83E8C', 2, '2022-09-29 13:28:37.693', '4', '2022-09-29 13:33:29.211', '4', 1),
(4, 'Check', '', '#6C757D', 3, '2022-09-30 15:57:44.174', '4', '2022-09-30 15:57:44.174', '4', 1),
(6, 'Act', 'act', '#28A745', 5, '2022-10-18 14:22:34.193', '4', '2022-10-18 14:22:34.193', '4', 1);

--
-- Déchargement des données de la table `as_tasks`
--

INSERT INTO `as_tasks` (`id`, `title`, `description`, `remain`, `estimation`, `orderTask`, `categoryId`, `tableId`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `archived`, `archivedAt`) VALUES
(1, 'Tache 1', 'Test tache 1', '', '2023-02-14', 3, 1, 1, '2022-09-29 14:56:58.284', NULL, '2022-09-29 14:56:58.284', NULL, 0, NULL),
(2, 'Tache 2', 'Test tache 2', '', '2022-12-29', 1, 2, 2, '2022-09-29 14:57:15.588', NULL, '2022-09-29 14:57:15.588', NULL, 1, '2022-12-28 09:33:03.361'),
(3, 'Tâche 3', 'Test', '', '2023-02-23', 2, 3, 2, '2022-10-17 12:38:40.500', NULL, '2022-10-17 12:38:40.500', NULL, 0, NULL),
(4, 'Modification du doc QUALITE', 'L\'outil Top 5 est un outil de suivi d\'indicateurs épuré et facile d\'utilisation.\nCet outil digital est essentiel et vous permettra d\'améliorer', '', '2023-02-14', 2, 1, 4, '2022-10-22 09:38:15.189', NULL, '2022-10-22 09:38:15.189', NULL, 0, NULL),
(5, 'Tache 12', 'Tache avec Pierre', '', '2023-01-25', 2, 3, 2, '2022-11-10 09:44:24.706', NULL, '2022-11-10 09:44:24.706', NULL, 0, '2023-01-26 14:23:33.976'),
(6, 'Faire la procdéure MEP client', 'Revoir la procédure de mise en place des . . . . . .', '', '2023-02-15', 3, 1, 1, '2022-11-21 10:52:13.219', NULL, '2022-11-21 10:52:13.219', NULL, 0, '2023-01-17 19:35:05.624'),
(7, 'Changement de la presse', 'Il faut déplacer la Presse 12 et mettre en place la nouvelle presse 48. Ensuite il faudrat revalider tout les process avec des pre-prod durant 1mois.', '', '2023-01-26', 1, 2, 4, '2022-11-23 08:43:29.347', NULL, '2022-11-23 08:43:29.347', NULL, 0, NULL),
(8, 'Stock Nok', 'Stock en derive depuis 3J', '', '2023-02-10', 1, 3, 2, '2023-01-12 15:35:55.853', NULL, '2023-01-12 15:35:55.853', NULL, 0, NULL),
(9, 'Tâche 31', 'Essai 31', '', '2023-02-14', 2, 1, 1, '2023-01-31 07:32:44.514', NULL, '2023-01-31 07:32:44.514', NULL, 0, NULL),
(10, 'Tâche 32', 'Test avec Suleyman', '', '2023-02-03', 1, 2, 4, '2023-02-02 11:42:21.670', NULL, '2023-02-02 11:42:21.670', NULL, 0, NULL);



--
-- Dumping data for table `at_audit`
--

INSERT INTO `at_audit` (`id`, `date`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `serviceId`) VALUES
(1, '2022-09-08 14:21:57.972', '2022-09-08 14:22:59.345', '4', '2022-09-08 14:22:59.345', '4', 2),
(2, '2022-09-16 13:13:53.098', '2022-09-16 13:15:28.331', '4', '2022-09-16 13:15:28.331', '4', 2),
(8, '2022-09-22 14:02:23.000', '2022-09-23 14:03:02.538', '4', '2022-09-23 14:03:02.538', '4', 2),
(7, '2022-09-23 14:02:23.679', '2022-09-23 14:02:44.960', '4', '2022-09-23 14:02:44.960', '4', 2),
(5, '2022-09-21 11:31:25.000', '2022-09-23 11:32:58.396', '4', '2022-09-23 11:32:58.396', '4', 2),
(6, '2022-09-24 11:36:15.000', '2022-09-23 11:40:52.416', '4', '2022-09-23 11:40:52.416', '4', 2),
(9, '2022-09-20 14:02:23.000', '2022-09-23 14:04:30.717', '4', '2022-09-23 14:04:30.717', '4', 2),
(10, '2022-09-26 16:02:43.000', '2022-09-26 16:05:20.859', '4', '2022-09-26 16:05:20.859', '4', 2),
(11, '2022-09-29 12:06:22.000', '2022-10-03 12:07:21.972', '4', '2022-10-03 12:07:21.972', '4', 2),
(12, '2022-10-04 13:40:45.595', '2022-10-04 13:43:18.010', '4', '2022-10-04 13:43:18.010', '4', 4),
(16, '2022-10-14 08:40:32.201', '2022-10-14 08:41:03.396', '4', '2022-10-14 08:41:03.396', '4', 2),
(14, '2022-10-13 12:49:45.192', '2022-10-13 12:50:49.256', '4', '2022-10-13 12:50:49.256', '4', 2),
(17, '2022-10-14 08:40:32.201', '2022-10-14 08:41:46.446', '4', '2022-10-14 08:41:46.446', '4', 4),
(21, '2022-10-19 07:58:52.564', '2022-10-19 07:59:12.985', '4', '2022-10-19 07:59:12.985', '4', 4),
(22, '2022-10-19 08:05:36.255', '2022-10-19 08:06:05.333', '4', '2022-10-19 08:06:05.333', '4', 2),
(25, '2022-10-17 08:10:32.000', '2022-10-19 08:10:48.233', '4', '2022-10-19 08:10:48.233', '4', 2),
(27, '2022-10-21 09:36:54.277', '2022-10-21 09:37:13.934', '4', '2022-10-21 09:37:13.934', '4', 4),
(28, '2022-10-07 09:26:52.000', '2022-10-22 09:27:51.437', '4', '2022-10-22 09:27:51.437', '4', 2),
(29, '2022-10-23 16:20:58.023', '2022-10-23 16:21:06.686', '4', '2022-10-23 16:21:06.686', '4', 2),
(30, '2022-10-21 16:20:58.000', '2022-10-23 16:21:33.859', '4', '2022-10-23 16:21:33.859', '4', 2),
(31, '2022-10-24 07:21:53.461', '2022-10-24 07:22:19.706', '4', '2022-10-24 07:22:19.706', '4', 2),
(39, '2022-10-25 09:08:31.000', '2022-10-28 09:09:11.368', '4', '2022-10-28 09:09:11.368', '4', 2),
(51, '2022-10-26 11:37:27.000', '2022-10-28 11:38:03.335', '4', '2022-10-28 11:38:03.335', '4', 2),
(40, '2022-10-20 09:08:31.000', '2022-10-28 09:09:39.678', '4', '2022-10-28 09:09:39.678', '4', 2),
(46, '2022-10-31 10:15:53.000', '2022-10-28 09:16:11.479', '4', '2022-10-28 09:16:11.479', '4', 2),
(50, '2022-10-29 11:37:27.000', '2022-10-28 11:37:54.937', '4', '2022-10-28 11:37:54.937', '4', 2),
(52, '2022-11-07 13:29:45.000', '2022-11-07 13:31:40.608', '4', '2022-11-07 13:31:40.608', '4', 4),
(53, '2022-11-07 13:33:16.383', '2022-11-07 13:33:21.840', '4', '2022-11-07 13:33:21.840', '4', 2),
(54, '2022-11-10 09:27:58.368', '2022-11-10 09:30:01.336', '4', '2022-11-10 09:30:01.336', '4', 4),
(55, '2022-11-09 09:27:58.000', '2022-11-10 09:30:11.770', '4', '2022-11-10 09:30:11.770', '4', 2),
(56, '2022-11-10 09:30:45.401', '2022-11-10 09:30:51.731', '4', '2022-11-10 09:30:51.731', '4', 2),
(57, '2022-11-14 17:13:19.430', '2022-11-14 17:14:20.901', '4', '2022-11-14 17:14:20.901', '4', 2),
(58, '2022-11-21 10:41:55.069', '2022-11-21 10:45:16.681', '4', '2022-11-21 10:45:16.681', '4', 2),
(59, '2022-11-23 08:34:25.134', '2022-11-23 08:36:09.893', '4', '2022-11-23 08:36:09.893', '4', 4),
(60, '2022-11-23 08:36:56.388', '2022-11-23 08:37:01.239', '4', '2022-11-23 08:37:01.239', '4', 2),
(61, '2022-12-01 09:08:45.680', '2022-12-01 09:08:51.325', '4', '2022-12-01 09:08:51.325', '4', 2),
(62, '2022-12-06 18:01:27.944', '2022-12-06 18:01:33.176', '4', '2022-12-06 18:01:33.176', '4', 2),
(63, '2022-12-05 18:01:27.000', '2022-12-06 18:01:39.430', '4', '2022-12-06 18:01:39.430', '4', 2),
(64, '2022-12-08 13:45:37.739', '2022-12-08 13:49:03.856', '4', '2022-12-08 13:49:03.856', '4', 2),
(65, '2022-12-08 13:45:37.739', '2022-12-08 13:49:28.823', '4', '2022-12-08 13:49:28.823', '4', 4),
(66, '2022-12-12 14:25:12.814', '2022-12-12 14:27:10.363', '4', '2022-12-12 14:27:10.363', '4', 2),
(67, '2022-12-12 14:25:12.000', '2022-12-12 14:27:33.843', '4', '2022-12-12 14:27:33.843', '4', 4),
(68, '2022-12-13 09:41:29.000', '2022-12-13 09:42:40.560', '4', '2022-12-13 09:42:40.560', '4', 2);

--
-- Dumping data for table `at_category`
--

INSERT INTO `at_category` (`id`, `color`, `name`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`) VALUES
(1, '#FFC107', '5S', '2022-09-05 09:12:57.774', '4', '2022-09-05 09:12:57.774', '4'),
(2, '#28A745', 'Qualité', '2022-09-05 09:13:04.322', '4', '2022-09-05 09:13:04.322', '4'),
(3, '#343A40', 'Production', '2022-09-05 09:13:17.202', '4', '2022-09-05 09:13:17.202', '4');

--
-- Dumping data for table `at_checkpoint`
--

INSERT INTO `at_checkpoint` (`id`, `numero`, `standard`, `description`, `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `image`, `zoneId`, `subzoneId`, `categoryId`, `periodId`) VALUES
(1, 1, 'Bureaux UAP A - Managers', 'Vérification des bureaux des managers (Propreté, Multiprises au sol, Désinfectants Covid-19...)', '2022-09-05 09:16:03.291', '4', '2022-12-12 14:30:24.754', '4', '/images/audit/0XjBYAxPsQVa076YaCf5S.webp', 1, 8, 1, NULL),
(2, 2, 'Rupture Stock', 'Présence alerte Log si manque composant.\nSTD : stock minimun', '2022-09-06 08:23:02.224', '4', '2022-10-28 09:18:17.059', '4', '/images/audit/p__IiHy0dRidlsIBoy4ya.webp', 1, 4, 3, NULL),
(3, 3, 'Audit LPA', 'Vérification des standards et des routines de management', '2022-09-06 08:24:32.170', '4', '2022-10-28 11:21:22.026', '4', '/images/audit/cGghCpnLMCuQCsZ-KT4P5.webp', 1, 8, 2, NULL),
(4, 4, 'OK Démarrage', 'Vérification du poste de travail', '2022-09-06 08:25:12.282', '4', '2022-10-28 09:18:28.426', '4', '/images/audit/bf_PT90gwyyhLchxcJcHE.webp', 2, 10, 3, NULL),
(5, 10, 'zafvzr', 'zevrvzrebv', '2022-09-22 17:48:14.030', '4', '2022-10-28 11:37:23.111', '4', '/images/audit/skI7FnrlqLZ3k9VIRGmZ4.webp', 2, 10, 1, NULL),
(6, 5, "Issues de secours libres d\'accès et déverrouillées", '', '2022-10-04 12:39:39.857', '4', '2022-10-28 09:11:33.885', '4', '/images/audit/DDjJlCY4pthVgXoLVmhPJ.webp', 6, 38, 1, NULL),
(7, 6, 'RIA et extincteurs dégagés', '', '2022-10-04 12:40:30.109', '4', '2022-10-14 08:39:36.624', '4', '/images/audit/__vUn6yWmKIfEkuQvw4pt.webp', 1, 6, 1, NULL),
(8, 7, 'Présence et utilisation de counter caisse à chaque caisse', '', '2022-10-04 12:41:33.162', '4', '2022-10-28 09:11:39.407', '4', '', 2, 11, 3, NULL),
(9, 8, 'Une chaise ergonomique à chaque poste en caisse', '', '2022-10-04 12:43:05.794', '4', '2022-10-28 09:11:44.115', '4', '', 3, 14, 2, NULL),
(10, 9, 'Chaises en bon état', '', '2022-10-04 12:43:25.250', '4', '2022-10-28 09:11:50.043', '4', '', 2, 11, 1, NULL),
(11, 11, 'Les réglettes du FL sont en bons états', '', '2022-10-04 12:43:56.165', '4', '2022-10-28 09:11:55.513', '4', '', 2, 11, 3, NULL);

--
-- Dumping data for table `at_checkpoint_service`
--

INSERT INTO `at_checkpoint_service` (`id_service`, `id_atcheckpoint`) VALUES
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 7),
(4, 8),
(4, 9),
(4, 10),
(4, 11);


--
-- Déchargement des données de la table `fi_careprovided`
--

INSERT INTO `fi_careprovided` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'SST', '2022-12-28 10:38:03.228', '2022-12-28 10:38:03.228'),
(2, 'Infirmier (ère)', '2022-12-28 10:38:13.787', '2022-12-28 10:38:31.037'),
(3, 'Pompier', '2022-12-28 10:38:37.375', '2022-12-28 10:38:37.375');

--
-- Déchargement des données de la table `fi_classification`
--

INSERT INTO `fi_classification` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Classif 1', '', '2022-12-28 10:39:50.067', '2022-12-28 10:39:50.067'),
(2, 'Classif 2', '', '2022-12-28 10:39:55.977', '2022-12-28 10:39:55.977');

--
-- Déchargement des données de la table `fi_ficheinfirmeries`
--

INSERT INTO `fi_ficheinfirmeries` (`id`, `id_fi`, `injuredCategory_id`, `injuredCategoryName`, `senderFirstname`, `senderLastname`, `post`, `responsibleSecurite_id`, `service_id`, `team_id`, `dateAccident`, `hourAccident`, `zone_id`, `subzone_id`, `circumstances`, `materialElements_id`, `lesionDetails_id`, `lesionImage`, `careProvided_id`, `caregiver`, `careGived`, `image1`, `status`, `assignation_id`, `classification_id`, `commentaireStatus`, `createdAt`, `updatedAt`) VALUES
(1, '2023-1', 1, '', 'Florent', 'SIMONET', 'SI', 4, 5, 4, '2023-02-08 23:00:00.000', '15:24', 2, 11, 'Test circonstance', 1, 2, '/images/ficheinfirmerie/CVwxB2lrVw9cFgNBCWYE1.webp', 1, 'Donneur soins', 'Soins donnés', '/images/ficheinfirmerie/KYd9B-ohKLQ45TLOHhHZa.webp', 'Nouvelle', NULL, NULL, NULL, '2023-02-09 14:25:37.313', '2023-02-09 14:25:37.313'),
(2, '2023-2', 4, 'LOFI', 'Pierre', 'HOBEIKA', 'DS', 4, 5, 3, '2023-02-08 23:00:00.000', '15:26', 3, 16, 'Test ', 1, 3, '/images/ficheinfirmerie/MZ8Np2NxNExvk7vyztKTt.webp', 2, 'dr', 'der', '/images/ficheinfirmerie/prCVe0iOK8IV0VcuCMloH.webp', 'Nouvelle', NULL, NULL, NULL, '2023-02-09 14:26:56.829', '2023-02-09 14:26:56.829'),
(3, '2023-3', 3, '', 'eazef', 'ezfvze', 'eccz', 4, 6, 3, '2023-03-15 23:00:00.000', '18:38', 3, 18, 'FVzv ezervfr', 2, 5, '/images/ficheinfirmerie/0mPXJJ7LtPnTw68z4NnvG.webp', 1, 'DER', 'DES', '/images/ficheinfirmerie/yyObuNRTx4JdlcBlVWJr3.webp', 'Nouvelle', NULL, NULL, NULL, '2023-03-16 17:48:02.019', '2023-03-16 17:48:02.019'),
(4, '2023-4', 1, '', 'Florent', 'DSI', 'DSI', 4, 5, 5, '2023-03-16 23:00:00.000', '09:50', 2, 11, 'vezev rzfv zerfvvez', 2, 5, '/images/ficheinfirmerie/KM7__ewbnU23Q2wZvZkeA.webp', 5, 'ezfez', 'zfezf', '', 'Nouvelle', NULL, NULL, NULL, '2023-03-17 08:51:51.245', '2023-03-17 08:51:51.245');

--
-- Déchargement des données de la table `fi_injuredcategory`
--

INSERT INTO `fi_injuredcategory` (`id`, `name`, `createdAt`, `updatedAt`, `isInjuredCategoryName`) VALUES
(1, 'Employé', '2022-12-28 10:31:57.746', '2022-12-28 10:31:57.746', NULL),
(3, 'Stagiaire', '2022-12-28 10:33:08.687', '2022-12-28 10:33:08.687', NULL),
(4, 'Ext.', '2023-01-20 10:16:23.171', '2023-02-08 07:04:42.296', 1);

--
-- Déchargement des données de la table `fi_lesiondetails`
--

INSERT INTO `fi_lesiondetails` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Piqûre d\'insecte', '2022-12-28 10:37:23.867', '2022-12-28 10:37:23.867'),
(2, 'Torsion', '2022-12-28 10:37:30.563', '2022-12-28 10:37:30.563'),
(3, "Echarde / Corps étranger", '2022-12-28 10:37:45.042', '2022-12-28 10:37:45.042'),
(5, 'Test', '2023-02-16 17:30:55.335', '2023-02-16 17:30:55.335'),
(7, 'SOTA', '2023-02-16 17:41:35.579', '2023-02-16 17:41:35.579');

--
-- Déchargement des données de la table `fi_materialelements`
--

INSERT INTO `fi_materialelements` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, "Appareils de levage", '2022-12-28 10:36:26.359', '2022-12-28 10:36:26.359'),
(2, "Chariots élévateurs", '2022-12-28 10:36:39.605', '2022-12-28 10:36:39.605');

--
-- Déchargement des données de la table `fi_notification`
--

INSERT INTO `fi_notification` (`id`, `responsable_id`, `zone_id`, `isSubscribed`) VALUES
(1, 4, 1, 1),
(2, 4, 2, 1),
(3, 4, 3, 1),
(4, 4, 4, 1),
(5, 4, 5, 1),
(6, 4, 6, 1);


INSERT INTO `fs_category` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Sécurité Santé ', '', '2021-12-31 10:11:04.551', '2022-01-13 12:35:25.675'),
(2, 'Environnement Energie', '', '2022-01-11 10:23:11.025', '2022-01-11 10:23:11.025'),
(3, 'Amélioration', '', '2022-01-13 12:34:48.971', '2022-01-13 12:34:48.971');

--
-- Dumping data for table `fs_classification`
--

INSERT INTO `fs_classification` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Déchets toxiques', '', '2022-08-15 19:12:22.988', '2022-08-15 19:12:22.988'),
(2, 'Manutention', '', '2022-08-15 19:12:50.030', '2022-08-15 19:13:04.632');

--
-- Dumping data for table `fs_notification`
--

INSERT INTO `fs_notification` (`id`, `responsable_id`, `zone_id`, `isSubscribed`) VALUES
(1, 2, 1, 1),
(2, 2, 2, 1),
(3, 2, 3, 1),
(4, 2, 4, 1),
(5, 2, 5, 1),
(6, 2, 6, 1);

--
-- Dumping data for table `sug_category`
--

INSERT INTO `sug_category` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Productivité', '2022-08-31 08:26:24.133', '2022-10-23 16:26:25.992'),
(2, 'Qualité', '2022-08-31 08:26:29.351', '2022-08-31 08:26:29.351'),
(3, 'Bien-être', '2022-10-23 16:26:54.111', '2022-10-23 16:26:54.111');

--
-- Dumping data for table `sug_classification`
--

INSERT INTO `sug_classification` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Class 1', '2022-10-04 16:44:00.130', '2022-10-04 16:44:00.130'),
(2, 'Class 2', '2022-10-04 16:44:05.048', '2022-10-04 16:44:05.048');

--
-- Dumping data for table `top5_category`
--

INSERT INTO `top5_category` (`id`, `name`, `orderCategory`, `branch_id`) VALUES
(1, 'HSE', 1, 1),
(2, 'QUALITE', 2, 1),
(3, 'PRODUCTION', 3, 1),
(4, 'HSE', 1, 2),
(5, 'QUALITE', 2, 2),
(6, 'COUT MOD', 3, 2),
(7, 'DELAIS', 4, 2),
(8, 'FINANCE', 4, 1);

--
-- Dumping data for table `top5_indicator`
--

INSERT INTO `top5_indicator` (`id`, `name`, `orderIndicator`, `reading`, `unity`, `responsible`, `isDisplayCumulative`, `category_id`, `indicatorMode`, `fileType`, `fileName`, `updatedAt`, `indicatorCalculHisto`) VALUES
(1, 'ATAA', 1, 1, '11', 'Joel', 0, 1, 0, 0, '', '2022-12-27 12:29:01.061', 4),
(2, 'ATSA', 2, 1, '11', 'Joel', 0, 1, 0, 0, '', '2022-12-27 12:30:06.400', 2),
(3, 'Alertes', 1, 1, '11', 'Lionel', 0, 2, 0, 0, '', '2022-12-27 12:31:40.398', 2),
(4, 'Efficience', 1, 1, '0', 'Pascal', 0, 3, 0, 0, '', '2022-12-27 12:33:22.050', 1),
(5, 'Frais', 1, 0, '2', 'Pascal', 1, 8, 0, 0, '', '2022-12-27 12:35:25.443', 1);

--
-- Dumping data for table `top5_curve`
--

INSERT INTO `top5_curve` (`id`, `name`, `curveType`, `color`, `indicator_id`) VALUES
(1, 'ATAA', 0, '#3B7DDD', 1),
(2, 'ATSA', 0, '#3B7DDD', 2),
(3, 'Alertes', 0, '#3B7DDD', 3),
(4, 'UAP A', 0, '#3B7DDD', 4),
(5, 'UAP B', 0, '#E83E8C', 4),
(6, 'Maintenance', 1, '#3B7DDD', 5),
(7, 'Commerce', 1, '#FFC107', 5);

--
-- Dumping data for table `top5_target`
--

INSERT INTO `top5_target` (`id`, `name`, `target`, `color`, `targetType`, `targetGoal`, `indicator_id`) VALUES
(1, 'TAGET_ATAA', '0', '#28A745', 1, 1, 1),
(2, 'TARGET_ATSA', '2', '#28A745', 1, 0, 2),
(3, 'TARGET_Alertes', '5', '#28A745', 0, 0, 3),
(4, 'TARGET_Efficience', '75', '#28A745', 1, 0, 4),
(5, 'TARGET_Frais', '500', '#28A745', 0, 1, 5);


--
-- Dumping data for table `boardtuile`
--

INSERT INTO `boardtuile` (`id`, `i`, `branche`, `category`, `format`, `h`, `indicator_id`, `isBounded`, `isDraggable`, `isResizable`, `maxH`, `maxW`, `minH`, `minW`, `moved`, `periode`, `static`, `tool`, `type`, `w`, `x`, `y`, `user`, `size`, `dashboard_id`) VALUES
(1, '1', '1', NULL, NULL, 4, NULL, NULL, 1, 1, 9, 12, 3, 12, 0, NULL, 0, 'Top5', 'branche', 12, 0, 0, 2, '12', 1),
(2, '2', '1', '1', 'histogramme', 11, 1, NULL, 1, 1, 16, 4, 10, 4, 0, 'historique', 0, 'Top5', 'indicateur', 4, 0, 4, 2, '4', 1),
(3, '3', '1', '1', 'histogramme', 11, 2, NULL, 1, 1, 16, 4, 10, 4, 0, 'historique', 0, 'Top5', 'indicateur', 4, 4, 4, 2, '4', 1);