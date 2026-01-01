CREATE TABLE "classifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cryptids" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text NOT NULL,
	"short_description" text NOT NULL,
	"origin_summary" text NOT NULL,
	"physical_description" text,
	"behavior_notes" text,
	"manifestation_conditions" text,
	"classification_id" integer NOT NULL,
	"status" varchar(100) NOT NULL,
	"threat_level" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"cryptid_id" integer NOT NULL,
	"url" text NOT NULL,
	"image_size" text DEFAULT '2:3' NOT NULL,
	"alt_text" text NOT NULL,
	"source" text NOT NULL,
	"license" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cryptids" ADD CONSTRAINT "cryptids_classification_id_classifications_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_cryptid_id_cryptids_id_fk" FOREIGN KEY ("cryptid_id") REFERENCES "public"."cryptids"("id") ON DELETE cascade ON UPDATE no action;