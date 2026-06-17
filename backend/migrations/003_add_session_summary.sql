-- Add a `summary` column to ai_sessions to store condensed history summaries
ALTER TABLE ai_sessions
ADD COLUMN IF NOT EXISTS summary TEXT;
