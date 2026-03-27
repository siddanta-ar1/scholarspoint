#!/bin/bash

# Supabase credentials from .env.local
SUPABASE_URL="https://exhacfxnnrkhaxbtummo.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4aGFjZnhubnJraGF4YnR1bW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMzkxODIsImV4cCI6MjA2NTYxNTE4Mn0.vg_MFQBniHnwTjhJ6PMza3RY1lryH00QKYGSRecCmf8"

echo "Creating test accounts in Supabase..."
echo "Supabase URL: $SUPABASE_URL"

# You need to run these SQL commands in Supabase SQL Editor manually
# because the anon key doesn't have permission to create auth users

cat << 'SQL'
-- Run these SQL commands in Supabase SQL Editor:
-- (Go to: https://app.supabase.com -> Your Project -> SQL Editor)

-- 1. Create regular user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'user@scholarspoint-test.com',
  crypt('TestPassword123!@#', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- 2. Create profile for regular user
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Test User', 'user'
FROM auth.users 
WHERE email = 'user@scholarspoint-test.com'
ON CONFLICT (id) DO UPDATE SET role = 'user';

-- 3. Create admin user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@scholarspoint-test.com',
  crypt('AdminPassword123!@#', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;

-- 4. Create profile for admin user
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Test Admin', 'admin'
FROM auth.users 
WHERE email = 'admin@scholarspoint-test.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Verify accounts were created
SELECT email, (raw_user_meta_data->>'full_name') as full_name FROM auth.users 
WHERE email LIKE '%scholarspoint-test%';

SQL

echo ""
echo "======================================================================"
echo "⚠️  MANUAL SETUP REQUIRED"
echo "======================================================================"
echo ""
echo "Test accounts creation requires manual setup in Supabase."
echo ""
echo "Steps:"
echo "1. Go to: https://app.supabase.com"
echo "2. Select your project: scholarspoint"
echo "3. Go to: SQL Editor"
echo "4. Copy and paste the SQL commands shown above"
echo "5. Click 'Run' to execute"
echo ""
echo "Test Credentials:"
echo "  Regular User:"
echo "    Email: user@scholarspoint-test.com"
echo "    Password: TestPassword123!@#"
echo ""
echo "  Admin User:"
echo "    Email: admin@scholarspoint-test.com"
echo "    Password: AdminPassword123!@#"
echo ""
echo "======================================================================"
