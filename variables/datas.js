let currentDate = new Date();
let nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
const newMonth = nextMonth.toISOString();
const newDate = currentDate.toISOString();

function updateTime() {
  currentDate = new Date();
  currentMonth = new Date();
  currentMonth.setMonth(currentMonth.getMonth() + 1);
};



module.exports = {
  nextMonth: nextMonth,
  currentDate: currentDate,
  updateTime: updateTime
};
