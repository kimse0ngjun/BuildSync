-- 관리자 계정
INSERT INTO admin
(
login_id,
password,
admin_name,
role,
created_at
)
VALUES
(
'admin',
'$2a$12$2K6gKHmWAKgnMWXIJ.TyH.mPNy6Po9kjIZ18ZUKlD2mL2nowyHDi6',
'관리자',
'ADMIN',
NOW()
)
ON DUPLICATE KEY UPDATE
login_id = login_id;