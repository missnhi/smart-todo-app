-- TODO: Change the user passwords to hashed passwords once bcrypt is installed
INSERT INTO users (username, email, password)
VALUES
('test', 'test@tester.com', 'password'),
('janedoe', 'jane@doe.com', 'password');
