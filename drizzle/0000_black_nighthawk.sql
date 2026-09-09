CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`arrival` text NOT NULL,
	`departure` text NOT NULL,
	`guests` integer NOT NULL,
	`note` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nights` (
	`day` text PRIMARY KEY NOT NULL,
	`booking_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_nights_booking` ON `nights` (`booking_id`);