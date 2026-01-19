/**
 * Spec: /docs/specs/history-page.md
 *
 * Toast 提示工具
 * 提供成功、错误、信息、警告等多种类型的提示
 * 用于用户操作反馈
 * 
 * 特性：
 * - 屏幕中间显示
 * - 自动 2 秒后消失
 * - 点击外部提前关闭（渐隐动画）
 * - 不需要用户手动点击关闭按钮
 */

/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * 显示 Toast 提示
 * @param type - 提示类型
 * @param message - 提示信息
 * @param duration - 显示时长（毫秒），默认 2000ms
 *
 * 实现方式：
 * - 通过触发自定义事件通知 ToastContainer 组件
 * - ToastContainer 在根布局中挂载，负责渲染所有 Toast
 */
function showToast(type: ToastType, message: string, duration?: number): void {
  // 触发自定义事件
  const event = new CustomEvent('show-toast', {
    detail: { type, message, duration: duration || 2000 }
  });
  window.dispatchEvent(event);
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
   * @param duration - 显示时长（毫秒），默认 2000ms
   *
   * 示例：
   * toast.success('操作成功')
   * toast.success('操作成功', 3000) // 显示 3 秒
   */
  success: (message: string, duration?: number): void => {
    showToast('success', message, duration);
  },

  /**
   * 显示错误提示
   * @param message - 提示信息
   * @param duration - 显示时长（毫秒），默认 2000ms
   *
   * 示例：
   * toast.error('操作失败，请稍后重试')
   * toast.error('操作失败，请稍后重试', 3000) // 显示 3 秒
   */
  error: (message: string, duration?: number): void => {
    showToast('error', message, duration);
  },

  /**
   * 显示信息提示
   * @param message - 提示信息
   * @param duration - 显示时长（毫秒），默认 2000ms
   *
   * 示例：
   * toast.info('已保存到草稿箱')
   */
  info: (message: string, duration?: number): void => {
    showToast('info', message, duration);
  },

  /**
   * 显示警告提示
   * @param message - 提示信息
   * @param duration - 显示时长（毫秒），默认 2000ms
   *
   * 示例：
   * toast.warning('请注意，此操作不可撤销')
   */
  warning: (message: string, duration?: number): void => {
    showToast('warning', message, duration);
  }
};

/**
 * 显示功能开发中提示（保留兼容性）
 * @param message - 提示信息（默认："功能开发中，敬请期待"）
 * @param duration - 显示时长（毫秒），默认 2000ms
 *
 * 示例：
 * showComingSoonToast('此功能即将上线')
 */
export function showComingSoonToast(message: string = "功能开发中，敬请期待", duration?: number): void {
  showToast('info', message, duration);
}
