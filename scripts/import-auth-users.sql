-- Import auth.users + auth.identities do backup (preserva bcrypt)
-- Profiles já existem — desabilita trigger de signup temporariamente

ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, last_sign_in_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_sso_user, is_anonymous
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '2f6a658e-51cb-411f-8d4f-60316cfe491a',
    'authenticated', 'authenticated',
    'marcioteste1@gmail.com',
    '$2a$10$IUwd0S8IrziDkHBHSxP/feKVz6h6j3eNW0JZ4u3Csd3w7Y9dTeE/.',
    '2026-01-09 17:06:25.977021+00',
    '2026-01-12 03:38:31.786421+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"sub":"2f6a658e-51cb-411f-8d4f-60316cfe491a","email":"marcioteste1@gmail.com","company":"WorkShopping","full_name":"Marcio Vinicios Santos","email_verified":true,"phone_verified":false}'::jsonb,
    '2026-01-09 17:06:25.856263+00',
    '2026-01-12 03:38:31.789261+00',
    false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f893837c-d4b8-40da-9729-0b8c988fac56',
    'authenticated', 'authenticated',
    'nuviaadmcloud859402@nuvia.com',
    '$2a$10$iAgq8qldUFHCVR2d767Yse2uQWWHWwehEOuvG9.R73ZXh1IfMcUMC',
    '2026-01-12 03:45:38.426546+00',
    '2026-01-24 16:27:57.349796+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"email_verified":true}'::jsonb,
    '2026-01-12 03:45:38.376338+00',
    '2026-01-24 16:27:57.407688+00',
    false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '755ac4fc-2b9f-4f13-a97d-103cd32e5cf2',
    'authenticated', 'authenticated',
    'amilton@gmail.com',
    '$2a$10$iW5SQcv/DAAuqouJUPx3euSPpeUx76pcrmcK/KyHvvXAEgwTIdu3i',
    '2026-01-12 04:16:47.63059+00',
    '2026-01-12 04:16:47.646202+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"sub":"755ac4fc-2b9f-4f13-a97d-103cd32e5cf2","email":"amilton@gmail.com","company":"ppWord","full_name":"Amillton santos","email_verified":true,"phone_verified":false}'::jsonb,
    '2026-01-12 04:16:47.541221+00',
    '2026-01-12 17:24:00.237296+00',
    false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '740e9942-1742-4743-a450-f9efacc73bf4',
    'authenticated', 'authenticated',
    'henriquesantos@gmail.com',
    '$2a$10$vHNgkkDNBhTcUwzHztzs7edg9b/WbzkFiLRAYCpdj6MgxHFjUeU5q',
    '2026-01-12 03:53:05.738154+00',
    '2026-01-12 03:53:05.742556+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"sub":"740e9942-1742-4743-a450-f9efacc73bf4","email":"henriquesantos@gmail.com","company":"HenriWORK","full_name":"Matheus Henrique Santos","email_verified":true,"phone_verified":false}'::jsonb,
    '2026-01-12 03:53:05.72731+00',
    '2026-01-12 03:53:05.745716+00',
    false, false
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id)
VALUES
  ('2f6a658e-51cb-411f-8d4f-60316cfe491a', '2f6a658e-51cb-411f-8d4f-60316cfe491a', '{"sub":"2f6a658e-51cb-411f-8d4f-60316cfe491a","email":"marcioteste1@gmail.com","company":"WorkShopping","full_name":"Marcio Vinicios Santos","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-09 17:06:25.96849+00', '2026-01-09 17:06:25.969143+00', '2026-01-09 17:06:25.969143+00', '3a9998ac-c58e-4568-8a8d-d360b58f0568'),
  ('f893837c-d4b8-40da-9729-0b8c988fac56', 'f893837c-d4b8-40da-9729-0b8c988fac56', '{"sub":"f893837c-d4b8-40da-9729-0b8c988fac56","email":"nuviaadmcloud859402@nuvia.com","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-12 03:45:38.415858+00', '2026-01-12 03:45:38.415923+00', '2026-01-12 03:45:38.415923+00', 'c925fd22-9beb-43c1-80aa-40ca36619e9f'),
  ('740e9942-1742-4743-a450-f9efacc73bf4', '740e9942-1742-4743-a450-f9efacc73bf4', '{"sub":"740e9942-1742-4743-a450-f9efacc73bf4","email":"henriquesantos@gmail.com","company":"HenriWORK","full_name":"Matheus Henrique Santos","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-12 03:53:05.735263+00', '2026-01-12 03:53:05.735312+00', '2026-01-12 03:53:05.735312+00', '923aed74-d740-43cd-88ec-25450529caa3'),
  ('755ac4fc-2b9f-4f13-a97d-103cd32e5cf2', '755ac4fc-2b9f-4f13-a97d-103cd32e5cf2', '{"sub":"755ac4fc-2b9f-4f13-a97d-103cd32e5cf2","email":"amilton@gmail.com","company":"ppWord","full_name":"Amillton santos","email_verified":false,"phone_verified":false}'::jsonb, 'email', '2026-01-12 04:16:47.625407+00', '2026-01-12 04:16:47.625463+00', '2026-01-12 04:16:47.625463+00', '0e096353-9b87-4c4a-acc0-1369eb1b560a')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Sync roles master
UPDATE public.user_roles ur
SET role = 'master'::public.app_role
FROM public.profiles p
WHERE p.id = ur.user_id AND p.role = 'master' AND ur.role <> 'master'::public.app_role;

INSERT INTO public.user_roles (user_id, role)
SELECT p.id, 'master'::public.app_role
FROM public.profiles p
WHERE p.role = 'master'
ON CONFLICT (user_id, role) DO NOTHING;
