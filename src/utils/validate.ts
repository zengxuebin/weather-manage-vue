/**
 * 校验邮箱
 * @param value 邮箱地址
 * @returns 结果
 */
export function validateEmail(value: string) {
  let regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return regEmail.test(value);
}

/**
 * 校验密码
 * @param value 密码
 * @returns 结果
 */
export function validatePassword(value: string) {
  let regPassword = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
  return regPassword.test(value);
}
