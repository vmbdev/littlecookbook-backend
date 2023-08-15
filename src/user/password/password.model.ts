export type PasswordCheckResult = {
  valid: boolean;
  data: PasswordInvalidData;
};

export type PasswordInvalidData = {
  minLength?: boolean;
  hasUppercase?: boolean;
  hasNumber?: boolean;
  hasNonAlphanumeric?: boolean;
};
