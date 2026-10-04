CREATE TABLE `editor_upload` (
	`id` int AUTO_INCREMENT NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`created_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `editor_upload_id` PRIMARY KEY(`id`),
	CONSTRAINT `editor_upload_file_name_unique` UNIQUE(`file_name`)
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`slug_live` varchar(160) GENERATED ALWAYS AS (if(`deleted_at` is null, `slug`, null)) VIRTUAL,
	`title` varchar(200) NOT NULL,
	`excerpt` varchar(500),
	`body` mediumtext NOT NULL,
	`reading_minutes` int NOT NULL DEFAULT 1,
	`cover` varchar(255),
	`tags` longtext,
	`locale` enum('en','am') NOT NULL DEFAULT 'en',
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`published_at` datetime,
	`is_featured` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`updated_by` varchar(255),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `post_id` PRIMARY KEY(`id`),
	CONSTRAINT `post_slug_live_unique` UNIQUE(`slug_live`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`slug_live` varchar(120) GENERATED ALWAYS AS (if(`deleted_at` is null, `slug`, null)) VIRTUAL,
	`title` varchar(160) NOT NULL,
	`title_am` varchar(160),
	`client` varchar(120),
	`category` varchar(60),
	`category_am` varchar(60),
	`summary` varchar(300) NOT NULL,
	`summary_am` varchar(300),
	`body` mediumtext,
	`body_am` mediumtext,
	`result` varchar(60),
	`result_am` varchar(60),
	`youtube_url` varchar(255),
	`external_url` varchar(255),
	`cover` varchar(255),
	`completed_on` date,
	`is_featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`updated_by` varchar(255),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `project_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_slug_live_unique` UNIQUE(`slug_live`)
);
--> statement-breakpoint
CREATE TABLE `project_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`caption` varchar(200),
	`caption_am` varchar(200),
	`sort_order` int NOT NULL DEFAULT 0,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `project_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rate_link` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(120) NOT NULL,
	`token` varchar(64) NOT NULL,
	`expires_on` date NOT NULL,
	`views` int unsigned NOT NULL DEFAULT 0,
	`last_viewed_at` datetime,
	`created_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `rate_link_id` PRIMARY KEY(`id`),
	CONSTRAINT `rate_link_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(80) NOT NULL,
	`title_am` varchar(80),
	`description` text NOT NULL,
	`description_am` text,
	`icon` enum('clapperboard','megaphone','compass','code','graduation-cap','mic','sparkles') NOT NULL DEFAULT 'sparkles',
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `youtube_video` (
	`video_id` varchar(16) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`published_at` datetime NOT NULL,
	`views` int unsigned,
	`is_short` boolean NOT NULL DEFAULT false,
	`status` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`synced_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `youtube_video_video_id` PRIMARY KEY(`video_id`)
);
--> statement-breakpoint
ALTER TABLE `editor_upload` ADD CONSTRAINT `editor_upload_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `post` ADD CONSTRAINT `post_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project` ADD CONSTRAINT `project_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project` ADD CONSTRAINT `project_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_image` ADD CONSTRAINT `project_image_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_image` ADD CONSTRAINT `project_image_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rate_link` ADD CONSTRAINT `rate_link_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rate_link` ADD CONSTRAINT `rate_link_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service` ADD CONSTRAINT `service_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `post_published_idx` ON `post` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `project_order_idx` ON `project` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `project_image_order_idx` ON `project_image` (`project_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `rate_link_expires_idx` ON `rate_link` (`expires_on`);--> statement-breakpoint
CREATE INDEX `service_order_idx` ON `service` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `youtube_video_published_idx` ON `youtube_video` (`status`,`published_at`);