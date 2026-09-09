PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_nights` (
	`suite` text DEFAULT 'portside' NOT NULL,
	`day` text NOT NULL,
	`booking_id` text NOT NULL,
	PRIMARY KEY(`suite`, `day`)
);
--> statement-breakpoint
INSERT INTO `__new_nights`("suite", "day", "booking_id") SELECT 'portside', "day", "booking_id" FROM `nights`;--> statement-breakpoint
DROP TABLE `nights`;--> statement-breakpoint
ALTER TABLE `__new_nights` RENAME TO `nights`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_nights_booking` ON `nights` (`booking_id`);--> statement-breakpoint
ALTER TABLE `bookings` ADD `suite` text DEFAULT 'portside' NOT NULL;