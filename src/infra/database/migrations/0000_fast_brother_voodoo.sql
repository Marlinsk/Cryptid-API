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
	"timeline_summary" text,
	"containment_notes" text,
	"classification_id" integer NOT NULL,
	"realm_id" integer NOT NULL,
	"habitat_id" integer NOT NULL,
	"status" varchar(100) NOT NULL,
	"threat_level" varchar(100) NOT NULL,
	"first_reported_at" timestamp,
	"last_reported_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "realms" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habitats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"is_physical" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"cryptid_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt_text" text NOT NULL,
	"source" text NOT NULL,
	"license" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cryptids" ADD CONSTRAINT "cryptids_classification_id_classifications_id_fk" FOREIGN KEY ("classification_id") REFERENCES "public"."classifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cryptids" ADD CONSTRAINT "cryptids_realm_id_realms_id_fk" FOREIGN KEY ("realm_id") REFERENCES "public"."realms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cryptids" ADD CONSTRAINT "cryptids_habitat_id_habitats_id_fk" FOREIGN KEY ("habitat_id") REFERENCES "public"."habitats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_cryptid_id_cryptids_id_fk" FOREIGN KEY ("cryptid_id") REFERENCES "public"."cryptids"("id") ON DELETE cascade ON UPDATE no action;