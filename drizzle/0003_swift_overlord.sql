DROP TABLE `work_sample`;--> statement-breakpoint
ALTER TABLE `inquiry` ADD `rate_link_id` int;--> statement-breakpoint
ALTER TABLE `site_settings` ADD `youtube_channel_id` varchar(40);--> statement-breakpoint
-- Joel's channel, from joeltalargie.com, so the Videos page fills on first view.
UPDATE `site_settings` SET `youtube_channel_id` = 'UCiRJdIGIpoQjD8Zh7cVU9NQ' WHERE `youtube_channel_id` IS NULL;
