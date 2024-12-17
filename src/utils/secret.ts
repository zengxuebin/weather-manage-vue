import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("7ahf7d0zhhviyqaz");

/**
 * AES 加密
 * @param word 字符串
 * @returns base64
 */
export function encrypt(word: string) {
  let key = KEY;
  let srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

}

/**
 * AES 解密
 * @param word 字符串
 * @returns base64
 */
export function decrypt(word: string) {
  let key = KEY;

  let base64 = CryptoJS.enc.Base64.parse(word);
  let src = CryptoJS.enc.Base64.stringify(base64);

  let decrypt = CryptoJS.AES.decrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });

  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
