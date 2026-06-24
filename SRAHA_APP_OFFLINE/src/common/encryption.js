import crypto from "crypto";

// الـ encryption مش مستخدم حالياً لكن موجود للاستعداد
export const encrypt = (text) => {
  const key = crypto.randomBytes(32).toString("hex");
  const iv = crypto.randomBytes(16).toString("hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv}:${encrypted}:${key}`;
};

export const decrypt = (encryptedText) => {
  const parts = encryptedText.split(":");
  const iv = parts[0];
  const encrypted = parts[1];
  const key = parts[2];
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};