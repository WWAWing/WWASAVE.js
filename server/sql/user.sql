use wwasave;
CREATE TABLE `wwasave`.`user` ( 
	`id` VARCHAR(128) NOT NULL,
	`password` VARCHAR(128) NOT NULL , 
	`login_count` INT NOT NULL , 
	`last_login` DATETIME NOT NULL , 
	`token` VARCHAR(512) NOT NULL , 
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;
