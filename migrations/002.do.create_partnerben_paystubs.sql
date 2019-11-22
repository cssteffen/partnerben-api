CREATE TABLE partnerben_paystubs
(
    id SERIAL PRIMARY KEY,
    paystub_date TEXT NOT NULL,
    ben_hours NUMERIC NOT NULL,
    vacation_hours NUMERIC NOT NULL,
    sick_hours NUMERIC NOT NULL,
    user_id INTEGER REFERENCES partnerben_users(id) ON DELETE CASCADE NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
)