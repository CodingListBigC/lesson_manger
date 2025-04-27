require("dotenv").config();
const { Client } = require("pg");
const readline = require("readline");

// PostgreSQL client
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

// Dummy checkStudentID function (you need to replace it with real validation)
async function checkStudentID(id) {
  const results = await client.query(
    `SELECT * FROM users WHERE id = $1`, [id]
  )
  if (results.rows.length > 0) {
    console.error(results.rows);
    return true;
  } else {
    console.log("Student ID Is not avilvable please try and insert another id");
    return false;
  }
}

(async () => {
  try {
    await client.connect();

    console.log("\nEnter User Details:\n");

    let studentID;
    let runTrue = true;
    while (runTrue) {
      studentID = await ask("Student ID: ");
      if (await checkStudentID(studentID)) {
        runTrue = false;
      }
    }

    const lessonStartTime = await ask("Lesson Start Time: ");
    const lessonWeekDay = await ask("Lesson Weekday: ");
    let lessonLength = await ask("Lesson Length (Default = 1): ");
    if (!lessonLength) {
      lessonLength = 1;
    }
    const teacherID = await ask("Teacher ID: ");

    const defaultLessonResults = await client.query(
      `
      INSERT INTO lessonDefault (student_ID, teacher_ID, lesson_start, lesson_weekday, lesson_length)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [studentID, teacherID, lessonStartTime, lessonWeekDay, lessonLength]
    );

    let resultId = null;
    if (defaultLessonResults.rows.length > 0) {
      resultId = defaultLessonResults.rows[0].id;
    }

    const studentResults = await client.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [studentID]
    );

    if (studentResults.rows.length > 0) {
      const oldId = studentResults.rows[0]["lesson_id"];
      let newID = oldId ? [...oldId, resultId] : [resultId];

      await client.query(
        `
        UPDATE users
        SET lesson_id = $1
        WHERE id = $2
        `,
        [newID, studentID]
      );
    }

    console.log("User updated successfully!");
    rl.close();
    await client.end();
  } catch (error) {
    console.error(error);
    rl.close();
    await client.end();
  }
})();

