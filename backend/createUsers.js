const bcrypt = require("bcryptjs");
const db = require("./config/db");

const createUsers = async () => {
  try {
    const employeePassword = await bcrypt.hash("employee123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Employee 1
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Floyd", "employee@gmail.com", employeePassword, "employee"]
    );

    // Employee 2
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["John", "john@gmail.com", employeePassword, "employee"]
    );

    // Employee 3
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Sarah", "sarah@gmail.com", employeePassword, "employee"]
    );

    // Admin 1
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Admin", "admin@gmail.com", adminPassword, "admin"]
    );

    // Admin 2
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Admin 2", "admin2@gmail.com", adminPassword, "admin"]
    );

    console.log("Users created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createUsers();