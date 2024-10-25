-- TODO: Change the user passwords to hashed passwords once bcrypt is installed
INSERT INTO users (username, email, password)
VALUES
('test', 'test@tester.com', '$2a$10$hgz0pHtw1uXAQiJp6sWUueKF/DNpbux7J3fZGUc7nWB96VBcIQ48u'),
('plysnh', 'plysnh@gmail.com', '$2a$10$hgz0pHtw1uXAQiJp6sWUueKF/DNpbux7J3fZGUc7nWB96VBcIQ48u');

