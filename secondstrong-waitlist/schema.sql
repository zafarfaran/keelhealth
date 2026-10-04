-- Second Strong waiting list. Applied to the Neon `production` and `staging` branches.
-- The site's receiver logs in as `waitlist_insert`, which may only call waitlist_join(): it cannot
-- read the list or insert around the caps.

CREATE TABLE IF NOT EXISTS waitlist (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text NOT NULL CHECK (char_length(email) <= 254 AND email = lower(email) AND email LIKE '%_@_%._%'),
  stage       text CHECK (stage IN ('peri', 'meno', 'post', 'unsure')),
  source      text NOT NULL DEFAULT 'website' CHECK (char_length(source) <= 40),
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at);

-- Global caps hold however many IPs a flood comes from, and survive receiver restarts.
CREATE OR REPLACE FUNCTION waitlist_join(p_email text, p_stage text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (SELECT count(*) FROM waitlist WHERE created_at > now() - interval '1 minute') >= 60
     OR (SELECT count(*) FROM waitlist WHERE created_at > now() - interval '1 day') >= 3000 THEN
    RETURN 'busy';
  END IF;
  INSERT INTO waitlist (email, stage, source) VALUES (p_email, p_stage, 'website') ON CONFLICT DO NOTHING;
  RETURN 'ok';
END $$;

REVOKE ALL ON FUNCTION waitlist_join(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION waitlist_join(text, text) TO waitlist_insert;
REVOKE INSERT ON waitlist FROM waitlist_insert;
