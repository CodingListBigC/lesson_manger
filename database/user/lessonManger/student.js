import { dbClient } from "../../db.js";
const dateVar = require("../../../variables/datas.js");
const lessonQury = `
  INSERT INTO lesson (student_ID,lesson_start, lesson_date)
  VALUES ($1, $2, $3)
  RETURNING id

`; // This is setup for insert lesson in the table called lesson to create a new lesson.

async function createLessonMonth(studentID, numberOfLesson) {
  const currentDate = dateVar.currentDate;
  const nextMonth = dateVar.nextMonth;

  const studentPropertys = await getStudentPropertys(studentID);
  //console.log(studentPropertys);
  const lessonNumberList = studentPropertys.lesson_id;
  if (!lessonNumberList) {
    console.log(`No lesson ID found for student with ID: ${studentID}`);
    return null;
  }

  console.log("Lesson Number:", lessonNumberList);
  console.log("Lesson Number:", lessonNumberList.length);
  if (numberOfLesson > lessonNumberList.length - 1) {
    return null;
  }
  // Create Lesson
  const lessonNumber = lessonNumberList[numberOfLesson];
  const lessonInfo = await getLessonInfo(lessonNumber);
  console.log(lessonInfo)
  const lessonInfoArray = {
    lessonStart: lessonInfo["lesson_start"],
    lessonLenght: lessonInfo["lesson_length"]
  }

  let lessonDates = [];
  for (let day = new Date(currentDate); day.getTime() < nextMonth.getTime(); day.setDate(day.getDate() + 1)) {
    if (day.getDay() == lessonInfo["lesson_weekday"]) {
      lessonDates = [...lessonDates, {
        year: day.getFullYear(),
        month: day.getMonth(),
        date: day.getDate(),
        done: false
      }];
    }
  }
  if (lessonInfo["up_comming_lessons_id"] != null) {
    for (let lesson_ID = 0; lesson_ID < lessonInfo["up_comming_lessons_id"].length; lesson_ID++) {
      const element = lessonInfo["up_comming_lessons_id"][lesson_ID];
      const results = getLessonDate(element);
      if (ifResultsThere(results)) {
      }
    }
  }

  for (let listOfDates = 0; listOfDates < lessonDates.length; listOfDates++) {
    if (!lessonDates[listOfDates]["done"]) {
      console.log("Not Done".lessonDates)
      const lesson = lessonDates[listOfDates];

      const formattedDate = `${lesson["year"]}-${lesson["month"].toString().padStart(2, '0')}-${lesson["date"].toString().padStart(2, '0')}`;
      const create_Lesson_resutls = await dbClient.query(lessonQury, [studentID, lessonInfoArray["lessonStart"], formattedDate]);
      console.log("Comple Time")
      if (ifResultsThere(create_Lesson_resutls)) {
        console.log("Complete Correct");
      } else {
        console.log("Error In resutls")
      }
      console.log(create_Lesson_resutls.rows[0].id)
    }

  }

  console.log(lessonDates);
}

async function ifResultsThere(results) {
  if (results.rows.length > 0) {
    return true;
  } else {
    return false;
  }
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

async function getLessonInfo(lesson_id) {
  try {
    const results = await dbClient.query(
      "SELECT * FROM lessonDefault WHERE id = $1",
      [lesson_id]
    );

    if (results.rows.length > 0) {
      return results.rows[0];
    } else {
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

async function getLessonDate(lesson_id) {
  const results = await dbClient.query(
    `SELECT (id, lesson_date) FROM lesson WHERE id = $1`,
    [lesson_id]
  )
  if (reuslt.rows.length > 0) {
    return results.rows[0];
  }
}
// Example call:
await createLessonMonth(1, 0);

//createLessonMonth(2, 1)
