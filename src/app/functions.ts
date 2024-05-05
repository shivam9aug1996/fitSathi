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
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const startDate1 = new Date(startDate);
  startDate1.setHours(0, 0, 0, 0);
  const endDate1 = new Date(endDate);
  endDate1.setHours(0, 0, 0, 0);
  return currentDate >= startDate1 && currentDate <= endDate1;
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
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const expirationDate = new Date(date);
  expirationDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const difference = expirationDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

  if (daysDifference > 0) {
    return daysDifference; // Return days left until expiration
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

export const isExpiringInDays = (endDate, minDays, maxDays) => {
  const daysUntilExpiry = daysUntilExpiration(endDate) + 1;
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
