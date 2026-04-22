const generateTrackingId = () => {
  const prefix = "SC";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-5);
  return `${prefix}${timestamp}${random}`;
};

module.exports = generateTrackingId;
