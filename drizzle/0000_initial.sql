CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bank_account` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`name_am` varchar(120),
	`account_number` varchar(40) NOT NULL,
	`tone` enum('blue','orange','green','purple') NOT NULL DEFAULT 'blue',
	`icon` enum('landmark','wallet') NOT NULL DEFAULT 'landmark',
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `bank_account_id` PRIMARY KEY(`id`),
	CONSTRAINT `bank_account_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `brand` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`logo` varchar(255) NOT NULL,
	`website` varchar(255),
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `brand_id` PRIMARY KEY(`id`),
	CONSTRAINT `brand_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `hero_highlight` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(60) NOT NULL,
	`name_am` varchar(60),
	`icon` enum('zap','target','users','panels-top-left','sparkles','rocket') NOT NULL DEFAULT 'zap',
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `hero_highlight_id` PRIMARY KEY(`id`),
	CONSTRAINT `hero_highlight_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(60) NOT NULL,
	`first_name_am` varchar(60),
	`last_name` varchar(60) NOT NULL,
	`last_name_am` varchar(60),
	`initials` varchar(4) NOT NULL,
	`portrait` varchar(255),
	`hero_badge` varchar(120) NOT NULL,
	`hero_badge_am` varchar(120),
	`hero_description` text NOT NULL,
	`hero_description_am` text,
	`reach_value` varchar(20) NOT NULL,
	`reach_label` varchar(60) NOT NULL,
	`reach_label_am` varchar(60),
	`audience_value` varchar(20) NOT NULL,
	`audience_label` varchar(60) NOT NULL,
	`audience_label_am` varchar(60),
	`total_followers` varchar(20) NOT NULL,
	`about_text` text NOT NULL,
	`about_text_am` text,
	`motto` varchar(80) NOT NULL,
	`motto_am` varchar(80),
	`about_tagline` varchar(160),
	`about_tagline_am` varchar(160),
	`phone` varchar(20) NOT NULL,
	`phone_intl` varchar(20) NOT NULL,
	`email` varchar(120) NOT NULL,
	`website` varchar(255),
	`location` varchar(120),
	`location_am` varchar(120),
	`footer_blurb` text,
	`footer_blurb_am` text,
	`founder_of` varchar(120),
	`founder_url` varchar(255),
	`custom_tags` longtext NOT NULL,
	`custom_tags_am` longtext,
	`account_holder` varchar(120) NOT NULL,
	`payment_note` text,
	`payment_note_am` text,
	`meta_title` varchar(160) NOT NULL,
	`meta_title_am` varchar(160),
	`meta_description` varchar(320) NOT NULL,
	`meta_description_am` varchar(320),
	`updated_by` varchar(255),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_account` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` enum('tiktok','youtube','instagram','twitter','telegram','github','facebook','linkedin') NOT NULL,
	`name` varchar(60) NOT NULL,
	`url` varchar(255),
	`followers` int unsigned,
	`secondary_stat` varchar(60),
	`secondary_stat_am` varchar(60),
	`show_in_stats` boolean NOT NULL DEFAULT false,
	`show_in_footer` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`footer_sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `social_account_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_account_platform_unique` UNIQUE(`platform`)
);
--> statement-breakpoint
CREATE TABLE `sponsorship_package` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(80) NOT NULL,
	`name_am` varchar(80),
	`price` int unsigned NOT NULL,
	`icon` enum('zap','rocket','shield-check','sparkles','target') NOT NULL DEFAULT 'zap',
	`tone` enum('primary','accent','pink') NOT NULL DEFAULT 'primary',
	`is_featured` boolean NOT NULL DEFAULT false,
	`badge` varchar(40),
	`badge_am` varchar(40),
	`features` longtext NOT NULL,
	`features_am` longtext,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `sponsorship_package_id` PRIMARY KEY(`id`),
	CONSTRAINT `sponsorship_package_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bank_account` ADD CONSTRAINT `bank_account_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `brand` ADD CONSTRAINT `brand_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hero_highlight` ADD CONSTRAINT `hero_highlight_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_settings` ADD CONSTRAINT `site_settings_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `social_account` ADD CONSTRAINT `social_account_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sponsorship_package` ADD CONSTRAINT `sponsorship_package_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sponsorship_package` ADD CONSTRAINT `sponsorship_package_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sponsorship_package` ADD CONSTRAINT `sponsorship_package_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE INDEX `bank_account_order_idx` ON `bank_account` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `brand_order_idx` ON `brand` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `hero_highlight_order_idx` ON `hero_highlight` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `social_account_order_idx` ON `social_account` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `sponsorship_package_order_idx` ON `sponsorship_package` (`is_active`,`sort_order`);