// Utility to generate a unique, human-readable tracking ID
// Format: GRV-{base36 timestamp}-{4 random chars}
// Example: GRV-LX4K2M-A9F3
// This runs as a pre-save hook on the Complaint model

const generateTrackingId = () => {
  // Convert current timestamp to base36 — shorter than decimal
  const timestamp = Date.now().toString(36).toUpperCase();

  // 4 random alphanumeric characters for uniqueness
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `GRV-${timestamp}-${random}`;
};

module.exports = generateTrackingId;