BEGIN;

    TRUNCATE
partnerben_users,
partnerben_paystubs
RESTART IDENTITY CASCADE;

    INSERT INTO partnerben_users
        (user_email, password, first_name, last_name, state_location)
    VALUES
        ('test1@gmail.com', '$2a$12$vT1iCaFL4xY0KE7Y3An4suINbpTXfs8aA5npy6xCMF5yflGohqWK.', 'Dunder', 'Mifflin', 'Alabama' ),
        ('test2@gmail.com', '$2a$12$vT1iCaFL4xY0KE7Y3An4suINbpTXfs8aA5npy6xCMF5yflGohqWK.', 'John', 'Smith', 'California' ),
        ('test3@gmail.com', '$2a$12$vT1iCaFL4xY0KE7Y3An4suINbpTXfs8aA5npy6xCMF5yflGohqWK.', 'Michael', 'Scott', 'New Jersey' ),
        ('test4@gmail.com', '$2a$12$vT1iCaFL4xY0KE7Y3An4suINbpTXfs8aA5npy6xCMF5yflGohqWK.', 'Ping', 'Pong', 'Ohio' ),
        ('test5@gmail.com', '$2a$12$vT1iCaFL4xY0KE7Y3An4suINbpTXfs8aA5npy6xCMF5yflGohqWK.', 'Miss', 'Piggy', 'Nebraska' );


    INSERT INTO partnerben_paystubs
        (paystub_date, ben_hours, vacation_hours, sick_hours, user_id)
    VALUES
        (11/15/2019, 321.25, 13.10, 3.5, 1 ),
        (11/15/2019, 421.25, 21.45, 8.65, 2 ),
        (11/15/2019, 221.25, 5.50, 1.75, 3 ),
        (11/15/2019, 460.85, 28.75, 15.25, 4 ),
        (11/15/2019, 398.75, 18.25, 12.45, 5 );

    COMMIT;