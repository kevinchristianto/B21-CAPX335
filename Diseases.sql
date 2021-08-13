-- --------------------------------------------------------
-- Host:                         sql6.freemysqlhosting.net
-- Server version:               5.5.62-0ubuntu0.14.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             10.3.0.5771
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table sql6419249.chemical_control
CREATE TABLE IF NOT EXISTS `chemical_control` (
  `chemical_id` int(11) NOT NULL AUTO_INCREMENT,
  `disease_id` int(2) NOT NULL,
  `chemical_name` varchar(255) NOT NULL,
  `chemical_type` varchar(24) DEFAULT NULL,
  PRIMARY KEY (`chemical_id`),
  KEY `cures_fk0` (`disease_id`),
  CONSTRAINT `cures_fk0` FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table sql6419249.chemical_control: ~5 rows (approximately)
DELETE FROM `chemical_control`;
/*!40000 ALTER TABLE `chemical_control` DISABLE KEYS */;
INSERT INTO `chemical_control` (`chemical_id`, `disease_id`, `chemical_name`, `chemical_type`) VALUES
	(1, 1, 'Tricyclazole 75.0% WP', 'Fungicide'),
	(2, 1, 'Azoxystrobin 18.2% SC, Difenoconazole 11.4% SC', 'Fungicide'),
	(3, 1, 'Carbendazim 12.0% WP, Mancozeb 63.0% WP', 'Fungicide'),
	(4, 2, 'Streptomycin Sulfate 90.0% SP, Tetracycline Hydrochloride 10.0% SP', 'Bactericide'),
	(5, 2, 'Copper Hydroxide 53.8% DF', 'Fungicide');
/*!40000 ALTER TABLE `chemical_control` ENABLE KEYS */;

-- Dumping structure for table sql6419249.diseases
CREATE TABLE IF NOT EXISTS `diseases` (
  `disease_id` int(2) NOT NULL AUTO_INCREMENT,
  `disease_name` varchar(82) NOT NULL,
  `type` varchar(24) DEFAULT NULL,
  `latin` varchar(80) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table sql6419249.diseases: ~3 rows (approximately)
DELETE FROM `diseases`;
/*!40000 ALTER TABLE `diseases` DISABLE KEYS */;
INSERT INTO `diseases` (`disease_id`, `disease_name`, `type`, `latin`, `description`) VALUES
	(1, 'Blast', 'Fungus', 'Magnaporthe oryzae', 'Blast is caused by the fungus Magnaporthe oryzae. It can affect all above ground parts of a rice plant: leaf, collar, node, neck, parts of panicle, and sometimes leaf sheath. Blast can occur wherever blast spores are present. It occurs in areas with low soil moisture, frequent and prolonged periods of rain shower, and cool temperature in the daytime. In upland rice, large day-night temperature differences that cause dew formation on leaves and overall cooler temperatures favor the development of the disease. Rice can have blast in all growth stages. However, leaf blast incidence tends to lessen as plants mature and develop adult plant resistance to the disease.'),
	(2, 'Bacterial Blight', 'Bacteria', 'Xanthomonas oryzae pv. oryzae', 'Bacterial blight is caused by Xanthomonas oryzae pv. oryzae. It causes wilting of seedlings and yellowing and drying of leaves. The disease is most likely to develop in areas that have weeds and stubbles of infected plants. It can occur in both tropical and temperate environments, particularly in irrigated and rainfed lowland areas. In general, the disease favors temperatures at 25?34°C, with relative humidity above 70%. It is commonly observed when strong winds and continuous heavy rains occur, allowing the disease-causing bacteria to easily spread through ooze droplets on lesions of infected plants. Bacterial blight can be severe in susceptible rice varieties under high nitrogen fertilization.'),
	(3, 'Tungro', 'Virus', 'RTBV/RTSV', 'Rice tungro disease is caused by the combination of two viruses, which are transmitted by leafhoppers. It causes leaf discoloration, stunted growth, reduced tiller numbers and sterile or partly filled grains. Tungro infects cultivated rice, some wild rice relatives and other grassy weeds commonly found in rice paddies. Tungro disease viruses are transmitted from one plant to another by leafhoppers that feed on tungro-infected plants. The most efficient vector is the green leafhopper. Leafhoppers can acquire the viruses from any part of the infected plant by feeding on it, even for a short time. It can, then, immediately transmit the viruses to other plants within 5?7 days. The viruses do not remain in the leafhopper\'s body unless it feeds again on an infected plant and re-acquires the viruses. Tungro infection can occur during all growth stages of the rice plant. It is most frequently seen during the vegetative phase. Plants are most vulnerable at tillering stage.');
/*!40000 ALTER TABLE `diseases` ENABLE KEYS */;

-- Dumping structure for table sql6419249.symptoms
CREATE TABLE IF NOT EXISTS `symptoms` (
  `symptom_id` int(11) NOT NULL AUTO_INCREMENT,
  `disease_id` int(2) NOT NULL,
  `symptom_description` text NOT NULL,
  PRIMARY KEY (`symptom_id`),
  KEY `symptomps_fk0` (`disease_id`),
  CONSTRAINT `symptomps_fk0` FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

-- Dumping data for table sql6419249.symptoms: ~14 rows (approximately)
DELETE FROM `symptoms`;
/*!40000 ALTER TABLE `symptoms` DISABLE KEYS */;
INSERT INTO `symptoms` (`symptom_id`, `disease_id`, `symptom_description`) VALUES
	(1, 1, 'Initial symptoms appear as white to gray-green lesions or spots, with dark green borders.'),
	(2, 1, 'Older lesions on the leaves are elliptical or spindle-shaped and whitish to gray centers with red to brownish or necrotic border.'),
	(3, 1, 'Some resemble diamond shape, wide in the center and pointed toward either ends.'),
	(4, 1, 'Lesions can enlarge and coalesce, growing together, to kill the entire leaves.'),
	(5, 2, 'Check for wilting and yellowing of leaves, or wilting of seedlings (also called kresek).'),
	(6, 2, 'On seedlings, infected leaves turn grayish green and roll up. As the disease progresses, the leaves turn yellow to straw-colored and wilt, leading whole seedlings to dry up and die.'),
	(7, 2, 'On older plants, lesions usually develop as water-soaked to yellow-orange stripes on leaf blades or leaf tips or on mechanically injured parts of leaves. Lesions have a wavy margin and progress toward the leaf base.'),
	(8, 2, 'On young lesions, bacterial ooze resembling a milky dew drop can be observed early in the morning. The bacterial ooze later on dries up and becomes small yellowish beads underneath the leaf.'),
	(9, 2, 'Old lesions turn yellow to grayish white with black dots due to the growth of various saprophytic fungi. On severely infected leaves, lesions may extend to the leaf sheath.'),
	(10, 3, 'Check for presence of leafhoppers.'),
	(11, 3, 'Check leaves for discoloration.'),
	(12, 3, 'Yellow or orange-yellow discoloration is noticeable in tungro-infected plants. Discoloration begins from the leaf tip and extends down to the blade or the lower leaf portion. Infected leaves may also show mottled or striped appearance, rust-colored spots, and inter-veinal necrosis.'),
	(13, 3, 'Tungro-infected plants also show symptoms of stunting, delayed flowering which may delay maturity, reduced number of tillers, small and not completely exserted panicles, as well as a higher than normal percentage of sterile panicles or partially filled grains, covered with dark brown blotches.'),
	(14, 3, 'The degree of stunting and of leaf discoloration varies with rice varieties, strains of the viruses, the age of the plant when infected, and with the environment. In varieties that carry some resistance to the disease, infected plants exhibit no discoloration or only a mild discoloration that may disappear as the plants mature.');
/*!40000 ALTER TABLE `symptoms` ENABLE KEYS */;

-- Dumping structure for table sql6419249.treatments
CREATE TABLE IF NOT EXISTS `treatments` (
  `treatment_id` int(11) NOT NULL AUTO_INCREMENT,
  `disease_id` int(2) NOT NULL,
  `treatment_description` varchar(255) NOT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `treatments_fk0` (`disease_id`),
  CONSTRAINT `treatments_fk0` FOREIGN KEY (`disease_id`) REFERENCES `diseases` (`disease_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- Dumping data for table sql6419249.treatments: ~13 rows (approximately)
DELETE FROM `treatments`;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
INSERT INTO `treatments` (`treatment_id`, `disease_id`, `treatment_description`) VALUES
	(1, 1, 'The primary control option for blast is to plant resistant varieties.'),
	(2, 1, 'Adjust planting time. Sow seeds early, when possible, after the onset of the rainy season.'),
	(3, 1, 'Split nitrogen fertilizer application in two or more treatments. Excessive use of fertilizer can increase blast intensity.'),
	(4, 1, 'Flood the field as often as possible.'),
	(5, 2, 'Planting resistant varieties has been proven to be the most efficient, most reliable, and cheapest way to control bacterial blight.'),
	(6, 2, 'Use balanced amounts of plant nutrients, especially nitrogen.'),
	(7, 2, 'Ensure good drainage of fields (in conventionally flooded crops) and nurseries.'),
	(8, 2, 'Keep fields clean. Remove weed hosts and plow under rice stubble, straw, rice ratoons and volunteer seedlings, which can serve as hosts of bacteria.'),
	(9, 2, 'Allow fallow fields to dry in order to suppress disease agents in the soil and plant residues.'),
	(10, 3, 'Grow tungro or leafhopper resistant varieties.'),
	(11, 3, 'Practice synchronous planting with surrounding farms.'),
	(12, 3, 'Adjust planting times to when green leafhopper are not in season or abundant, if known.'),
	(13, 3, 'Plow infected stubbles immediately after harvest to reduce inoculum sources and destroy the eggs and breeding sites of green leaf hopper.');
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
