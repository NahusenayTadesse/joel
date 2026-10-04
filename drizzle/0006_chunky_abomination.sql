CREATE TABLE `youtube_video` (
	`id` int AUTO_INCREMENT NOT NULL,
	`video_id` varchar(16) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`published_at` datetime NOT NULL,
	`views` int unsigned,
	`is_short` boolean NOT NULL DEFAULT false,
	`status` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`synced_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `youtube_video_id` PRIMARY KEY(`id`),
	CONSTRAINT `youtube_video_video_id_unique` UNIQUE(`video_id`)
);
--> statement-breakpoint
CREATE INDEX `youtube_video_published_idx` ON `youtube_video` (`status`,`published_at`);