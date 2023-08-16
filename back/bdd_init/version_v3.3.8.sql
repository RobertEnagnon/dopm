--
-- Base de données : `dopm`
--

-- --------------------------------------------------------
-- POUR LES VERSIONS

--
-- Dumping data for table `versionning`
--


INSERT INTO `versionning` (`id`, `name`, `date`) VALUES
(25, 'v3.3.8', '2022-01-15 16:00:17.182');


--
-- Dumping data for table `feature`
--

INSERT INTO `feature` (`id`, `name`, `version_id`) VALUES
(124, 'AS - Ajout Conversation dans les tâches', 25),
(125, 'FS - Suppr. Contrainte deadline antérieure', 25),
(126, 'SUG - Ajout bouton impression', 25);
(127, 'Dashboard - Amélioration design sidebar', 25);