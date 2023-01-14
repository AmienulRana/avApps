export function getDate() {
  let d = new Date();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date = d.getDate() + ", " + months[d.getMonth()] + " " + d.getFullYear();
  return date;
}
