import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_nav\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_nav_order_idx\` ON \`site_settings_nav\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_nav_parent_id_idx\` ON \`site_settings_nav\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_assistant_suggestions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_assistant_suggestions_order_idx\` ON \`site_settings_assistant_suggestions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_assistant_suggestions_parent_id_idx\` ON \`site_settings_assistant_suggestions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand\` text DEFAULT 'Titan',
  	\`logo_id\` integer,
  	\`header_cta_label\` text,
  	\`header_cta_url\` text,
  	\`footer_text\` text,
  	\`phone\` text,
  	\`show_demo_bar\` integer DEFAULT true,
  	\`demo_bar_text\` text,
  	\`assistant_button\` text DEFAULT 'Ask about shutters',
  	\`assistant_intro\` text,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_nav\`;`)
  await db.run(sql`DROP TABLE \`site_settings_assistant_suggestions\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
}
