import moment from "moment";
export const getCurrentDate = (daysToAdd = 0) => {
  return moment().add(daysToAdd, "days").format("YYYY-MM-DD");
};

export const formatDate = (dateString, format = "DD-MM-YYYY") => {
  // Parse the input date string using Moment.js
  const date = moment(dateString, "YYYY-MM-DD");

  // Format the date as "dd-mm-yyyy"
  return date.format(format);
};

export function isDateInRange(startDate, endDate) {
  const currentDate = moment().startOf("day");
  const startDate1 = moment(startDate);
  const endDate1 = moment(endDate);

  return currentDate.isBetween(startDate1, endDate1, null, "[ ]");
}

export function getDifferenceInDays(endDate) {
  const startMoment = moment();
  const endMoment = moment(endDate);
  console.log("mjhgfdsdfghjkl;", startMoment, endMoment);
  // Add 1 day to include the end date in the calculation
  const daysDifference = endMoment.diff(startMoment, "days") + 2;

  return daysDifference;
}
