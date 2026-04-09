const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PASSWORD_MIN_LENGTH = 8;
const OTP_LENGTH = 6;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/;

export function validateEmail(email) {
  if (typeof email !== 'string') return { valid: false, error: 'Email is required' };
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { valid: false, error: 'Email is required' };
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: 'Invalid email format' };
  if (trimmed.length > 254) return { valid: false, error: 'Email is too long' };
  return { valid: true, value: trimmed };
}

export function validatePassword(password) {
  if (typeof password !== 'string') return { valid: false, error: 'Password is required' };
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
  if (strength < 2) {
    return { valid: false, error: 'Password must contain at least 2 of: uppercase, lowercase, number, special character' };
  }
  return { valid: true, value: password, strength };
}

export function validateOTP(otp) {
  if (typeof otp !== 'string' && typeof otp !== 'number') {
    return { valid: false, error: 'OTP is required' };
  }
  const trimmed = String(otp).trim();
  if (!/^\d+$/.test(trimmed)) return { valid: false, error: 'OTP must contain only numbers' };
  if (trimmed.length !== OTP_LENGTH) {
    return { valid: false, error: `OTP must be ${OTP_LENGTH} digits` };
  }
  return { valid: true, value: trimmed };
}

export function validateName(name) {
  if (typeof name !== 'string') return { valid: false, error: 'Name is required' };
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, error: 'Name is required' };
  if (trimmed.length < 2) return { valid: false, error: 'Name is too short' };
  if (trimmed.length > 100) return { valid: false, error: 'Name is too long' };
  if (!NAME_REGEX.test(trimmed)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true, value: trimmed };
}

export function validatePhone(phone) {
  if (typeof phone !== 'string') return { valid: false, error: 'Phone is required' };
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(cleaned)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true, value: cleaned };
}

export function validateAmount(amount, min = 0, max = Infinity) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return { valid: false, error: 'Invalid amount' };
  if (num < min) return { valid: false, error: `Amount must be at least ${min}` };
  if (num > max) return { valid: false, error: `Amount exceeds maximum of ${max}` };
  return { valid: true, value: num };
}

export function validateRequired(value, fieldName = 'Field') {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, value: typeof value === 'string' ? value.trim() : value };
}
