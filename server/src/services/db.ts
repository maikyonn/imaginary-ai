import { join } from 'path';

// ── DB Interface ────────────────────────────────────────────────

interface DB {
	saveStylePreview(styleId: string, imageData: Buffer, contentType?: string): Promise<void>;
	getStylePreview(styleId: string): Promise<{ imageData: Buffer; contentType: string } | null>;
	getStylePreviewIds(): Promise<string[]>;
}

// ── SQLite (local dev) ──────────────────────────────────────────

function createSqliteDB(): DB {
	const { Database } = require('bun:sqlite');

	const DB_PATH = join(import.meta.dir, '../../data/childrenbook.sqlite');
	const dataDir = join(import.meta.dir, '../../data');
	Bun.write(join(dataDir, '.gitkeep'), '');

	const db = new Database(DB_PATH, { create: true });
	db.exec('PRAGMA journal_mode = WAL');
	db.exec(`
		CREATE TABLE IF NOT EXISTS style_previews (
			style_id TEXT PRIMARY KEY,
			image_data BLOB NOT NULL,
			content_type TEXT NOT NULL DEFAULT 'image/png',
			created_at INTEGER NOT NULL DEFAULT (unixepoch())
		)
	`);

	return {
		async saveStylePreview(styleId, imageData, contentType = 'image/png') {
			db.run(
				`INSERT OR REPLACE INTO style_previews (style_id, image_data, content_type, created_at)
				 VALUES (?, ?, ?, unixepoch())`,
				[styleId, imageData, contentType],
			);
		},

		async getStylePreview(styleId) {
			const row = db.query(
				'SELECT image_data, content_type FROM style_previews WHERE style_id = ?',
			).get(styleId) as { image_data: Buffer; content_type: string } | null;
			if (!row) return null;
			return { imageData: row.image_data, contentType: row.content_type };
		},

		async getStylePreviewIds() {
			const rows = db.query('SELECT style_id FROM style_previews').all() as { style_id: string }[];
			return rows.map((r) => r.style_id);
		},
	};
}

// ── Postgres (Render) ───────────────────────────────────────────

async function createPostgresDB(): Promise<DB> {
	const pg = await import('pg');
	const pool = new pg.default.Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
	});

	await pool.query(`
		CREATE TABLE IF NOT EXISTS style_previews (
			style_id TEXT PRIMARY KEY,
			image_data BYTEA NOT NULL,
			content_type TEXT NOT NULL DEFAULT 'image/png',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`);

	return {
		async saveStylePreview(styleId, imageData, contentType = 'image/png') {
			await pool.query(
				`INSERT INTO style_previews (style_id, image_data, content_type, created_at)
				 VALUES ($1, $2, $3, NOW())
				 ON CONFLICT (style_id) DO UPDATE
				 SET image_data = EXCLUDED.image_data,
				     content_type = EXCLUDED.content_type,
				     created_at = NOW()`,
				[styleId, imageData, contentType],
			);
		},

		async getStylePreview(styleId) {
			const { rows } = await pool.query(
				'SELECT image_data, content_type FROM style_previews WHERE style_id = $1',
				[styleId],
			);
			if (rows.length === 0) return null;
			return { imageData: rows[0].image_data, contentType: rows[0].content_type };
		},

		async getStylePreviewIds() {
			const { rows } = await pool.query('SELECT style_id FROM style_previews');
			return rows.map((r: { style_id: string }) => r.style_id);
		},
	};
}

// ── Initialize ──────────────────────────────────────────────────

const db: DB = process.env.DATABASE_URL
	? await createPostgresDB()
	: createSqliteDB();

const isPostgres = !!process.env.DATABASE_URL;
console.log(`Database: ${isPostgres ? 'Postgres (Render)' : 'SQLite (local)'}`);

export const saveStylePreview = db.saveStylePreview;
export const getStylePreview = db.getStylePreview;
export const getStylePreviewIds = db.getStylePreviewIds;

export async function getStylePreviewBuffer(styleId: string): Promise<Buffer | null> {
	const preview = await db.getStylePreview(styleId);
	return preview ? preview.imageData : null;
}
