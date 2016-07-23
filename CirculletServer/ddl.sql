CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facebook_id` varchar(20) CHARACTER SET latin1 DEFAULT NULL,
  `user_name` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `first_date` datetime DEFAULT NULL,
  `last_launch_date` datetime DEFAULT NULL,
  `last_game_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `game_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `playtime` int(11) DEFAULT NULL,
  `game_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `GAMELOG_USER` (`user_id`),
  CONSTRAINT `GAMELOG_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

