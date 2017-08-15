use wwasave;
CREATE TABLE `wwasave`.`savedata` ( 
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(128) NOT NULL,
	`hp` INT NOT NULL,
	`at` INT NOT NULL,
	`df` INT NOT NULL,
	`money` INT NOT NULL,
	`player_x` INT NOT NULL,
	`player_y` INT NOT NULL,
	`long_password` TEXT NOT NULL,
	`save_time` DATETIME NOT NULL,
	`comment` TEXT NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;
