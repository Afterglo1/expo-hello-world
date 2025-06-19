const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert 0 to 12

  return `${month},${day} ${year} ${hours}:${minutes}${ampm}`;
};

export { formatTimestamp };
