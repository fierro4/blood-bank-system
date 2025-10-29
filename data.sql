Content is user-generated and unverified.
1
DROP DATABASE IF EXISTS blood_bank_db;
CREATE DATABASE blood_bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blood_bank_db;


CREATE TABLE staff (
  Staff_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Role VARCHAR(50) NOT NULL,
  Email VARCHAR(150) UNIQUE NOT NULL,
  Password_Hash VARCHAR(255) NOT NULL,
  Contact VARCHAR(20),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donor (
  Donor_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  DOB DATE,
  Gender ENUM('M','F','O') DEFAULT 'O',
  Blood_Group VARCHAR(3) NOT NULL,
  Contact VARCHAR(20),
  Address TEXT,
  Last_Donation_Date DATE,
  Medical_History TEXT,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipient (
  Recipient_ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Age INT,
  Blood_Group VARCHAR(3) NOT NULL,
  Hospital VARCHAR(200),
  Contact VARCHAR(20),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blood_stock (
  Stock_ID INT AUTO_INCREMENT PRIMARY KEY,
  Blood_Group VARCHAR(3) NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity >= 0),
  Expiry_Date DATE NOT NULL,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (Blood_Group),
  INDEX (Expiry_Date)
);

CREATE TABLE donation_record (
  Donation_ID INT AUTO_INCREMENT PRIMARY KEY,
  Donor_ID INT NOT NULL,
  Stock_ID INT,
  Donation_Date DATE NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  Notes TEXT,
  FOREIGN KEY (Donor_ID) REFERENCES donor(Donor_ID) ON DELETE CASCADE,
  FOREIGN KEY (Stock_ID) REFERENCES blood_stock(Stock_ID) ON DELETE SET NULL
);

CREATE TABLE blood_issue (
  Issue_ID INT AUTO_INCREMENT PRIMARY KEY,
  Recipient_ID INT NOT NULL,
  Issue_Date DATE NOT NULL,
  Quantity INT NOT NULL CHECK (Quantity > 0),
  Notes TEXT,
  Created_By_Staff_ID INT,
  FOREIGN KEY (Recipient_ID) REFERENCES recipient(Recipient_ID) ON DELETE CASCADE,
  FOREIGN KEY (Created_By_Staff_ID) REFERENCES staff(Staff_ID) ON DELETE SET NULL
);

CREATE TABLE blood_compatibility (
  Recipient_Group VARCHAR(3),
  Donor_Group VARCHAR(3)
);

CREATE VIEW current_stock AS
SELECT Blood_Group, SUM(Quantity) AS Total_Units
FROM blood_stock
WHERE Expiry_Date >= CURDATE() AND Quantity > 0
GROUP BY Blood_Group;


INSERT INTO staff (Name, Role, Email, Password_Hash, Contact, Created_At) VALUES
('Alice Admin', 'Admin', 'alice@bb.org', '13dc8554575637802eec3c0117f41591a990e1a2d37160018c48c9125063838a', '+91-9000000001', '2025-09-10 21:03:26'),
('Ravi Manager', 'Manager', 'ravi@bb.org', '2fcd31f90b913d1428a4cc843f88453dab14da7695188a5b429aebf23c352544', '+91-9000000002', '2025-09-10 21:03:26'),
('Dr. Priya Nair', 'Doctor', 'priya@bb.org', 'abc123hashedpassword', '+91-9000000003', '2025-08-15 09:30:00'),
('Amit Technician', 'Lab Technician', 'amit@bb.org', 'def456hashedpassword', '+91-9000000004', '2025-08-20 10:00:00'),
('Neha Coordinator', 'Blood Coordinator', 'neha@bb.org', 'ghi789hashedpassword', '+91-9000000005', '2025-09-01 11:00:00'),
('Vijay Assistant', 'Assistant', 'vijay@bb.org', 'jkl012hashedpassword', '+91-9000000006', '2025-09-05 14:00:00');

INSERT INTO donor (Name, DOB, Gender, Blood_Group, Contact, Address, Last_Donation_Date, Medical_History, Created_At) VALUES
('Ms. Sunita Sharma', '1990-05-12', 'F', 'A+', '+91-9000111111', 'Delhi', '2025-06-01', '', '2025-09-10 21:03:26'),
('Mr. Rahul Singh', '1988-02-20', 'M', 'O+', '+91-9000222222', 'Noida', '2025-07-01', '', '2025-09-10 21:03:26'),
('Ms. Meera Patel', '1995-11-03', 'F', 'B+', '+91-9000333333', 'Ahmedabad', NULL, '', '2025-09-10 21:03:26'),
('Mr. Arjun Kumar', '1975-09-09', 'M', 'O-', '+91-9000444444', 'Lucknow', '2025-08-01', '', '2025-09-10 21:03:26'),
('Ms. Fatima Begum', '1998-03-17', 'F', 'AB+', '+91-9000555555', 'Kolkata', '2025-02-20', '', '2025-09-10 21:03:26'),
('Mr. Deepak Gupta', '1985-07-22', 'M', 'A+', '+91-9000666666', 'Mumbai', '2025-05-15', 'No known allergies', '2025-09-10 21:03:26'),
('Ms. Anjali Reddy', '1992-12-10', 'F', 'O+', '+91-9000777777', 'Hyderabad', '2025-06-20', '', '2025-09-10 21:03:26'),
('Mr. Sanjay Desai', '1980-04-18', 'M', 'B-', '+91-9000888888', 'Pune', '2025-07-10', 'Regular donor', '2025-09-10 21:03:26'),
('Ms. Kavita Joshi', '1996-08-25', 'F', 'A-', '+91-9000999999', 'Jaipur', NULL, '', '2025-09-10 21:03:26'),
('Mr. Rajesh Iyer', '1978-01-30', 'M', 'AB-', '+91-9001000000', 'Chennai', '2025-08-05', 'Rare blood type', '2025-09-10 21:03:26'),
('Ms. Pooja Malhotra', '1994-06-14', 'F', 'O-', '+91-9001111111', 'Chandigarh', '2025-04-12', 'Universal donor', '2025-09-10 21:03:26'),
('Mr. Karan Kapoor', '1987-09-08', 'M', 'A+', '+91-9001222222', 'Delhi', NULL, '', '2025-09-10 21:03:26'),
('Ms. Divya Nambiar', '1991-11-20', 'F', 'B+', '+91-9001333333', 'Kochi', '2025-03-18', '', '2025-09-10 21:03:26'),
('Mr. Aditya Shah', '1983-02-28', 'M', 'O+', '+91-9001444444', 'Surat', '2025-08-20', 'First time donor', '2025-09-10 21:03:26'),
('Ms. Priyanka Bose', '1997-05-07', 'F', 'AB+', '+91-9001555555', 'Kolkata', NULL, '', '2025-09-10 21:03:26');

INSERT INTO recipient (Name, Age, Blood_Group, Hospital, Contact, Created_At) VALUES
('Mr. K. Verma', 45, 'A+', 'City Hospital', '+91-9011111111', '2025-09-10 21:03:26'),
('Mrs. N. Rao', 60, 'O-', 'St Marys', '+91-9022222222', '2025-09-10 21:03:26'),
('Ms. R. Mehta', 29, 'B+', 'Children Care', '+91-9033333333', '2025-09-10 21:03:26'),
('Mr. S. Kumar', 55, 'O+', 'Apollo Hospital', '+91-9044444444', '2025-09-10 21:03:26'),
('Mrs. L. Deshmukh', 38, 'A-', 'Fortis Hospital', '+91-9055555555', '2025-09-10 21:03:26'),
('Master A. Patel', 12, 'B+', 'Children Care', '+91-9066666666', '2025-09-10 21:03:26'),
('Ms. T. Reddy', 42, 'AB+', 'City Hospital', '+91-9077777777', '2025-09-10 21:03:26'),
('Mr. V. Nair', 67, 'O-', 'St Marys', '+91-9088888888', '2025-09-10 21:03:26'),
('Mrs. M. Singh', 51, 'A+', 'Max Hospital', '+91-9099999999', '2025-09-10 21:03:26'),
('Mr. R. Chopra', 33, 'B-', 'AIIMS', '+91-9010101010', '2025-09-10 21:03:26'),
('Ms. S. Agarwal', 28, 'AB-', 'Lilavati Hospital', '+91-9020202020', '2025-09-10 21:03:26');

INSERT INTO blood_compatibility (Recipient_Group, Donor_Group) VALUES
('O-', 'O-'),
('O+', 'O-'), ('O+', 'O+'),
('A-', 'A-'), ('A-', 'O-'),
('A+', 'A+'), ('A+', 'A-'), ('A+', 'O+'), ('A+', 'O-'),
('B-', 'B-'), ('B-', 'O-'),
('B+', 'B+'), ('B+', 'B-'), ('B+', 'O+'), ('B+', 'O-'),
('AB-', 'AB-'), ('AB-', 'A-'), ('AB-', 'B-'), ('AB-', 'O-'),
('AB+', 'AB+'), ('AB+', 'A+'), ('AB+', 'B+'), ('AB+', 'O+'), ('AB+', 'AB-'), ('AB+', 'A-'), ('AB+', 'B-'), ('AB+', 'O-');

INSERT INTO blood_stock (Blood_Group, Quantity, Expiry_Date, Created_At) VALUES
('A+', 10, '2025-09-20', '2025-08-12 09:00:00'),
('O+', 8, '2025-09-30', '2025-08-31 10:15:00'),
('B+', 5, '2025-09-25', '2025-08-27 11:05:00'),
('O-', 3, '2025-09-15', '2025-08-06 13:00:00'),
('AB+', 2, '2025-10-10', '2025-09-01 12:00:00'),
('B+', 2, '2025-10-22', '2025-09-12 08:00:00'),
('A+', 12, '2025-10-05', '2025-08-26 08:30:00'),
('O-', 6, '2025-09-28', '2025-08-19 09:45:00'),
('A-', 4, '2025-10-15', '2025-09-05 10:20:00'),
('AB-', 2, '2025-10-08', '2025-08-29 11:00:00'),
('O+', 15, '2025-10-20', '2025-09-10 07:30:00'),
('B-', 3, '2025-09-22', '2025-08-13 12:15:00'),
('A+', 8, '2025-10-12', '2025-09-02 13:00:00'),
('B+', 6, '2025-10-18', '2025-09-08 14:30:00');

INSERT INTO donation_record (Donor_ID, Stock_ID, Donation_Date, Quantity, Notes) VALUES
(1, 1, '2025-08-09', 10, 'Routine donor visit'),
(2, 2, '2025-08-23', 8, 'Donated during health camp'),
(3, 3, '2025-08-29', 5, 'Routine donor visit'),
(4, 4, '2025-09-08', 3, 'Donated during health camp'),
(5, 5, '2025-08-13', 2, 'Routine donor visit'),
(3, 6, '2025-09-10', 2, 'Donated during health camp'),
(6, 7, '2025-08-26', 12, 'Regular donor, excellent health'),
(11, 8, '2025-08-19', 6, 'Rare blood type donation'),
(9, 9, '2025-09-05', 4, 'Health camp donation'),
(10, 10, '2025-08-29', 2, 'Routine visit'),
(14, 11, '2025-09-10', 15, 'Camp donation'),
(8, 12, '2025-08-13', 3, 'Regular donor'),
(12, 13, '2025-09-02', 8, 'Walk-in donation'),
(13, 14, '2025-09-08', 6, 'Health camp');

INSERT INTO blood_issue (Recipient_ID, Issue_Date, Quantity, Notes, Created_By_Staff_ID) VALUES
(1, '2025-09-10', 2, 'Issued successfully', 1),
(7, '2025-09-08', 3, 'Emergency surgery', 1),
(8, '2025-09-09', 2, 'Accident case', 2),
(9, '2025-09-09', 4, 'Scheduled surgery', 1),
(10, '2025-09-10', 1, 'Transfusion required', 3),
(11, '2025-09-10', 2, 'Cancer treatment', 2);


DROP TRIGGER IF EXISTS tr_blood_stock_before_insert;
DELIMITER $$
CREATE TRIGGER tr_blood_stock_before_insert
BEFORE INSERT ON blood_stock
FOR EACH ROW
BEGIN
  IF NEW.Expiry_Date IS NULL OR NEW.Expiry_Date = '0000-00-00' THEN
    SET NEW.Expiry_Date = DATE_ADD(NEW.Created_At, INTERVAL 40 DAY);
  END IF;
END$$
DELIMITER ;


DROP PROCEDURE IF EXISTS sp_add_donor;
DELIMITER //
CREATE PROCEDURE sp_add_donor (
  IN p_name VARCHAR(100),
  IN p_dob DATE,
  IN p_gender ENUM('M','F','O'),
  IN p_bg VARCHAR(3),
  IN p_contact VARCHAR(20),
  IN p_address TEXT
)
BEGIN
  INSERT INTO donor (Name, DOB, Gender, Blood_Group, Contact, Address)
  VALUES (p_name, p_dob, p_gender, p_bg, p_contact, p_address);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_donor;
DELIMITER //
CREATE PROCEDURE sp_update_donor (
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_dob DATE,
  IN p_gender ENUM('M','F','O'),
  IN p_bg VARCHAR(3),
  IN p_contact VARCHAR(20),
  IN p_address TEXT
)
BEGIN
  UPDATE donor
  SET Name=p_name, DOB=p_dob, Gender=p_gender, Blood_Group=p_bg, Contact=p_contact, Address=p_address
  WHERE Donor_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_donor;
DELIMITER //
CREATE PROCEDURE sp_delete_donor (IN p_id INT)
BEGIN
  DELETE FROM donor WHERE Donor_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_recipient;
DELIMITER //
CREATE PROCEDURE sp_add_recipient (
  IN p_name VARCHAR(100),
  IN p_age INT,
  IN p_bg VARCHAR(3),
  IN p_hospital VARCHAR(200),
  IN p_contact VARCHAR(20)
)
BEGIN
  INSERT INTO recipient (Name, Age, Blood_Group, Hospital, Contact) VALUES
  (p_name, p_age, p_bg, p_hospital, p_contact);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_recipient;
DELIMITER //
CREATE PROCEDURE sp_update_recipient (
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_age INT,
  IN p_bg VARCHAR(3),
  IN p_hospital VARCHAR(200),
  IN p_contact VARCHAR(20)
)
BEGIN
  UPDATE recipient SET Name=p_name, Age=p_age, Blood_Group=p_bg, Hospital=p_hospital, Contact=p_contact
  WHERE Recipient_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_recipient;
DELIMITER //
CREATE PROCEDURE sp_delete_recipient (IN p_id INT)
BEGIN
  DELETE FROM recipient WHERE Recipient_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_staff;
DELIMITER //
CREATE PROCEDURE sp_add_staff (
  IN p_name VARCHAR(100),
  IN p_role VARCHAR(50),
  IN p_email VARCHAR(150),
  IN p_pwd_hash VARCHAR(255),
  IN p_contact VARCHAR(20)
)
BEGIN
  INSERT INTO staff (Name, Role, Email, Password_Hash, Contact) VALUES
  (p_name, p_role, p_email, p_pwd_hash, p_contact);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_staff;
DELIMITER //
CREATE PROCEDURE sp_update_staff (
  IN p_id INT,
  IN p_name VARCHAR(100),
  IN p_role VARCHAR(50),
  IN p_email VARCHAR(150),
  IN p_contact VARCHAR(20)
)
BEGIN
  UPDATE staff SET Name=p_name, Role=p_role, Email=p_email, Contact=p_contact WHERE Staff_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_staff;
DELIMITER //
CREATE PROCEDURE sp_delete_staff (IN p_id INT)
BEGIN
  DELETE FROM staff WHERE Staff_ID = p_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_donation;
DELIMITER //
CREATE PROCEDURE sp_add_donation (
  IN p_donor_id INT,
  IN p_quantity INT,
  IN p_date DATE
)
BEGIN
  DECLARE v_bg VARCHAR(3);
  DECLARE v_expiry DATE;
  
  IF p_quantity <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be > 0';
  END IF;

  SELECT Blood_Group INTO v_bg FROM donor WHERE Donor_ID = p_donor_id;
  IF v_bg IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Donor not found';
  END IF;

  SET v_expiry = DATE_ADD(p_date, INTERVAL 40 DAY);

  INSERT INTO blood_stock (Blood_Group, Quantity, Expiry_Date, Created_At)
  VALUES (v_bg, p_quantity, v_expiry, p_date);

  INSERT INTO donation_record (Donor_ID, Stock_ID, Donation_Date, Quantity, Notes)
  VALUES (p_donor_id, LAST_INSERT_ID(), p_date, p_quantity, 'Donation recorded');

  UPDATE donor SET Last_Donation_Date = p_date WHERE Donor_ID = p_donor_id;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_issue_blood;
DELIMITER //
CREATE PROCEDURE sp_issue_blood (
  IN p_recipient_id INT,
  IN p_quantity INT,
  IN p_staff_id INT
)
BEGIN
  DECLARE v_bg VARCHAR(3);
  DECLARE v_need INT DEFAULT 0;
  DECLARE v_stock_id INT;
  DECLARE v_stock_qty INT;
  DECLARE v_compatible_total INT;

  SELECT Blood_Group INTO v_bg FROM recipient WHERE Recipient_ID = p_recipient_id;
  IF v_bg IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Recipient not found';
  END IF;

  SET v_need = p_quantity;

  SELECT IFNULL(SUM(bs.Quantity), 0) INTO v_compatible_total
  FROM blood_stock bs
  JOIN blood_compatibility bc ON bc.Donor_Group = bs.Blood_Group
  WHERE bc.Recipient_Group = v_bg
    AND bs.Expiry_Date > NOW();

  IF v_compatible_total < p_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wrong kind of donor or insufficient stock. Not accepted.';
  END IF;

  label_deduct: WHILE v_need > 0 DO
    SELECT Stock_ID, Quantity INTO v_stock_id, v_stock_qty
    FROM blood_stock bs
    JOIN blood_compatibility bc ON bc.Donor_Group = bs.Blood_Group
    WHERE bc.Recipient_Group = v_bg
      AND bs.Quantity > 0
      AND bs.Expiry_Date > NOW()
    ORDER BY bs.Created_At ASC
    LIMIT 1;

    IF v_stock_id IS NULL THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Unexpected stock depletion during issuance';
    END IF;

    IF v_stock_qty <= v_need THEN
      UPDATE blood_stock SET Quantity = 0 WHERE Stock_ID = v_stock_id;
      SET v_need = v_need - v_stock_qty;
    ELSE
      UPDATE blood_stock SET Quantity = Quantity - v_need WHERE Stock_ID = v_stock_id;
      SET v_need = 0;
    END IF;
  END WHILE label_deduct;

  INSERT INTO blood_issue (Recipient_ID, Issue_Date, Quantity, Notes, Created_By_Staff_ID)
  VALUES (p_recipient_id, CURDATE(), p_quantity, 'Issued successfully', p_staff_id);
END //
DELIMITER ;


SELECT 'Database schema created successfully' AS Status;
SELECT 'Sample data inserted successfully' AS Status;
SELECT 'Triggers and stored procedures created successfully' AS Status;
