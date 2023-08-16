--
-- Base de données : `dopm`
--

-- --------------------------------------------------------
-- POUR LES USERS & LANGUES
--
-- Table structure for table `user`
--


--
-- Table structure for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'user', '2021-05-19 20:13:06.000', '2021-05-19 20:13:06.000'),
(2, 'admin', '2021-05-19 00:00:00.000', '2021-05-19 00:00:00.000');

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'ACHATS', '', '2022-01-13 13:21:49.474', '2022-09-02 17:20:48.984'),
(2, 'HSE', '', '2022-01-13 13:22:34.164', '2022-09-02 17:20:55.848'),
(3, 'MAINTENANCE', '', '2022-01-13 13:26:38.537', '2022-09-02 17:21:15.702'),
(4, 'LOGISTIQUE', '', '2022-01-13 13:28:12.245', '2022-09-02 17:21:30.755'),
(5, 'AMELIORATION LEAN', '', '2022-01-13 13:28:39.844', '2022-09-02 17:22:02.691'),
(6, 'QUALITE', '', '2022-01-13 13:28:52.727', '2022-09-02 17:21:42.633'),
(7, 'R&D', '', '2022-01-13 13:29:07.445', '2022-01-13 13:29:07.445'),
(8, 'RH', '', '2022-01-13 13:29:29.049', '2022-09-02 17:22:09.750'),
(9, 'UAP A', '', '2022-01-13 13:31:57.585', '2022-09-02 17:22:29.371'),
(10, 'UAP C', '', '2022-01-13 13:32:08.482', '2022-09-02 17:22:34.485');


INSERT INTO `user` (`id`, `last_name`, `first_name`, `email`, `fonction`, `url`, `username`, `password`, `createdAt`, `updatedAt`, `isComityUser`, `isResponsible`, `isAlterateDate`, `serviceId`) VALUES
(1, 'admin', 'admin', 'system@sodigitale.fr', 'Digital Leader', '/images/Logo.png', 'admin', '$2a$08$bOee8pjzg4Ww0J1f2NzjmOgpJjFiyRPHFiJfpeVtbY/MxKxX67hny', '2021-05-10 00:00:00.000', '2021-05-10 18:02:54.275', NULL, 0, 0, 2),
(61, 'Lambert', 'DURAN', 'lduran@gmail.com', 'Developpeur', '', 'lambert.duran', '$2a$08$cUhyNbfn.LFVlwlGcaywXuk3Dcat9CNNQV3OaY6z2Q5zo4aRJ8xva', '2022-09-23 11:17:05.206', '2022-08-04 12:47:36.946', NULL, 1, 0, 2),
(2, 'SIMONET', 'Florent', 'florent.simonet@sodigitale.fr', 'Digital Manager', '/images/profil/Florent_Teams_Nov2021XLhWogNc3vrLA9q-TCTkY.webp', 'florent.simonet', '$2a$08$VXwmKSqjcmUJNEcO0V3H.uJtnydgq7.wmeSzDI.PhrFn1vK0E9IxS', '2022-12-23 12:41:35.305', '2021-05-19 18:17:03.166', 1, 1, 0, 1),
(6, 'CODIR', '', 'florent.simonet@oxxo.fr', 'Direction', '/images/profil/handshake-33825037pkE_OijS1tpNNPknfc6u.webp', 'CODIR', '$2a$08$ZInBej4AAXGQ4nek7RY/QOZWpIGym0wrXrVGo5ESIINRoGuTU6Wui', '2022-10-27 13:28:07.595', '2021-05-19 19:34:32.337', NULL, 0, 0, 1),
(8, 'CODU', '', 'codu@efi.com', 'Comité d\'usine', '/images/1KiQz-5zrEPOd6n-Wdl_xM.webp', 'CODU', '$2a$08$93Cu13VLHT14DC5cSYboyeJXPqSNa1v9t1RqATcXQUZAr/XcdDN7i', '2022-09-29 16:43:06.096', '2021-06-02 05:50:29.512', NULL, 0, 0, 1),
(60, 'SPA', 'SPA', 'flomusic21@gmail.com', 'Test', '', 'spa', '$2a$08$q1/YaBF1BbAdAjKDKhqdTeU7YF5j47.Bg3sts6yZxUkTG132V7odW', '2022-12-12 12:16:48.265', '2022-07-22 12:36:51.341', NULL, 1, 0, 4),
(62, 'Loïck', 'LEPRÉVOST', 'Loïck.LEPRÉVOST@gmail.com', 'Developpeur', '', 'loick.leprevost', '$2a$08$ebyKrB.ROcr0J1w4eVJGL.AxE15BNcHaGhAnNUGlULiO6c4YZfI42', '2022-08-04 13:24:05.889', '2022-08-04 13:24:05.889', NULL, 0, 0, 2);


