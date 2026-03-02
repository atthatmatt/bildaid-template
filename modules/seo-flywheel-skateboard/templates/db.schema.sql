-- Minimal schema for SEO Flywheel Skateboard

CREATE TABLE IF NOT EXISTS pages (
  url TEXT PRIMARY KEY,
  last_seen_at TEXT,
  last_published_at TEXT,
  content_hash TEXT,
  cooldown_until TEXT
);

CREATE TABLE IF NOT EXISTS gsc (
  page TEXT,
  query TEXT,
  impressions INTEGER,
  clicks INTEGER,
  position REAL,
  date_range TEXT,
  PRIMARY KEY(page, query, date_range)
);

CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  type TEXT,
  page_url TEXT,
  status TEXT,
  payload_json TEXT,
  result_json TEXT
);

CREATE TABLE IF NOT EXISTS baselines (
  page_url TEXT PRIMARY KEY,
  baseline_clicks INTEGER,
  baseline_impressions INTEGER,
  baseline_position REAL,
  recorded_at TEXT
);
