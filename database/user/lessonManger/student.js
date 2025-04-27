const dbClient = require("../../db.js");
const dateVar = require("../../../variables/datas.js");
const lessonQury = `
  INSERT INTO lesson (student_ID,lesson_start, lesson_date)
  VALUES ($1, $2, $3)
`; // This is setup for insert lesson in the table called lesson to create a new lesson.

// Define the weekday (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
async function createLessonMonth(studentID, numberOfLesson) {
  const currentDate = dateVar.currentDate;
  const nextMonth = dateVar.nextMonth;

  const studentPropertys = await getStudentPropertys(studentID);
  //console.log(studentPropertys);
  const lessonNumber = studentPropertys.lesson_ID;
  if (!lessonNumber) {
    console.log(`No lesson ID found for student with ID: ${studentID}`);
    return null;
  }

  console.log("Lesson Number:", lessonNumber);
  console.log("Lesson Number:", lessonNumber.length);
  if (numberOfLesson > lessonNumber.length) {
    return null;
  }
  // Create Leson until next Month 
  return true;
}

async function getStudentPropertys(studentID) {
  try {
    const results = await dbClient.query(
      "SELECT * FROM users WHERE id = $1",
      [studentID]
    );
    if (results.rows.length > 0) {
      return results.rows[0];
    } else {
      console.log(`No user found with ID: ${studentID}`);
      return null;
    }
  } catch (error) {
    console.error("Error in getLessonID:", error);
    return null;
  }
}

async function getLessonInfo(studentID) {
  try {
    const results = await dbClient.query(
      "SELECT * FROM lessonDefualt WHERE student_ID = $1",
      [studentID]
    );

    if (results.rows.length > 0) {
      return results.rows[0];
    } else {
      console.log(`No default lesson found for student with ID: ${studentID}`);
      return null;
    }
  } catch (error) {
    console.error("Error in getLessonInfo:", error);
    return null;
  }
}

async function seeLessonDate(date, CheckLessonID) {

  const results = await dbCLient.query(
    "SELECT lesson_date FROM lessonDefualt WHERE id = $1",
    [CheckLessonID]
  );

  if (results.rows.length > 0) {
    for (let rowIndex = 0; rowIndex < results.rows.length; rowIndex++) {
      const row = results.rows[rowIndex];
      if (row.lesson_date == date) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  else {
    return -1;
  }
}
// Example call:
createLessonMonth(1, 1);

createLessonMonth(2, 1);

