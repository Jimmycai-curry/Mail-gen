/**
 * Spec: /docs/specs/history-page.md
 *
 * Toast 提示工具
 * 提供成功、错误、信息、警告等多种类型的提示
 * 用于用户操作反馈
 */

/**
 * Toast 类型
 */
type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * 显示 Toast 提示
 * @param type - 提示类型
 * @param message - 提示信息
 *
 * 注意：当前使用 alert 作为简单实现
 * 后续可以使用 Toast 库（如 react-toastify）实现更美观的效果
 */
function showToast(type: ToastType, message: string): void {
  // 简单实现：使用原生 alert
  // 后续可以升级为使用 Toast 库实现更美观的效果
  const prefix = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '⚠'
  };
  
  alert(`${prefix[type]} ${message}`);
}

/**
 * Toast 对象
 * 包含所有类型的提示方法
 * 使用方式：toast.success('操作成功'), toast.error('操作失败')
 */
export const toast = {
  /**
   * 显示成功提示
   * @param message - 提示信息
   *
   * 示例：
   * toast.success('操作成功')
   */
  success: (message: string): void => {
    showToast('success', message);
  },

  /**
   * 显示错误提示
   * @param message - 提示信息
   *
   * 示例：
   * toast.error('操作失败，请稍后重试')
   */
  error: (message: string): void => {
    showToast('error', message);
  },

  /**
   * 显示信息提示
   * @param message - 提示信息
   *
   * 示例：
   * toast.info('已保存到草稿箱')
   */
  info: (message: string): void => {
    showToast('info', message);
  },

  /**
   * 显示警告提示
   * @param message - 提示信息
   *
   * 示例：
   * toast.warning('请注意，此操作不可撤销')
   */
  warning: (message: string): void => {
    showToast('warning', message);
  }
};

/**
 * 显示功能开发中提示（保留兼容性）
 * @param message - 提示信息（默认："功能开发中，敬请期待"）
 *
 * 示例：
 * showComingSoonToast('此功能即将上线')
 */
export function showComingSoonToast(message: string = "功能开发中，敬请期待"): void {
  alert(message);
}
