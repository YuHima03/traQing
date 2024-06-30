ALTER TABLE "message_stamps" ALTER COLUMN "message_user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "message_stamps" ALTER COLUMN "channel_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "message_stamps_message_user_id_idx" ON "message_stamps" USING btree ("message_user_id");

-- Materialized view for messages ranking
DROP MATERIALIZED VIEW IF EXISTS messages_ranking;
CREATE MATERIALIZED VIEW messages_ranking AS
SELECT
  user_id,
  COUNT(*) AS count
FROM
  messages
GROUP BY
  user_id
ORDER BY
  count DESC;

-- Materialized view for gave message stamps ranking
DROP MATERIALIZED VIEW IF EXISTS gave_message_stamps_ranking;
CREATE MATERIALIZED VIEW gave_message_stamps_ranking AS
SELECT
  user_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  user_id
ORDER BY
  count DESC;

-- Materialized view for received message stamps ranking
DROP MATERIALIZED VIEW IF EXISTS received_message_stamps_ranking;
CREATE MATERIALIZED VIEW received_message_stamps_ranking AS
SELECT
  message_user_id,
  COUNT(*) AS count
FROM
  message_stamps
GROUP BY
  message_user_id
ORDER BY
  count DESC;

-- functions

CREATE
OR REPLACE FUNCTION formatMonth (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'YYYY-MM')
$$;

CREATE INDEX IF NOT EXISTS idx_month_on_messages_created_at ON messages (formatMonth (created_at));

CREATE INDEX IF NOT EXISTS idx_month_on_message_stamps_created_at ON message_stamps (formatMonth (created_at));

CREATE
OR REPLACE FUNCTION formatDate (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'YYYY-MM-DD')
$$;

CREATE INDEX IF NOT EXISTS idx_date_on_messages_created_at ON messages (formatDate (created_at));

CREATE INDEX IF NOT EXISTS idx_date_on_message_stamps_created_at ON message_stamps (formatDate (created_at));

CREATE
OR REPLACE FUNCTION formatHour (prm TIMESTAMP) RETURNS TEXT LANGUAGE SQL IMMUTABLE STRICT AS $$
  SELECT to_char($1, 'HH24')
$$;

CREATE INDEX IF NOT EXISTS idx_hour_on_messages_created_at ON messages (formatHour (created_at));

CREATE INDEX IF NOT EXISTS idx_hour_on_message_stamps_created_at ON message_stamps (formatHour (created_at));
