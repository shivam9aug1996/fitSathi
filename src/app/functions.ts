import moment from "moment-timezone";
export const getCurrentDate = (daysToAdd = 0) => {
  return moment().add(daysToAdd, "days").format("YYYY-MM-DD");
};

export const formatDate = (
  dateString,
  format = "DD-MM-YYYY",
  timezone = "Asia/Kolkata"
) => {
  // Parse the input date string using Moment.js and set the timezone
  const date = moment.tz(dateString, "YYYY-MM-DD", timezone);

  // Format the date as per the specified format
  return date.format(format);
};

export function isDateInRange(startDateStr, endDateStr) {
  const currentDateStr = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
  const startDate = moment(startDateStr).format("YYYY-MM-DD");
  const endDate = moment(endDateStr).format("YYYY-MM-DD");
  console.log("98743ertyuio", currentDateStr, startDate, endDate);
  return moment(currentDateStr).isBetween(startDate, endDate, null, "[]");
}

export function getDifferenceInDays(endDate) {
  const startMoment = moment();
  const endMoment = moment(endDate);
  console.log("mjhgfdsdfghjkl;", startMoment, endMoment);
  // Add 1 day to include the end date in the calculation
  const daysDifference = endMoment.diff(startMoment, "days") + 2;

  return daysDifference;
}

export function daysUntilExpiration(date) {
  if (!date) {
    return -1;
  }
  const currentDate = moment.tz("Asia/Kolkata").startOf("day");
  const expirationDate = moment(date).tz("Asia/Kolkata").startOf("day");
  console.log("o9876rfghjkl", expirationDate, date);
  // Calculate the difference in days
  const daysDifference = expirationDate.diff(currentDate, "days");

  if (daysDifference >= 0) {
    return daysDifference + 1; // Return days left until expiration
  } else {
    return daysDifference; // Return days passed since expiration
  }
}

export function spaceToCamelCase(str) {
  return str.replace(/\s+(\w)/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

export function capitalize(str) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export const isExpiringInDays = (
  endDate,
  minDays,
  maxDays,
  timezone = "Asia/Kolkata"
) => {
  const daysUntilExpiry = daysUntilExpiration(endDate, timezone);
  console.log("kjuytr", daysUntilExpiry, minDays, maxDays);
  return daysUntilExpiry >= minDays && daysUntilExpiry <= maxDays;
};

export const formattedValue = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
};
