CREATE TABLE `audience_stat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(60) NOT NULL,
	`label_am` varchar(60),
	`value` int unsigned NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `audience_stat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inquiry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`company` varchar(120),
	`email` varchar(160),
	`phone` varchar(30),
	`package_name` varchar(80),
	`message` text NOT NULL,
	`locale` varchar(5) NOT NULL,
	`stage` enum('new','contacted','won','lost','spam') NOT NULL DEFAULT 'new',
	`note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_by` varchar(255),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `inquiry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonial` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote` text NOT NULL,
	`quote_am` text,
	`author` varchar(120) NOT NULL,
	`role` varchar(160),
	`role_am` varchar(160),
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `testimonial_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_sample` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(120) NOT NULL,
	`title_am` varchar(120),
	`brand_name` varchar(120) NOT NULL,
	`platform` enum('tiktok','youtube','instagram','twitter','telegram','github','facebook','linkedin') NOT NULL,
	`url` varchar(255) NOT NULL,
	`result` varchar(60),
	`result_am` varchar(60),
	`sort_order` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `work_sample_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `site_settings` ADD `telegram_username` varchar(60);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `whatsapp_number` varchar(20);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `media_kit` varchar(255);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `net_price_note` varchar(80);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `net_price_note_am` varchar(80);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `custom_price` varchar(60);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `custom_price_am` varchar(60);--> statement-breakpoint
ALTER TABLE `site_settings` ADD `package_notes` longtext;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `package_notes_am` longtext;--> statement-breakpoint
ALTER TABLE `audience_stat` ADD CONSTRAINT `audience_stat_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `testimonial` ADD CONSTRAINT `testimonial_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `work_sample` ADD CONSTRAINT `work_sample_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audience_stat_order_idx` ON `audience_stat` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `inquiry_stage_idx` ON `inquiry` (`stage`,`created_at`);--> statement-breakpoint
CREATE INDEX `testimonial_order_idx` ON `testimonial` (`status`,`sort_order`);--> statement-breakpoint
CREATE INDEX `work_sample_order_idx` ON `work_sample` (`status`,`sort_order`);--> statement-breakpoint
-- The price terms move here from the translation files: carry their wording over to the existing row.
UPDATE `site_settings` SET
	`net_price_note` = '(Net Price before Tax)',
	`net_price_note_am` = '(ከታክስ በፊት የተጣራ ዋጋ)',
	`custom_price` = 'Custom Pricing',
	`custom_price_am` = 'በስምምነት',
	`package_notes` = '["Custom package pricing is available upon request.","Packages are valid for one month. Listed payment is net before tax."]',
	`package_notes_am` = '["የልዩ ፓኬጅ ዋጋ በጥያቄ ይገለጻል።","ፓኬጆቹ ለአንድ ወር ያገለግላሉ። የተዘረዘረው ክፍያ ከታክስ በፊት የተጣራ ነው።"]'
WHERE `net_price_note` IS NULL;
