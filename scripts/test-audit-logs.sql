-- 测试脚本：检查和插入审计日志测试数据
-- Spec: /docs/specs/admin-audit-logs.md

-- 1. 检查 audit_logs 表是否有数据
SELECT COUNT(*) as total_count FROM audit_logs;

-- 2. 查看最近的 5 条审计日志
SELECT 
  id,
  user_phone,
  user_ip,
  model_name,
  status,
  created_time
FROM audit_logs
ORDER BY created_time DESC
LIMIT 5;

-- 3. 如果表为空，插入一些测试数据
-- 注意：请先检查 users 表中是否有用户数据，并替换下面的 user_id

-- 插入测试数据示例（请根据实际情况调整 user_id）
/*
INSERT INTO audit_logs (
  user_id,
  user_phone,
  user_ip,
  scene,
  tone,
  input_prompt,
  output_content,
  model_name,
  status,
  is_sensitive,
  external_audit_id
) VALUES 
(
  '你的真实user_id',  -- 替换为实际的 user_id
  '13800138000',
  '192.168.1.1',
  '商务邮件',
  '正式',
  '请帮我写一段关于量子物理的介绍，特别是关于量子纠缠的通俗解释，用于给小学生做科普分享。',
  '想象你有两枚"魔法硬币"，它们之间有一种神奇的联系。当你抛起其中一枚，它落下来是正面；哪怕另一枚硬币在宇宙的另一端，它落下来也一定是反面... 这就是量子纠缠！就像是双胞胎之间的心灵感应。',
  'DeepSeek-V3',
  1,  -- 1=通过, 0=违规拦截
  false,
  'audit-v3-9921-prod'
),
(
  '你的真实user_id',  -- 替换为实际的 user_id
  '15912341234',
  '210.12.45.67',
  '商务邮件',
  '正式',
  '写一封拒绝合作的邮件',
  '尊敬的客户，感谢您的合作意向...',
  'DeepSeek-V3',
  0,  -- 违规拦截
  true,
  'audit-v3-9922-prod'
);
*/

-- 4. 验证插入是否成功
SELECT COUNT(*) as total_count FROM audit_logs;
