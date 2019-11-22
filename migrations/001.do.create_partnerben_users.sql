CREATE TABLE partnerben_users
(
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    state_location TEXT NOT NULL,
    hours_padded NUMERIC NOT NULL DEFAULT 5,
    date_created TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
)