--
-- Table structure for table `user_roles`
--

INSERT INTO `user_roles` (`roleId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 6, '2021-05-19 19:34:32.389', '2021-05-19 19:34:32.389'),
(1, 8, '2021-06-02 05:50:29.567', '2021-06-02 05:50:29.567'),
(1, 60, '2022-07-22 12:36:51.375', '2022-07-22 12:36:51.375'),
(2, 1, '2021-06-22 21:04:57.000', '2021-06-22 21:04:57.906'),
(2, 2, '2021-05-19 18:17:03.218', '2021-05-19 18:17:03.218'),
(2, 61, '2022-08-04 12:47:36.971', '2022-08-04 12:47:36.971'),
(2, 62, '2022-08-04 13:24:05.903', '2022-08-04 13:24:05.903');


--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'french', '2022-07-22 16:13:42.000', '2022-07-22 16:13:42.000'),
(2, 'english', '2022-07-22 16:13:42.000', '2022-07-22 16:13:42.000'),
(3, 'spanish', '2022-07-22 16:13:42.000', '2022-07-22 16:13:42.000');

-- --------------------------------------------------------

--
-- Dumping data for table `user_language`
--

INSERT INTO `user_language` (`languageId`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2022-07-22 16:14:44.000', '2022-07-22 16:14:44.000'),
(1, 2, '2022-07-22 16:14:44.000', '2022-07-22 16:14:44.000'),
(1, 6, '2022-07-22 16:14:44.000', '2022-07-22 16:14:44.000'),
(1, 8, '2022-07-22 16:14:44.000', '2022-07-22 16:14:44.000'),
(2, 60, '2022-07-22 16:14:44.000', '2022-07-22 16:14:44.000'),
(1, 62, '2022-08-04 13:24:05.897', '2022-08-04 13:24:05.897'),
(1, 61, '2022-08-04 12:47:36.961', '2022-08-04 12:47:36.961');




-- --------------------------------------------------------
-- POUR L'Initialisation DASHBOARD & TOP5 & TASK


--
-- Dumping data for table `dashboard`
--

INSERT INTO `dashboard` (`id`, `name`, `order`, `createdAt`) VALUES
(1, 'Dashboard', 1, '2022-10-10 15:06:26.085');

--
-- Dumping data for table `as_board`
--

INSERT INTO `as_board` (`id`, `name`, `order`, `createdAt`) VALUES
(1, 'CODIR', 1, '2023-02-08 17:47:28.165'),

--
-- Dumping data for table `top5_branch`
--

INSERT INTO `top5_branch` (`id`, `name`, `orderBranch`, `createdAt`, `updatedAt`) VALUES
(1, 'CODIR', 1, '2022-07-19 11:58:12.521', '2022-07-19 11:58:12.522');



-- --------------------------------------------------------
-- POUR LA GESTION DES DROITS


--
-- Table structure for table `rights_permissions`
--

INSERT INTO `rights_permissions` (`id`, `name`) VALUES
(1, 'Gestion Utilisateurs & Droits'),
(6, 'Lecture Dashboard'),
(7, 'Parametrage Dashboard'),
(9, 'Lecture Graphique'),
(10, 'Ajout Données Catégorie'),
(13, 'Paramétrage Top 5'),
(14, 'Ajout Fiche Sécurité'),
(15, 'Lecture Fiche Sécurité'),
(16, 'Lecture Statistiques Fiche Sécurité'),
(17, 'Traitement Fiche Sécurité'),
(18, 'Paramétrage Fiche Sécurité'),
(19, 'Réalisation Audit Terrain'), 
(20, 'Paramétrage Audit Terrain');


--
-- Déchargement des données de la table `rights_groupes`
--

INSERT INTO `rights_groupes` (`id`, `name`) VALUES
(1, 'KU Dashboard'),
(2, 'KU DOPM'),
(4, 'KU Top5'),
(5, 'KU Fiche Sécurité'),
(6, 'Ku Audit Terrain');

--
-- Déchargement des données de la table `rights_groupes_permissions`
--

INSERT INTO `rights_groupes_permissions` (`id_groupe`, `id_permission`) VALUES
(1, 6),
(1, 7),
(2, 1),
(2, 6),
(2, 7),
(2, 9),
(2, 10),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(2, 18),
(4, 6),
(4, 9),
(4, 10),
(4, 13),
(5, 14),
(5, 15),
(5, 16),
(5, 17),
(5, 18),
(6, 19),
(6, 20);

--
-- Dumping data for table `rights_user_groupes`
--

INSERT INTO `rights_user_groupes` (`id_user`, `id_groupe`) VALUES
(2, 1),
(2, 2),
(2, 4),
(2, 5),
(2, 6);

-- --------------------------------------------------------
-- POUR LE CALCUL HISTORIQUE TOP5

INSERT INTO `top5_calculhistorical` (id, libelle, description) VALUES
(1, 'Aucun', 'Aucun calcul automatique'),
(2, 'Dernier', 'Pris en compte de la valeur saisie le dernier jour'),
(3, 'Moyenne', 'Moyenne des données du mois'),
(4, 'Cumul', 'Somme des données du mois');

-- --------------------------------------------------------
-- POUR LES VERSIONS

--
-- Dumping data for table `versionning`
--


INSERT INTO `versionning` (`id`, `name`, `date`) VALUES
(1, 'v1.0.0', '2021-04-01 08:52:08.445'),
(4, 'v1.1.0', '2021-04-15 08:52:08.445'),
(5, 'v1.2.0', '2021-06-02 08:52:08.445'),
(6, 'v1.2.1', '2021-06-11 08:52:08.445'),
(7, 'v2.0.0', '2021-12-28 08:52:08.445'),
(8, 'v1.3.0', '2021-07-06 09:13:30.647'),
(9, 'v1.3.1', '2021-09-16 09:17:34.040'),
(10, 'v1.3.2', '2021-10-28 09:20:41.117'),
(11, 'v3.0.0', '2022-05-16 09:58:00.183'),
(12, 'v3.0.1', '2022-06-15 10:00:29.073'),
(13, 'v3.1.0', '2022-08-08 10:14:50.987'),
(14, 'v3.0.2', '2022-07-04 10:37:53.328'),
(15, 'v3.1.1', '2022-09-09 10:41:24.380'),
(16, 'v3.2.0', '2022-09-15 09:08:54.497'),
(17, 'v3.3.0', '2022-09-23 08:33:12.121'),
(18, 'v3.3.1', '2022-10-05 13:21:32.326'),
(19, 'v3.3.2', '2022-10-10 15:18:04.675'),
(20, 'v3.3.3', '2022-10-14 07:22:46.757'),
(21, 'v3.3.4', '2022-10-27 09:24:35.956'),
(22, 'v3.3.5', '2022-12-01 09:06:25.890'),
(23, 'v3.3.6', '2022-12-23 14:19:10.753'),
(24, 'v3.3.7', '2022-12-30 18:05:17.182');


--
-- Dumping data for table `feature`
--

INSERT INTO `feature` (`id`, `name`, `version_id`) VALUES
(1, 'Création Dashboard', 1),
(2, 'Création Top5', 1),
(6, 'Top5 - Nouveau Menu', 4),
(7, 'Top5 - Correction Bug affichage commentaire', 4),
(8, 'Top5 - Amélioration Couleur Historique', 4),
(9, 'Amélioration Responsive Chrome HD', 4),
(10, 'DOPM - Ajout Setting pour administration', 5),
(11, 'DOPM - Mise en place connexion cryptée JWT', 5),
(12, 'DOPM - Création Documentations FicheSecurité et Version', 5),
(13, 'Top5 - Valider général dans ajout de données', 5),
(14, 'Top5 - Mise en place de pop-up de validation', 5),
(15, 'Top5 - Debug sur l\'ajout de plusieurs courbes et targets', 6),
(16, 'Top5 - Ordre catégorie et indicateurs', 6),
(18, 'Top5 - Ajout de branches', 8),
(19, 'Top5 - Amélioration affichage abscisses', 8),
(20, 'DOPM - Modification photos de profil', 8),
(21, 'DOPM - Menu se cache après sélection', 8),
(22, 'DOPM - Paramétrage Users et Branches', 8),
(23, 'Top5 - Débug affiché cumulé', 8),
(24, 'Top5 - Débug ajout données sur indicateurs avec plusieurs courbes', 8),
(25, 'Top5 - Débug modification indicateur lecture et unité', 8),
(26, 'DOPM - Debug rafraichissement changement de branche', 9),
(27, 'Top5 - Débug affichage 0 par défaut dans chart', 9),
(28, 'Top5 - Débug double cliques pour ajout de données', 9),
(29, 'Top5 - Amélioration Design Ajout catégorie', 9),
(30, 'Top5 - Amélioration lisibilité donnes histogramme (Vertical&Horizontal)', 9),
(31, 'DOPM - Menu se cache après plusieurs sélections', 10),
(32, 'Top5 - Extraction des indicateurs dans paramètre', 10),
(33, 'Top5 - Débug couleur sur affichage cumulé', 10),
(34, 'Top5 - Création nouvelle unité nbr(entier)', 10),
(35, 'Top5 - Changement de couleur des datas sur les courbes (Noir)', 10),
(36, 'Top5 - Amélioration de l\'historique avec archivage annuel', 10),
(37, 'FicheSécurité - Lancement de l\'outil fiche sécurité', 7),
(38, 'DOPM - Menu se cache après plusieurs sélections (Smartphone)', 7),
(39, 'Top5 - Débug formulaire ajout historique (doublons datas)', 7),
(40, 'Top5 - Amélioration target croisssante (couleur sur moyenne mensuelle)', 7),
(41, 'Top5 - Amélioration design dans le paramétrage', 7),
(42, 'Documentations - Création documentation Top5', 7),
(43, 'DOPM - Refonte globale TSX', 11),
(44, 'Dashboard - Amélioration visuelle', 11),
(45, 'Top5 - Amélioration code & performance', 11),
(46, 'FicheSécurité - Débug filtres consultation', 11),
(47, 'DOPM - Amélioration Menu de chaque module ( _ )', 12),
(48, 'Top5 - Amélioration visuel catégorie active', 12),
(49, 'FicheSécurité - Création version imprimable traitement', 12),
(60, 'Top5 - Création indicateur PDF', 14),
(61, 'Top5 - Création indicateur Fichier (Word/Excel/PowerPoint)', 14),
(62, 'Top5 - Création indicateur mode mensuel (12mois)', 14),
(68, 'DOPM - Evolution Versions et notification navbar', 15),
(69, 'DOPM - Traduction en Anglais', 15),
(70, 'AuditTerrain - Lancement de l\'outil GembaWalk', 15),
(71, 'Suggestion - Lancement de l\'outil d\'idées d\'amélioration', 15),
(72, 'DOPM - Compression et conversion des photos/images (.webp)', 15),
(73, 'Top5 - Traduction application Anglais', 13),
(74, 'DOPM - Optimisation requêtes Dashboard/Top5/FicheSécurité', 13),
(75, 'DOPM - Amélioration de la sécurité JWT', 13),
(76, 'DOPM - Gestion des droits', 16),
(81, 'Assignation - Lancement de l\'outil de gestion des tâches', 17),
(82, 'Top5 - Ajout Indicateur mensuel avec commentaires', 17),
(83, 'Top5 - Possibilité de forcer à J-1 (Add Data)', 17),
(84, 'DOPM - Réorganisation BDD', 17),
(85, 'Suggestion - Amélioration du workflow de validation', 18),
(86, 'Audit Terrain - Ajout des photos lors d\'audits', 18),
(87, 'Assignation - Amélioration du visuel drag and drop', 18),
(88, 'DOPM - Possibilité de multi Dashboard', 19),
(95, 'AuditTerrain - Ajout de l\'interface Face to face', 20),
(96, 'AuditTerrain - Amélioration du visuel', 20),
(97, 'Assignation - Amélioration du visuel', 20),
(98, 'Audit Terrain - Amélioration périodicité', 20),
(99, 'Suggestion - Ajout compteur caractère description', 21),
(100, 'FicheSécurité - Ajout compteur caractère description', 21),
(105, 'AuditTerrain - Création interface d\'Analyse', 22),
(106, 'DOPM - Connexion SSO', 22),
(107, 'DOPM - Ajout Titre DOPM + Logo .ico onglet', 22),
(112, 'Top5 - Création indicateur hebdomadaire', 23),
(113, 'Top5 - Automatisation Historique', 23),
(114, 'Assignation - Ajout Zoom + / - semaine mois', 23),
(115, 'Assignation - Barre de recherche', 23),
(119, 'Suggestion - Amélioration des filtres', 24),
(120, 'DOPM - Correction bug photo de profil', 24),
(121, 'Assignation - Affichage Responsable agrandit (Container fluid)', 24),
(122, 'FicheSécurité - Consultation 30 lignes par défaut vs 100', 24),
(123, 'Top5 - Indicateur Hebdomadaire paramétrable de 5S à 24S', 24);
