/**
 * Spec: /docs/specs/login-page.md
 * 
 * 表单校验工具函数
 * 提供手机号、密码、验证码等字段的格式验证
 */

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 验证中国大陆手机号格式
 * @param phone - 手机号字符串
 * @returns 验证结果对象
 * 
 * 规则：
 * - 必须是 11 位数字
 * - 第一位必须是 1
 * - 第二位必须是 3-9 之间的数字
 */
export function validatePhone(phone: string): ValidationResult {
  // 检查是否为空
  if (!phone) {
    return { isValid: false, error: '请输入手机号' };
  }

  // 检查长度
  if (phone.length !== 11) {
    return { isValid: false, error: '手机号必须为11位' };
  }

  // 中国大陆手机号正则：1开头，第二位为3-9，后面9位数字
  const PHONE_REGEX = /^1[3-9]\d{9}$/;
  
  if (!PHONE_REGEX.test(phone)) {
    return { isValid: false, error: '请输入正确的手机号格式' };
  }

  return { isValid: true };
}

/**
 * 验证密码格式
 * @param password - 密码字符串
 * @returns 验证结果对象
 * 
 * 规则：
 * - 长度至少 6 位
 * - 可选：包含字母和数字的组合（当前未强制）
 */
export function validatePassword(password: string): ValidationResult {
  // 检查是否为空
  if (!password) {
    return { isValid: false, error: '请输入密码' };
  }

  // 检查最小长度
  if (password.length < 6) {
    return { isValid: false, error: '密码长度不能少于6位' };
  }

  // 检查最大长度（可选，防止过长密码）
  if (password.length > 20) {
    return { isValid: false, error: '密码长度不能超过20位' };
  }

  return { isValid: true };
}

/**
 * 验证短信验证码格式
 * @param code - 验证码字符串
 * @returns 验证结果对象
 * 
 * 规则：
 * - 必须是 6 位数字
 */
export function validateCode(code: string): ValidationResult {
  // 检查是否为空
  if (!code) {
    return { isValid: false, error: '请输入验证码' };
  }

  // 检查长度
  if (code.length !== 6) {
    return { isValid: false, error: '验证码必须为6位数字' };
  }

  // 检查是否全为数字
  const CODE_REGEX = /^\d{6}$/;
  
  if (!CODE_REGEX.test(code)) {
    return { isValid: false, error: '验证码必须为6位数字' };
  }

  return { isValid: true };
}

/**
 * 验证协议勾选状态
 * @param agreed - 是否同意协议
 * @returns 验证结果对象
 */
export function validateAgreement(agreed: boolean): ValidationResult {
  if (!agreed) {
    return { isValid: false, error: '请先阅读并同意服务协议' };
  }

  return { isValid: true };
}

/**
 * 格式化手机号显示（中间四位用 * 代替）
 * @param phone - 原始手机号
 * @returns 格式化后的手机号，如：138****5678
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone || phone.length !== 11) {
    return phone;
  }

  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
}

/**
 * 清理手机号输入（移除空格、横线等字符）
 * @param phone - 用户输入的手机号
 * @returns 清理后的纯数字手机号
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}
