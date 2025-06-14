ALTER TABLE refresh_tokens ADD COLUMN hashed_token TEXT NOT NULL;
ALTER TABLE refresh_tokens RENAME COLUMN hashed_jti to jti;