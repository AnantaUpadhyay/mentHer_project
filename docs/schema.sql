-- Database Schema for mentHer_project

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Entrepreneurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    stage ENUM('idea', 'seed', 'series_a', 'series_b') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Mentors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    expertise VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Ideas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entrepreneur_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrepreneur_id) REFERENCES Entrepreneurs(id)
);

CREATE TABLE MentorshipMatches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entrepreneur_id INT NOT NULL,
    mentor_id INT NOT NULL,
    match_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrepreneur_id) REFERENCES Entrepreneurs(id),
    FOREIGN KEY (mentor_id) REFERENCES Mentors(id)
);

CREATE TABLE FundingInfo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idea_id INT NOT NULL,
    amount DECIMAL(15,2),
    funding_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES Ideas(id)
);

CREATE TABLE GovSchemes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    eligibility_criteria TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);