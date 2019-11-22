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
        ("2029-01-22T16:28:32.615Z", 321, 13, 3, 1 ),
        ("2029-01-22T16:28:32.615Z", 421, 21, 8, 2 ),
        ("2029-01-22T16:28:32.615Z", 221, 5, 1, 3 ),
        ("2029-01-22T16:28:32.615Z", 460, 28, 15, 4 ),
        ("2029-01-22T16:28:32.615Z", 398, 18, 12, 5 );

    COMMIT;