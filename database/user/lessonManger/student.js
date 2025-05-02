import dbClient from "../../db.js";
import dateVar from "../../../variables/datas.js";

const lessonQury = `
  INSERT INTO lesson (student_ID, lesson_start, lesson_date)
  VALUES ($1, $2, $3)
  RETURNING id
`; // Insert lesson into lesson table

async function createLessonMonth(studentID, numberOfLesson) {
  const currentDate = dateVar.currentDate;
  const nextMonth = dateVar.nextMonth;

  const studentPropertys = await getStudentPropertys(studentID);

  if (!studentPropertys) {
    console.log(`No student found with ID: ${studentID}`);
    return null;
  }

  const lessonNumberList = studentPropertys.lesson_id;
  if (!lessonNumberList) {
    console.log(`No lesson ID found for student with ID: ${studentID}`);
    return null;
  }

  console.log("Lesson Number List:", lessonNumberList);
  console.log("Lesson Number List Length:", lessonNumberList.length);

  if (numberOfLesson > lessonNumberList.length - 1) {
    return null;
  }

  // Create Lesson
  const lessonNumber = lessonNumberList[numberOfLesson];
  const lessonInfo = await getLessonInfo(lessonNumber);

  if (!lessonInfo) {
    console.log(`No lesson info found for lesson ID: ${lessonNumber}`);
    return null;
  }

  console.log(lessonInfo);

  const lessonInfoArray = {
    lessonStart: lessonInfo["lesson_start"],
    lessonLength: lessonInfo["lesson_length"]
  };

  let lessonDates = [];

  for (let day = new Date(currentDate); day.getTime() < nextMonth.getTime(); day.setDate(day.getDate() + 1)) {
    if (day.getDay() === lessonInfo["lesson_weekday"]) {
      lessonDates = [
        ...lessonDates,
        {
          year: day.getFullYear(),
          month: day.getMonth() + 1, // Important: JavaScript months are 0-indexed
          date: day.getDate(),
          done: false,
          id: -1,
          new: true,
        }
      ];
    }
  }

  // Check upcomming lessons if exist
  if (lessonInfo["up_comming_lessons_id"] != null) {
    for (let lesson_ID = 0; lesson_ID < lessonInfo["up_comming_lessons_id"].length; lesson_ID++) {
      const element = lessonInfo["up_comming_lessons_id"][lesson_ID];
      const results = await getLessonDate(element);

      if (await ifResultsThere(results)) {
        for (let lessonDatesNum = 0; lessonDatesNum < lessonDates.length; lessonDatesNum++) {
          const lesson = lessonDates[lessonDatesNum];
          const formattedDate = `${lesson["year"]}-${lesson["month"].toString().padStart(2, '0')}-${lesson["date"].toString().padStart(2, '0')}`;
          if (results.rows[0]["lesson_date"] = formattedDate) {
            lessonDates[lessonDatesNum]["done"] = true;
            lessonDates[lessonDatesNum]["new"] = false;

          }
        }
      }
    }

  }
  for (let listOfDates = 0; listOfDates < lessonDates.length; listOfDates++) {
    if (lessonDates[listOfDates]["done"]) {
      console.log("Not Done:", lessonDates[listOfDates]);
      const lesson = lessonDates[listOfDates];

      const formattedDate = `${lesson["year"]}-${lesson["month"].toString().padStart(2, '0')}-${lesson["date"].toString().padStart(2, '0')}`;

      const create_Lesson_results = await dbClient.query(lessonQury, [
        studentID,
        lessonInfoArray["lessonStart"],
        formattedDate
      ]);

      console.log("Complete Time");
      if (await ifResultsThere(create_Lesson_results)) {
        //console.log("Complete Correct:", create_Lesson_results.rows[0].id);
        lesson["done"] = true;
        lesson["id"] = create_Lesson_results.rows[0].id;
      } else {
        console.log("Error in results");
      }
    }
  }
  let listOfIds = []
  if (lessonInfo["up_comming_lessons_id"] != null) {
    listOfIds = lessonInfo["up_comming_lessons_id"]
  }
  let next_lesson = lessonInfo["time"]
  for (let dateNumber = 0; dateNumber < lessonDates.length; dateNumber++) {
    const element = lessonDates[dateNumber];
    if (element["new"]) {
      if (element["done"]) {
        listOfIds.push(element["id"]);
      }
    }
  }
  if (listOfIds != lessonInfo["up_comming_lessons_id"]) {
    dbClient.query(
      `
            UPDATE lessonDefault
            SET up_comming_lessons_id  = $1
            WHERE id = $2
`,
      [
        listOfIds,
        lessonNumber
      ]
    )
  }

  console.log(lessonDates);
}
// Checks if the query results has any rows
async function ifResultsThere(results) {
  return results && results.rows && results.rows.length > 0;
}

// Get student properties from users table
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
    console.error("Error in getStudentPropertys:", error);
    return null;
  }
}

// Get info for a lesson
async function getLessonInfo(lesson_id) {
  try {
    const results = await dbClient.query(
      "SELECT * FROM lessonDefault WHERE id = $1",
      [lesson_id]
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

// See if lesson exists on a date
async function seeLessonDate(date, checkLessonID) {
  try {
    const results = await dbClient.query(
      "SELECT lesson_date FROM lessonDefault WHERE id = $1",
      [checkLessonID]
    );

    if (results.rows.length > 0) {
      for (let rowIndex = 0; rowIndex < results.rows.length; rowIndex++) {
        const row = results.rows[rowIndex];
        if (row.lesson_date === date) {
          return 1;
        }
      }
      return 0;
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error in seeLessonDate:", error);
    return -1;
  }
}

// Get a lesson date by lesson id
async function getLessonDate(lesson_id) {
  try {
    const results = await dbClient.query(
      "SELECT id, lesson_date FROM lesson WHERE id = $1",
      [lesson_id]
    );
    if (results.rows.length > 0) {
      return results.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error in getLessonDate:", error);
    return null;
  }
}

// Example call
await createLessonMonth(1, 0);
await createLessonMonth(2, 1); // if you want to test for another student
