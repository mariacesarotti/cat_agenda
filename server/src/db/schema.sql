CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS cats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  age_category VARCHAR(20) NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  cat_id INT REFERENCES cats(id) ON DELETE CASCADE,
  brand VARCHAR(45),
  type VARCHAR(45),
  start_date DATE,
  end_date DATE
);

CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  cat_id INT REFERENCES cats(id) ON DELETE CASCADE,
  med_name VARCHAR(45),
  dosage VARCHAR(45),
  frequency_days INT,
  start_date DATE,
  end_date DATE
);

CREATE TABLE IF NOT EXISTS vaccines (
  id SERIAL PRIMARY KEY,
  cat_id INT REFERENCES cats(id) ON DELETE CASCADE,
  vaccine_name VARCHAR(45),
  description VARCHAR(100),
  frequency_days INT,
  date_administered DATE,
  next_due_date DATE
);

CREATE TABLE IF NOT EXISTS litter_config (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type_of_litter VARCHAR(50) NOT NULL,
  num_of_cats INTEGER NOT NULL,
  num_of_boxes INTEGER NOT NULL,
  last_full_change DATE NOT NULL
);
