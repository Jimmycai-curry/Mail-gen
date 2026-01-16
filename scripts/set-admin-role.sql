-- 将指定手机号的用户设置为管理员
-- role: 0 = 管理员, 1 = 普通用户

-- 1. 先查询当前用户信息
SELECT id, phone, role, status, created_time 
FROM users 
WHERE phone = '13265336818';

-- 2. 将该用户设置为管理员
UPDATE users 
SET role = 0, updated_time = CURRENT_TIMESTAMP
WHERE phone = '13265336818';

-- 3. 验证修改结果
SELECT id, phone, role, status, created_time 
FROM users 
WHERE phone = '13265336818';
