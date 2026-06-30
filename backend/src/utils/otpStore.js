/**
 * In-memory OTP store with automatic expiry.
 *
 * How it works:
 *   - saveOtp(email, otp)   → stores OTP with a 5-minute expiry
 *   - verifyOtp(email, otp) → checks if OTP is valid, then DELETES it (one-time use)
 *
 * Storage format:  Map { "email@example.com" → { otp: "482917", expiresAt: 1715529600000 } }
 *
 * For production: replace this with Redis or a database table.
 */

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

const store = new Map();

/**
 * Save an OTP for a given email.
 * If an OTP already exists for this email, it gets overwritten (e.g., user clicks "resend").
 */
const saveOtp = (email, otp) => {
  store.set(email.toLowerCase(), {
    otp: String(otp),
    expiresAt: Date.now() + OTP_EXPIRY_MS
  });
};

/**
 * Verify an OTP for a given email.
 * Returns true if:  OTP exists AND matches AND hasn't expired.
 * Deletes the OTP after successful verification (one-time use).
 */
const verifyOtp = (email, otp) => {
  const entry = store.get(email.toLowerCase());

  // No OTP stored for this email
  if (!entry) return false;

  // OTP has expired
  if (Date.now() > entry.expiresAt) {
    store.delete(email.toLowerCase());
    return false;
  }

  // OTP doesn't match
  if (entry.otp !== String(otp)) return false;

  // Valid! Delete so it can't be reused
  store.delete(email.toLowerCase());
  return true;
};

module.exports = { saveOtp, verifyOtp };
