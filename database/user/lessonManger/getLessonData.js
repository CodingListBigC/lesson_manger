import dbClient from "../../db.js";

async function getLessonData(studentId, lessonNumber) {
  try {
    const studentResultsId = await dbClient.query(`SELECT * FROM users WHERE id = $1`, [studentId]);
    if (!await ifResultsThere(studentResultsId)) {
      console.log("Student ID Error");
      return; // End If no student id availiable
    }
    if ((studentResultsId.rows[0]["lesson_id"]) == null){
      console.log("student Has No lessons")
    }
    const lessonResultsId = studentResultsId.rows[0]["lesson_id"][lessonNumber];
    if (lessonResultsId == null){
      console.log("Error no lesson id found with that studentID:",studentId, ", index: ", lessonNumber);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function ifResultsThere(results) {
  return results && results.rows && results.rows.length > 0;
}

await getLessonData(1, 2);
await getLessonData(1, 0);
