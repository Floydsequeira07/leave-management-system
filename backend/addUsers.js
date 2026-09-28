const bcrypt = require("bcryptjs");
const db = require("./config/db");

const addUsers = async () => {
  try {
    const employeePassword = await bcrypt.hash("employee123", 10);
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Employee 2
    const [employee2] = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["John", "john@gmail.com", employeePassword, "employee"]
    );

    // Employee 3
    const [employee3] = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Sarah", "sarah@gmail.com", employeePassword, "employee"]
    );

    // Admin 2
    await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      ["Admin 2", "admin2@gmail.com", adminPassword, "admin"]
    );

    // Leave balance for Employee 2
    await db.query(
      `INSERT INTO leave_balances
       (user_id, casual_total, casual_leave,
        sick_total, sick_leave,
        earned_total, earned_leave, unpaid_leave)
       VALUES (?, 12, 12, 10, 10, 15, 15, 0)`,
      [employee2.insertId]
    );

    // Leave balance for Employee 3
    await db.query(
      `INSERT INTO leave_balances
       (user_id, casual_total, casual_leave,
        sick_total, sick_leave,
        earned_total, earned_leave, unpaid_leave)
       VALUES (?, 12, 12, 10, 10, 15, 15, 0)`,
      [employee3.insertId]
    );

    console.log("2 employees and 1 admin added successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

addUsers();