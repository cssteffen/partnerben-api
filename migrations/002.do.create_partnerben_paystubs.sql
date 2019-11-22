CREATE TABLE partnerben_paystubs
(
    id SERIAL PRIMARY KEY,
    paystub_date TEXT NOT NULL,
    ben_hours DECIMAL(12,2) NOT NULL,
    vacation_hours DECIMAL(12,2) NOT NULL,
    sick_hours DECIMAL(12,2) NOT NULL,
    user_id INTEGER REFERENCES partnerben_users(id) ON DELETE CASCADE NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
)