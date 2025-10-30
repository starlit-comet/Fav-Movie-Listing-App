# query to create users table
CREATE TABLE `sql12805277`.`Users` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(20) NOT NULL , `email` VARCHAR(20) NOT NULL , `passwordHash` VARCHAR(100) NOT NULL , PRIMARY KEY (`id`), UNIQUE `email` (`email`)) ENGINE = InnoDB;

# query to create favorites table
CREATE TABLE `sql12805277`.`Favorites` ( `id` INT NOT NULL AUTO_INCREMENT , `userId` INT NOT NULL , `title` VARCHAR(255) NOT NULL , `type` VARCHAR(10) NOT NULL , `director` VARCHAR(255) NULL , `budget` DECIMAL(15,2) NULL , `location` VARCHAR(255) NULL , `durationMinutes` INT NULL , `year` INT NULL , `description` TEXT NULL , `rating` FLOAT NULL , PRIMARY KEY (`id`), INDEX `userId` (`userId`)) ENGINE = InnoDB;