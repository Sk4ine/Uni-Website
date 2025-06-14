ALTER TABLE refresh_tokens DROP COLUMN hashed_token;
ALTER TABLE refresh_tokens RENAME COLUMN jti to hashed_jti;