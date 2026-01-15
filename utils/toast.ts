// Spec: /docs/specs/landing-page.md

/**
 * 显示功能开发中的提示信息
 * 用于未实现功能的按钮点击反馈
 *
 * @param message 提示信息（默认："功能开发中，敬请期待"）
 */
export function showComingSoonToast(message: string = "功能开发中，敬请期待"): void {
  alert(message);
}
