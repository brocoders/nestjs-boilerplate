-- Grant necessary permissions to the database user
ALTER SCHEMA public OWNER TO root;
GRANT ALL ON SCHEMA public TO root;
GRANT ALL ON DATABASE api TO root;
