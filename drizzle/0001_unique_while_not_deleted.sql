ALTER TABLE `bank_account` DROP INDEX `bank_account_name_unique`;--> statement-breakpoint
ALTER TABLE `brand` DROP INDEX `brand_name_unique`;--> statement-breakpoint
ALTER TABLE `hero_highlight` DROP INDEX `hero_highlight_name_unique`;--> statement-breakpoint
ALTER TABLE `social_account` DROP INDEX `social_account_platform_unique`;--> statement-breakpoint
ALTER TABLE `sponsorship_package` DROP INDEX `sponsorship_package_name_unique`;--> statement-breakpoint
ALTER TABLE `bank_account` ADD `name_live` varchar(120) GENERATED ALWAYS AS (if(`deleted_at` is null, `name`, null)) VIRTUAL;--> statement-breakpoint
ALTER TABLE `brand` ADD `name_live` varchar(120) GENERATED ALWAYS AS (if(`deleted_at` is null, `name`, null)) VIRTUAL;--> statement-breakpoint
ALTER TABLE `hero_highlight` ADD `name_live` varchar(60) GENERATED ALWAYS AS (if(`deleted_at` is null, `name`, null)) VIRTUAL;--> statement-breakpoint
ALTER TABLE `social_account` ADD `platform_live` varchar(20) GENERATED ALWAYS AS (if(`deleted_at` is null, `platform`, null)) VIRTUAL;--> statement-breakpoint
ALTER TABLE `sponsorship_package` ADD `name_live` varchar(80) GENERATED ALWAYS AS (if(`deleted_at` is null, `name`, null)) VIRTUAL;--> statement-breakpoint
ALTER TABLE `bank_account` ADD CONSTRAINT `bank_account_name_live_unique` UNIQUE(`name_live`);--> statement-breakpoint
ALTER TABLE `brand` ADD CONSTRAINT `brand_name_live_unique` UNIQUE(`name_live`);--> statement-breakpoint
ALTER TABLE `hero_highlight` ADD CONSTRAINT `hero_highlight_name_live_unique` UNIQUE(`name_live`);--> statement-breakpoint
ALTER TABLE `social_account` ADD CONSTRAINT `social_account_platform_live_unique` UNIQUE(`platform_live`);--> statement-breakpoint
ALTER TABLE `sponsorship_package` ADD CONSTRAINT `sponsorship_package_name_live_unique` UNIQUE(`name_live`);