import { log } from "node:console";
import dbClient from "../../db.js";

async function getLessonData(studentId, lessonNumber) {
  try {
    const studentResults = await dbClient.query(`SELECT * FROM users WHERE id = $1`, [studentId]);
    if (!ifResultsThere(studentResults)) {
      console.log("Student ID Error: No student found with ID:", studentId);
      return; // End If no student id available
    }

    if (!studentResults.rows[0]?.lesson_id) {
      console.log("Student with ID:", studentId, "has no lessons assigned.");
      return;
    }

    const lessonResultsId = studentResults.rows[0].lesson_id[lessonNumber];
    if (lessonResultsId == null) {
      console.log("Error: No lesson ID found for student ID:", studentId, ", at index:", lessonNumber);
      return;
    }

    const lessonDefaultResults = await dbClient.query('SELECT * FROM lessondefault WHERE id = $1', [lessonResultsId]);
    if (!ifResultsThere(lessonDefaultResults)) {
      console.log("Error: No lesson default found with ID:", lessonResultsId);
      return;
    }

    const up_comming_lessons_id = lessonDefaultResults.rows[0].up_comming_lessons_id;
    if (!up_comming_lessons_id || up_comming_lessons_id.length === 0) {
      console.log("No upcoming lessons for student ID:", studentId);
      return []; // Return an empty array as there are no lessons
    }

    console.log("Number of upcoming lessons:", up_comming_lessons_id.length);
    let lessonArray = [];
    for (let lessonArrayIndex = 0; lessonArrayIndex < up_comming_lessons_id.length; lessonArrayIndex++) {
      const lessonDataResults = await dbClient.query(`SELECT * FROM lesson WHERE id = $1`, [up_comming_lessons_id[lessonArrayIndex]]);
      if (!ifResultsThere(lessonDataResults)) {
        console.log("Error: No data found for lesson with studentID:", studentId, ", lesson_id:", up_comming_lessons_id[lessonArrayIndex]);
        continue; // Skip to the next iteration if no lesson data is found
      }
      const lessonDataRow = lessonDataResults.rows[0];

      const teacherData = await getTeacherInfo(lessonDataRow.teacher_ID);
      console.log(teacherData)
      let returnData = {
        data: lessonDataRow.lesson_date, // Date of lesson
        id: lessonDataRow.id, // Id of lesson
        location: lessonDataRow.location, // Location of the lesson
        instrument: lessonDefaultResults.rows[0].instrument_type, // Instrument Type of a INTEGER
        teacher: {
          id: [up_comming_lessons_id[lessonArrayIndex]],
          picture_url: teacherData["picture_url"],
          first_name: teacherData["first_name"],
          last_name: teacherData["last_name"],
        }
      };
      lessonArray.push(returnData);
    }
    console.log("Finished processing lessons:", lessonArray);
    return lessonArray; // Return the array of lesson data
  } catch (error) {
    console.error("An error occurred:", error);
    return []; // Return an empty array in case of an error
  }
}

async function ifResultsThere(results) {
  return results?.rows?.length > 0;
}

async function getTeacherInfo(teacherId) {
  try {
    const teacherResults = await dbClient.query(`SELECT * FROM teacher WHERE id = $1`, [teacherId]);
    if (!ifResultsThere(teacherResults)) {
      console.log("No teacher found with ID:", teacherId);
      return null;
    }
    return teacherResults.rows[0];
  } catch (error) {
    console.error("Error fetching teacher info:", error);
    return null;
  }
}

// await getLessonData(1, 2);
getLessonData(1, 0);
