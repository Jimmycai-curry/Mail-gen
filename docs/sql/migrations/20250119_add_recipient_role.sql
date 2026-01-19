-- 迁移脚本：为 mail_histories 表增加 recipient_role 字段
-- 创建时间：2025-01-19
-- 说明：修复数据库表缺少"收件人身份"字段的问题

-- 增加 recipient_role 字段
ALTER TABLE mail_histories 
ADD COLUMN recipient_role VARCHAR(200);

-- 添加字段注释
COMMENT ON COLUMN mail_histories.recipient_role IS '收件人身份/职位（如：采购总监、技术合作伙伴）';

-- 验证迁移结果
-- 可以运行以下查询检查字段是否添加成功：
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'mail_histories' AND column_name = 'recipient_role';
