--
-- Base de données : `dopm`
--

-- --------------------------------------------------------
-- POUR LES VERSIONS

--
-- Dumping data for table `versionning`
--


INSERT INTO `versionning` (`id`, `name`, `date`) VALUES
(26, 'v3.4.0', '2022-02-01 8:00:00.182');


--
-- Dumping data for table `feature`
--

INSERT INTO `feature` (`id`, `name`, `version_id`) VALUES
(128, 'FI - Lancement de l\'outil fiche infirmerie', 26),
(129, 'DOPM - Ajout mot de passe oublié', 26),
(130, 'DOPM - Gestion droits Dashboard', 26),
(131, 'DOPM - Gestion droits Audit Terrain', 26),
(132, 'Top5 - Debug suppression courbe + données', 26);