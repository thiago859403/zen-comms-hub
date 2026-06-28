--
-- PostgreSQL database cluster dump
--

\restrict qfU5rjKcOV3QGZYjqd1j3UxOwbuFzJvwlFCTSncVc4HJJDItkalD98L8yd2w4R6

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--


--
-- User Configurations
--

--
-- User Config "anon"
--


--
-- User Config "authenticated"
--


--
-- User Config "authenticator"
--


--
-- User Config "postgres"
--


--
-- User Config "supabase_admin"
--


--
-- User Config "supabase_auth_admin"
--


--
-- User Config "supabase_read_only_user"
--


--
-- User Config "supabase_storage_admin"
--



--
-- Role memberships
--







\unrestrict qfU5rjKcOV3QGZYjqd1j3UxOwbuFzJvwlFCTSncVc4HJJDItkalD98L8yd2w4R6

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict gzpY5xfxgh5ElERqrgZMyeITj2fGByDyK4aDaaP5fM8YAr0AhvMcx2pcBhqfG6l

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict gzpY5xfxgh5ElERqrgZMyeITj2fGByDyK4aDaaP5fM8YAr0AhvMcx2pcBhqfG6l

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict CBVgEkma6gm1lGuosqa2dtem4KlFiufXcoJVWpvpzmVouoXi4TQEcTgMvycpj7V

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--




--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--




--
--




--
--




--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--




--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--




--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--




--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--



--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'aal1',
    'aal2',
    'aal3'
);



--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    's256',
    'plain'
);



--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'unverified',
    'verified'
);



--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'totp',
    'webauthn',
    'phone'
);



--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'pending',
    'approved',
    'denied',
    'expired'
);



--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'public',
    'confidential'
);



--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'dynamic',
    'manual'
);



--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'code'
);



--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user',
    'master'
);


ALTER TYPE public.app_role OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);



--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);



--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

	column_name text,
	value text
);



--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);



--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);



--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);



--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;



--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;



--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;



--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;



--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;



--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--



--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`

    END IF;

END;
$_$;



--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--



--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;



--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--



--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;



--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;



--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $_$
    DECLARE
    BEGIN
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    THEN
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;



--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--



--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;



--
-- Name: auto_fill_empresa_id_from_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_fill_empresa_id_from_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_empresa_id BIGINT;
BEGIN
  -- Se empresa_id não está preenchido e temos created_by ou user_id, preencher automaticamente
  IF NEW.empresa_id IS NULL THEN
    IF TG_TABLE_NAME = 'agentes_ia' AND NEW.created_by IS NOT NULL THEN
      SELECT empresa_id INTO v_empresa_id
      FROM public.profiles
      WHERE id = NEW.created_by;
      
      IF v_empresa_id IS NOT NULL THEN
        NEW.empresa_id := v_empresa_id;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_fill_empresa_id_from_user() OWNER TO postgres;

--
-- Name: FUNCTION auto_fill_empresa_id_from_user(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.auto_fill_empresa_id_from_user() IS 'Trigger function que preenche automaticamente empresa_id baseado em user_id/created_by quando NULL.';


--
-- Name: current_empresa_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.current_empresa_id() RETURNS bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
$$;


ALTER FUNCTION public.current_empresa_id() OWNER TO postgres;

--
-- Name: ensure_empresa_context(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_empresa_context(p_empresa_id bigint) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NOT public.validate_empresa_access(p_empresa_id) THEN
    RAISE EXCEPTION 'Access denied: User does not have access to empresa %', p_empresa_id;
  END IF;
  RETURN true;
END;
$$;


ALTER FUNCTION public.ensure_empresa_context(p_empresa_id bigint) OWNER TO postgres;

--
-- Name: FUNCTION ensure_empresa_context(p_empresa_id bigint); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.ensure_empresa_context(p_empresa_id bigint) IS 'Garante que o usuário tem acesso à empresa. Levanta exceção se não tiver. Para uso em Edge Functions.';


--
-- Name: get_empresa_id_for_user(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_empresa_id_for_user(p_user_id uuid) RETURNS bigint
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT empresa_id 
  FROM public.profiles 
  WHERE id = p_user_id
$$;


ALTER FUNCTION public.get_empresa_id_for_user(p_user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION get_empresa_id_for_user(p_user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.get_empresa_id_for_user(p_user_id uuid) IS 'Obtém o empresa_id de um usuário. Para uso em triggers e funções.';


--
-- Name: get_or_create_uso_recursos_current_month(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_or_create_uso_recursos_current_month(p_empresa_id bigint) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_mes_referencia DATE;
  v_uso_id BIGINT;
BEGIN
  v_mes_referencia := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  SELECT id INTO v_uso_id
  FROM public.uso_recursos
  WHERE empresa_id = p_empresa_id
  AND mes_referencia = v_mes_referencia;
  
  IF v_uso_id IS NULL THEN
    INSERT INTO public.uso_recursos (empresa_id, mes_referencia)
    VALUES (p_empresa_id, v_mes_referencia)
    RETURNING id INTO v_uso_id;
  END IF;
  
  RETURN v_uso_id;
END;
$$;


ALTER FUNCTION public.get_or_create_uso_recursos_current_month(p_empresa_id bigint) OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_empresa_id BIGINT;
  plano_free_id BIGINT;
  org_name TEXT;
BEGIN
  -- Obter ID do plano Free
  SELECT id INTO plano_free_id
  FROM public.planos
  WHERE nome = 'Free'
  LIMIT 1;
  
  -- Gerar nome da empresa baseado no nome do usuário ou email
  org_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Empresa';
  
  -- Criar nova empresa
  INSERT INTO public.empresas (nome, plano_id, status, is_active)
  VALUES (
    org_name,
    plano_free_id,
    'active',
    true
  )
  RETURNING id INTO new_empresa_id;
  
  -- Criar perfil vinculado à empresa
  INSERT INTO public.profiles (id, email, full_name, company, role, empresa_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'company',
    'user',
    new_empresa_id
  )
  ON CONFLICT (id) DO UPDATE SET
    empresa_id = COALESCE(profiles.empresa_id, new_empresa_id);
  
  -- Atribuir role 'user' no sistema user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: FUNCTION handle_new_user(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil e empresa automaticamente quando um novo usuário se registra. Cada novo usuário recebe uma empresa própria com plano Free.';


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_updated_at() OWNER TO postgres;

--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


ALTER FUNCTION public.has_role(_user_id uuid, _role public.app_role) OWNER TO postgres;

--
-- Name: increment_uso_recursos(bigint, integer, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_uso_recursos(p_empresa_id bigint, p_mensagens integer DEFAULT 0, p_tokens bigint DEFAULT 0) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_mes_referencia DATE;
BEGIN
  v_mes_referencia := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  
  INSERT INTO public.uso_recursos (empresa_id, mes_referencia, mensagens_enviadas, tokens_consumidos)
  VALUES (p_empresa_id, v_mes_referencia, p_mensagens, p_tokens)
  ON CONFLICT (empresa_id, mes_referencia)
  DO UPDATE SET
    mensagens_enviadas = public.uso_recursos.mensagens_enviadas + p_mensagens,
    tokens_consumidos = public.uso_recursos.tokens_consumidos + p_tokens,
    updated_at = now();
END;
$$;


ALTER FUNCTION public.increment_uso_recursos(p_empresa_id bigint, p_mensagens integer, p_tokens bigint) OWNER TO postgres;

--
-- Name: is_master_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_master_admin(user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
    AND role = 'master'
  )
$$;


ALTER FUNCTION public.is_master_admin(user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION is_master_admin(user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.is_master_admin(user_id uuid) IS 'Verifica se o usuário é master admin.';


--
-- Name: is_user_admin_of_empresa(uuid, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_user_admin_of_empresa(_user_id uuid, _empresa_id bigint) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = _user_id 
      AND empresa_id = _empresa_id 
      AND role IN ('admin', 'master')
  )
$$;


ALTER FUNCTION public.is_user_admin_of_empresa(_user_id uuid, _empresa_id bigint) OWNER TO postgres;

--
-- Name: FUNCTION is_user_admin_of_empresa(_user_id uuid, _empresa_id bigint); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.is_user_admin_of_empresa(_user_id uuid, _empresa_id bigint) IS 'Verifica se usuário é admin/master da empresa especificada. SECURITY DEFINER para evitar recursão RLS.';


--
-- Name: is_user_admin_or_master(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_user_admin_or_master(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = _user_id) IN ('admin', 'master'),
    false
  )
$$;


ALTER FUNCTION public.is_user_admin_or_master(_user_id uuid) OWNER TO postgres;

--
-- Name: FUNCTION is_user_admin_or_master(_user_id uuid); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.is_user_admin_or_master(_user_id uuid) IS 'Verifica se usuário tem role admin ou master. SECURITY DEFINER para evitar recursão RLS.';


--
-- Name: log_auditoria(uuid, bigint, text, text, bigint, inet, text, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_auditoria(p_user_id uuid, p_empresa_id bigint, p_acao text, p_entidade_tipo text, p_entidade_id bigint DEFAULT NULL::bigint, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_audit_id BIGINT;
BEGIN
  INSERT INTO public.auditoria (
    user_id, empresa_id, acao, entidade_tipo, entidade_id,
    ip_address, user_agent, metadata
  )
  VALUES (
    p_user_id, p_empresa_id, p_acao, p_entidade_tipo, p_entidade_id,
    p_ip_address, p_user_agent, p_metadata
  )
  RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$;


ALTER FUNCTION public.log_auditoria(p_user_id uuid, p_empresa_id bigint, p_acao text, p_entidade_tipo text, p_entidade_id bigint, p_ip_address inet, p_user_agent text, p_metadata jsonb) OWNER TO postgres;

--
-- Name: user_belongs_to_empresa(uuid, bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_belongs_to_empresa(user_id uuid, empresa_id_check bigint) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = user_id 
    AND empresa_id = empresa_id_check
  )
$$;


ALTER FUNCTION public.user_belongs_to_empresa(user_id uuid, empresa_id_check bigint) OWNER TO postgres;

--
-- Name: validate_empresa_access(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.validate_empresa_access(p_empresa_id bigint) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    AND empresa_id = p_empresa_id
  )
  OR public.is_master_admin(auth.uid())
$$;


ALTER FUNCTION public.validate_empresa_access(p_empresa_id bigint) OWNER TO postgres;

--
-- Name: FUNCTION validate_empresa_access(p_empresa_id bigint); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.validate_empresa_access(p_empresa_id bigint) IS 'Valida se o usuário atual tem acesso à empresa especificada. Retorna true se o usuário pertence à empresa ou é master admin.';


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    from
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
-- previous identity values for update/delete

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        or (
                          action = 'DELETE'
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;



--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;



--
--

    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;



--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;



--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;



--
--

    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;



--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;



--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;



--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration

    -- Attempt to insert the message
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;



--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;



--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;



--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;



--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;



--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;



--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;



--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;



--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;



--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;



--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;



--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;



--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;



--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;



--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;



--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;



--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;



--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;



--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;



--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;



--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';


    RETURN NULL;
END;
$$;



--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;



--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

    END IF;

    RETURN NULL;
END;
$$;



--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;



--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;



--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;



--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';


    RETURN NULL;
END;
$$;



--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;



--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
    ELSE
    END IF;
end;
$$;



--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;



--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;



--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);



--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);



--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);



--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);



--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);



--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);



--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);



--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);



--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    client_secret_hash text,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);



--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);



--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);



--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);



--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);



--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);



--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    version character varying(255) NOT NULL
);



--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);



--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);



--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);



--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);



--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: agentes_ia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agentes_ia (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    nome text NOT NULL,
    instrucoes text NOT NULL,
    created_by uuid,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT agentes_ia_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'draft'::text])))
);


ALTER TABLE public.agentes_ia OWNER TO postgres;

--
-- Name: agentes_ia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agentes_ia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agentes_ia_id_seq OWNER TO postgres;

--
-- Name: agentes_ia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agentes_ia_id_seq OWNED BY public.agentes_ia.id;


--
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id bigint NOT NULL,
    user_id uuid,
    empresa_id bigint,
    acao text NOT NULL,
    entidade_tipo text NOT NULL,
    entidade_id bigint,
    ip_address inet,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_id_seq OWNER TO postgres;

--
-- Name: auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_id_seq OWNED BY public.auditoria.id;


--
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id bigint NOT NULL,
    nome text NOT NULL,
    plano_id bigint,
    contexto_ia jsonb DEFAULT '{}'::jsonb,
    stripe_customer_id text,
    status text DEFAULT 'active'::text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT empresas_status_check CHECK ((status = ANY (ARRAY['active'::text, 'suspended'::text, 'inactive'::text, 'pending'::text])))
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- Name: TABLE empresas; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.empresas IS 'Tabela de empresas (tenants) da plataforma NUVIA. Cada empresa é isolada via RLS.';


--
-- Name: COLUMN empresas.contexto_ia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.empresas.contexto_ia IS 'Contexto e configurações específicas de IA da empresa (JSONB).';


--
-- Name: COLUMN empresas.stripe_customer_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.empresas.stripe_customer_id IS 'ID do Customer no Stripe para gestão de assinaturas.';


--
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_seq OWNER TO postgres;

--
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- Name: org_to_empresa_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.org_to_empresa_mapping (
    org_id uuid NOT NULL,
    empresa_id bigint NOT NULL
);


ALTER TABLE public.org_to_empresa_mapping OWNER TO postgres;

--
-- Name: TABLE org_to_empresa_mapping; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.org_to_empresa_mapping IS 'Tabela de mapeamento temporária para migração de organizations (UUID) para empresas (BIGINT).';


--
-- Name: planos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planos (
    id bigint NOT NULL,
    nome text NOT NULL,
    preco_mensal numeric(10,2) DEFAULT 0 NOT NULL,
    max_usuarios integer DEFAULT 1 NOT NULL,
    max_agentes integer DEFAULT 1 NOT NULL,
    limite_mensagens_mes integer DEFAULT 1000 NOT NULL,
    stripe_price_id text,
    features jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    cor text DEFAULT '#3B82F6'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.planos OWNER TO postgres;

--
-- Name: TABLE planos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.planos IS 'Tabela de planos da plataforma NUVIA. Define limites e recursos por plano.';


--
-- Name: COLUMN planos.stripe_price_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planos.stripe_price_id IS 'ID do Price no Stripe para integração de pagamentos. Deve ser preenchido manualmente após criar no Stripe.';


--
-- Name: planos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planos_id_seq OWNER TO postgres;

--
-- Name: planos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planos_id_seq OWNED BY public.planos.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    company text,
    plan text DEFAULT 'free'::text,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    empresa_id bigint,
    role text DEFAULT 'user'::text,
    avatar_url text,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['master'::text, 'admin'::text, 'user'::text]))),
    CONSTRAINT profiles_status_check CHECK ((status = ANY (ARRAY['active'::text, 'blocked'::text, 'pending'::text])))
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: COLUMN profiles.avatar_url; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.profiles.avatar_url IS 'URL da foto de perfil do usuário armazenada no Supabase Storage';


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: uso_recursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uso_recursos (
    id bigint NOT NULL,
    empresa_id bigint NOT NULL,
    mes_referencia date NOT NULL,
    mensagens_enviadas integer DEFAULT 0 NOT NULL,
    tokens_consumidos bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.uso_recursos OWNER TO postgres;

--
-- Name: uso_recursos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.uso_recursos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.uso_recursos_id_seq OWNER TO postgres;

--
-- Name: uso_recursos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.uso_recursos_id_seq OWNED BY public.uso_recursos.id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);



--
-- Name: messages_2026_01_12; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: messages_2026_01_13; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: messages_2026_01_14; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: messages_2026_01_15; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: messages_2026_01_16; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: messages_2026_01_17; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);



--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);



--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);



--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
);



--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    name text NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);



--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);



--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);



--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);



--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);



--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text,
    created_by text,
    idempotency_key text,
    rollback text[]
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: messages_2026_01_12; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_13; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_14; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_15; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_16; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_17; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--



--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: agentes_ia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes_ia ALTER COLUMN id SET DEFAULT nextval('public.agentes_ia_id_seq'::regclass);


--
-- Name: auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria ALTER COLUMN id SET DEFAULT nextval('public.auditoria_id_seq'::regclass);


--
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- Name: planos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos ALTER COLUMN id SET DEFAULT nextval('public.planos_id_seq'::regclass);


--
-- Name: uso_recursos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uso_recursos ALTER COLUMN id SET DEFAULT nextval('public.uso_recursos_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

2f6a658e-51cb-411f-8d4f-60316cfe491a	2f6a658e-51cb-411f-8d4f-60316cfe491a	{"sub": "2f6a658e-51cb-411f-8d4f-60316cfe491a", "email": "marcioteste1@gmail.com", "company": "WorkShopping", "full_name": "Marcio Vinicios Santos", "email_verified": false, "phone_verified": false}	email	2026-01-09 17:06:25.96849+00	2026-01-09 17:06:25.969143+00	2026-01-09 17:06:25.969143+00	3a9998ac-c58e-4568-8a8d-d360b58f0568
f893837c-d4b8-40da-9729-0b8c988fac56	f893837c-d4b8-40da-9729-0b8c988fac56	{"sub": "f893837c-d4b8-40da-9729-0b8c988fac56", "email": "nuviaadmcloud859402@nuvia.com", "email_verified": false, "phone_verified": false}	email	2026-01-12 03:45:38.415858+00	2026-01-12 03:45:38.415923+00	2026-01-12 03:45:38.415923+00	c925fd22-9beb-43c1-80aa-40ca36619e9f
740e9942-1742-4743-a450-f9efacc73bf4	740e9942-1742-4743-a450-f9efacc73bf4	{"sub": "740e9942-1742-4743-a450-f9efacc73bf4", "email": "henriquesantos@gmail.com", "company": "HenriWORK", "full_name": "Matheus Henrique Santos", "email_verified": false, "phone_verified": false}	email	2026-01-12 03:53:05.735263+00	2026-01-12 03:53:05.735312+00	2026-01-12 03:53:05.735312+00	923aed74-d740-43cd-88ec-25450529caa3
755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	{"sub": "755ac4fc-2b9f-4f13-a97d-103cd32e5cf2", "email": "amilton@gmail.com", "company": "ppWord", "full_name": "Amillton santos", "email_verified": false, "phone_verified": false}	email	2026-01-12 04:16:47.625407+00	2026-01-12 04:16:47.625463+00	2026-01-12 04:16:47.625463+00	0e096353-9b87-4c4a-acc0-1369eb1b560a
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

4f0f311b-f6f4-48fc-94cd-7e6d66107a5a	2026-01-12 04:00:56.102533+00	2026-01-12 04:00:56.102533+00	password	7311f33a-659a-4552-870b-a98d3f6c8d59
dd354e28-f6a3-47c2-90f0-4e079d61e14e	2026-01-12 04:02:58.574993+00	2026-01-12 04:02:58.574993+00	password	c1003095-bb49-4c49-93c1-d18ff7bb2583
9daecd21-7ded-4a17-a6ba-0b81ff72600d	2026-01-12 04:16:47.657387+00	2026-01-12 04:16:47.657387+00	password	0d95ded3-f08b-4564-a51f-c22877ee7529
ed0c7204-25f9-4725-a80d-8bc58c213988	2026-01-12 04:28:55.732254+00	2026-01-12 04:28:55.732254+00	password	450d8f56-9a5c-4858-806a-43470b0d3fa8
eafd526c-70d3-4a29-906f-4d09785f3072	2026-01-12 17:44:27.718662+00	2026-01-12 17:44:27.718662+00	password	0e731a2f-1e0b-457c-bce7-ba46becd0ede
b8263d40-40b0-49d2-8114-59940785c967	2026-01-13 04:43:51.83535+00	2026-01-13 04:43:51.83535+00	password	60e21457-c590-4f28-8c11-a277c8c8368a
9f3c1a92-bfa3-4f22-9bf1-71689f37eec2	2026-01-13 04:59:22.550655+00	2026-01-13 04:59:22.550655+00	password	a929f578-0c04-4a77-82ff-6aebd2436584
c464e786-cdcc-4780-bfc6-fee9687f7d1d	2026-01-13 15:44:15.106662+00	2026-01-13 15:44:15.106662+00	password	4dfa1d73-549e-4358-957f-7d4de69b34d4
5029d3df-777d-4f06-b8ab-e0334ed978f4	2026-01-13 15:45:31.689254+00	2026-01-13 15:45:31.689254+00	password	9dd13595-8fc6-4c98-a204-2f25d87d5a23
b871f7e4-6c15-443b-b069-de4c97e4c042	2026-01-13 15:46:50.515023+00	2026-01-13 15:46:50.515023+00	password	a65f9e45-de7f-4dde-8e0a-5c0733249176
772cf690-88d3-4d47-9f3d-a4f4076147a6	2026-01-18 06:07:49.995466+00	2026-01-18 06:07:49.995466+00	password	8c15705d-cf40-4984-8932-fc0da92c7d0b
debb82f1-61a0-436f-9704-416f249de4e7	2026-01-19 02:20:25.596935+00	2026-01-19 02:20:25.596935+00	password	44a5e309-ef57-4407-923c-4a83943e6244
61c9cdbf-c134-4e27-8ec2-9db76a31fb82	2026-01-19 02:28:52.161567+00	2026-01-19 02:28:52.161567+00	password	b0bcc0d4-1c99-4184-ac54-6f64732d2d7b
85f18f7c-8166-4a51-a600-5b02c69d2fc1	2026-01-19 02:53:10.736482+00	2026-01-19 02:53:10.736482+00	password	9b274cdc-c6d1-426c-971c-fbfb8dc20b74
fc20bc02-81ad-47f1-9e99-604402a178d2	2026-01-19 02:59:03.876244+00	2026-01-19 02:59:03.876244+00	password	ccfdcdee-e54f-43ba-8367-9198caffcea4
945f857a-e366-41b8-9897-539629a7b967	2026-01-19 03:03:50.749083+00	2026-01-19 03:03:50.749083+00	password	f59dd6d1-e483-4fa1-ac3e-9aedcabfb4ab
2a9bac4b-a27d-49c5-9f9f-f37e0ef507bc	2026-01-19 03:11:59.220365+00	2026-01-19 03:11:59.220365+00	password	318cdb5d-b23a-45cd-86c9-08cc874f7f56
6e50c0d4-14da-4e51-b324-7739282d5440	2026-01-19 17:16:25.423157+00	2026-01-19 17:16:25.423157+00	password	5a908951-6c04-41cb-a627-96e8e80560f5
777a4a35-1034-4f31-a9c3-2befa8caa3c3	2026-01-20 04:48:13.520885+00	2026-01-20 04:48:13.520885+00	password	50e9242b-fb0f-47f1-b9f5-75a7af0fe159
5df4f5ed-797c-450b-a25b-f0d985f6b3cd	2026-01-20 17:27:53.380917+00	2026-01-20 17:27:53.380917+00	password	f47309cb-7280-4671-8ba4-2d1688ceedd7
abeae467-5b40-4a14-b192-9fb20964f2c2	2026-01-22 13:06:04.46581+00	2026-01-22 13:06:04.46581+00	password	12afa827-1456-43bf-8483-7c82d0ea04f4
49ba11a8-ece0-42a6-b6ba-172c621ab089	2026-01-22 16:20:49.387057+00	2026-01-22 16:20:49.387057+00	password	0f906694-646a-4d3f-b28c-486079087363
b21a8814-9b21-48a3-8ac6-7c698f39f4ea	2026-01-22 16:21:41.108665+00	2026-01-22 16:21:41.108665+00	password	85044f08-d4de-4d0a-b578-e34785f7b042
0b84c6df-d727-4483-918b-1900e370bef0	2026-01-22 16:21:52.345331+00	2026-01-22 16:21:52.345331+00	password	3af7f7e3-d424-4de5-afa4-146a49179e02
78cb914e-3f56-452f-bf2a-fc0d2f2593cc	2026-01-22 16:22:01.894066+00	2026-01-22 16:22:01.894066+00	password	e3da2f7f-9ddc-4b8a-b64b-c9f0b57c15e9
fb875db7-cbca-4d28-9fe1-786f7fdb6c4c	2026-01-24 16:27:57.41423+00	2026-01-24 16:27:57.41423+00	password	19894be3-850a-4ae6-a50f-8352fa1e2788
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

00000000-0000-0000-0000-000000000000	61	iqesogv6fwwz	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 04:26:58.51813+00	2026-01-14 05:25:28.831135+00	zc5qnwyua47p	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	62	guhz7ztvrvjn	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 05:25:28.847658+00	2026-01-14 06:23:58.751838+00	iqesogv6fwwz	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	63	5qfb25uwbrhn	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 06:23:58.765794+00	2026-01-14 07:22:28.844659+00	guhz7ztvrvjn	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	64	sucdbk6k7uye	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 07:22:28.861575+00	2026-01-14 08:20:58.834429+00	5qfb25uwbrhn	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	65	lkj5mhlgqzdn	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 08:20:58.847859+00	2026-01-14 09:19:28.81557+00	sucdbk6k7uye	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	57	jdoaau53d2yy	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 22:41:19.205547+00	2026-01-14 12:56:28.455123+00	w3723lynpot5	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	16	uhd5fgkudgbg	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-12 04:00:56.099898+00	2026-01-12 04:00:56.099898+00	\N	4f0f311b-f6f4-48fc-94cd-7e6d66107a5a
00000000-0000-0000-0000-000000000000	17	vik45hiuiq4s	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-12 04:02:58.562181+00	2026-01-12 04:02:58.562181+00	\N	dd354e28-f6a3-47c2-90f0-4e079d61e14e
00000000-0000-0000-0000-000000000000	19	sp6y3pruq62f	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 04:28:55.723303+00	2026-01-12 17:18:44.187864+00	\N	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	18	v7qkpz7s4im3	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	t	2026-01-12 04:16:47.650073+00	2026-01-12 17:24:00.233158+00	\N	9daecd21-7ded-4a17-a6ba-0b81ff72600d
00000000-0000-0000-0000-000000000000	21	mzc4di5cvun7	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	f	2026-01-12 17:24:00.234606+00	2026-01-12 17:24:00.234606+00	v7qkpz7s4im3	9daecd21-7ded-4a17-a6ba-0b81ff72600d
00000000-0000-0000-0000-000000000000	20	yiz6tlxba7zm	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 17:18:44.218429+00	2026-01-12 18:17:12.934485+00	sp6y3pruq62f	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	23	xtud2wecfoub	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 18:17:12.949414+00	2026-01-12 19:15:13.173136+00	yiz6tlxba7zm	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	24	5lyq6gg3dwkt	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 19:15:13.18943+00	2026-01-12 20:13:43.088387+00	xtud2wecfoub	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	25	tpa6lowhzkrx	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 20:13:43.104123+00	2026-01-12 21:12:12.990091+00	5lyq6gg3dwkt	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	26	ipiv5gizv2is	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 21:12:13.010814+00	2026-01-12 22:10:43.222666+00	tpa6lowhzkrx	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	27	b4eu4cnvownm	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 22:10:43.249556+00	2026-01-12 23:09:13.01782+00	ipiv5gizv2is	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	28	huabc55xkrtr	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 23:09:13.028833+00	2026-01-13 00:07:42.917659+00	b4eu4cnvownm	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	29	wh2ttcmnl2ki	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 00:07:42.930401+00	2026-01-13 01:05:42.96085+00	huabc55xkrtr	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	30	ho4n3wkjsisf	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 01:05:42.976556+00	2026-01-13 02:03:42.79475+00	wh2ttcmnl2ki	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	31	gvpxux5uo4sq	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 02:03:42.814965+00	2026-01-13 03:01:42.937809+00	ho4n3wkjsisf	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	22	4jlkd73evu6m	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-12 17:44:27.687697+00	2026-01-13 03:45:25.800255+00	\N	eafd526c-70d3-4a29-906f-4d09785f3072
00000000-0000-0000-0000-000000000000	33	ijp2fafbc336	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-13 03:45:25.820594+00	2026-01-13 03:45:25.820594+00	4jlkd73evu6m	eafd526c-70d3-4a29-906f-4d09785f3072
00000000-0000-0000-0000-000000000000	32	q3kx6m55vdgi	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 03:01:42.953002+00	2026-01-13 03:59:50.058679+00	gvpxux5uo4sq	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	35	ljxnztnxxw6i	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-13 04:43:51.802834+00	2026-01-13 04:43:51.802834+00	\N	b8263d40-40b0-49d2-8114-59940785c967
00000000-0000-0000-0000-000000000000	34	lznd6qmwcauo	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 03:59:50.074695+00	2026-01-13 04:58:04.808021+00	q3kx6m55vdgi	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	36	skyw7hfbyqsw	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 04:58:04.812075+00	2026-01-13 14:09:31.871702+00	lznd6qmwcauo	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	38	v2xymkcllnfy	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-13 14:09:31.898906+00	2026-01-13 14:09:31.898906+00	skyw7hfbyqsw	ed0c7204-25f9-4725-a80d-8bc58c213988
00000000-0000-0000-0000-000000000000	37	7md4467dydwh	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 04:59:22.546694+00	2026-01-13 14:10:38.900928+00	\N	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	40	haocae46pzxl	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-13 15:44:15.087865+00	2026-01-13 15:44:15.087865+00	\N	c464e786-cdcc-4780-bfc6-fee9687f7d1d
00000000-0000-0000-0000-000000000000	39	dyldqydo53j2	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 14:10:38.901863+00	2026-01-13 15:44:38.29537+00	7md4467dydwh	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	42	spubvwqxz2ym	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-13 15:45:31.68793+00	2026-01-13 15:45:31.68793+00	\N	5029d3df-777d-4f06-b8ab-e0334ed978f4
00000000-0000-0000-0000-000000000000	41	layo2tc6zt24	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 15:44:38.296368+00	2026-01-13 16:44:39.418007+00	dyldqydo53j2	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	43	5lkokqgkjtim	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 15:46:50.511043+00	2026-01-13 16:45:01.573426+00	\N	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	45	7735epyofsnk	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 16:45:01.574223+00	2026-01-13 17:43:01.87195+00	5lkokqgkjtim	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	44	httnwbendhlb	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 16:44:39.450226+00	2026-01-13 17:49:11.159887+00	layo2tc6zt24	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	46	cfwzxjnwlsyz	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 17:43:01.885214+00	2026-01-13 18:41:11.601359+00	7735epyofsnk	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	47	53ecqp6tiivv	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 17:49:11.171272+00	2026-01-13 18:47:19.247771+00	httnwbendhlb	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	48	g2d3p5sswobc	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 18:41:11.628336+00	2026-01-13 19:39:40.338926+00	cfwzxjnwlsyz	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	49	vpzltxiqpc3z	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 18:47:19.249452+00	2026-01-13 19:45:49.776929+00	53ecqp6tiivv	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	50	py672qekbkzu	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 19:39:40.354877+00	2026-01-13 20:38:10.561637+00	g2d3p5sswobc	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	51	qbwivubfvvni	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 19:45:49.787097+00	2026-01-13 20:44:19.913122+00	vpzltxiqpc3z	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	52	pnuymcbfhqkr	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 20:38:10.593597+00	2026-01-13 21:36:40.370939+00	py672qekbkzu	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	53	cr72sglblfep	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 20:44:19.927426+00	2026-01-13 21:42:49.317009+00	qbwivubfvvni	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	54	bbib7ceqfdat	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 21:36:40.390835+00	2026-01-13 22:35:10.613545+00	pnuymcbfhqkr	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	55	w3723lynpot5	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 21:42:49.325971+00	2026-01-13 22:41:19.202249+00	cr72sglblfep	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	56	v7hagxhrymvd	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-13 22:35:10.632148+00	2026-01-14 01:31:55.874252+00	bbib7ceqfdat	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	58	wogaojuqzqei	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 01:31:55.895301+00	2026-01-14 02:29:58.610827+00	v7hagxhrymvd	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	59	pfhwetep2hjo	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 02:29:58.635789+00	2026-01-14 03:28:28.593367+00	wogaojuqzqei	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	60	zc5qnwyua47p	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 03:28:28.611915+00	2026-01-14 04:26:58.505995+00	pfhwetep2hjo	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	66	jhktzuilei74	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 09:19:28.843033+00	2026-01-14 10:17:58.740092+00	lkj5mhlgqzdn	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	67	kxzummvnl7na	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 10:17:58.755187+00	2026-01-14 11:16:28.671674+00	jhktzuilei74	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	68	itg32nte47sm	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 11:16:28.686368+00	2026-01-14 12:14:58.467733+00	kxzummvnl7na	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	69	ps63xe2ir23x	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 12:14:58.480866+00	2026-01-14 13:13:00.692377+00	itg32nte47sm	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	71	b4xqnl43trfh	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 13:13:00.70405+00	2026-01-14 14:11:00.791324+00	ps63xe2ir23x	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	72	ditrh2hsx74i	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 14:11:00.808743+00	2026-01-14 15:09:00.937374+00	b4xqnl43trfh	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	73	4qtwijdfy6uf	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 15:09:00.950558+00	2026-01-14 16:07:00.7089+00	ditrh2hsx74i	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	74	p6d2d67xwdpg	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 16:07:00.720466+00	2026-01-14 17:05:00.896801+00	4qtwijdfy6uf	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	75	ncrqp23rjmmh	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 17:05:00.925737+00	2026-01-14 18:03:00.607814+00	p6d2d67xwdpg	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	70	gtnlq6uvaa5t	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 12:56:28.471865+00	2026-01-14 18:36:42.748362+00	jdoaau53d2yy	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	76	wydrxnag4k6l	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 18:03:00.621261+00	2026-01-14 19:12:46.603866+00	ncrqp23rjmmh	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	78	yd7xodbcx2at	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 19:12:46.621885+00	2026-01-14 20:10:50.353551+00	wydrxnag4k6l	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	79	5fajvpbcqbfl	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 20:10:50.368263+00	2026-01-14 21:31:43.485304+00	yd7xodbcx2at	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	77	scnz7djctv4z	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 18:36:42.760823+00	2026-01-18 06:07:40.308674+00	gtnlq6uvaa5t	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	82	mpc5gmsm6jbm	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-18 06:07:40.3361+00	2026-01-18 06:07:40.3361+00	scnz7djctv4z	9f3c1a92-bfa3-4f22-9bf1-71689f37eec2
00000000-0000-0000-0000-000000000000	83	54bp4iqkfqqz	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 06:07:49.993473+00	2026-01-18 15:28:51.044456+00	\N	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	84	abffhlaco3ru	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 15:28:51.075367+00	2026-01-18 16:27:13.519343+00	54bp4iqkfqqz	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	85	fpr5o5lmymr4	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 16:27:13.5393+00	2026-01-18 17:25:43.470726+00	abffhlaco3ru	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	86	6jusiju5q66w	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 17:25:43.485752+00	2026-01-18 18:24:13.919804+00	fpr5o5lmymr4	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	87	prv2mhdm6fh2	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 18:24:13.945018+00	2026-01-18 20:58:39.982213+00	6jusiju5q66w	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	88	bb2syrxn34ys	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-18 20:58:39.999235+00	2026-01-19 00:01:08.297995+00	prv2mhdm6fh2	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	89	x7iujbq2cq4w	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-19 00:01:08.330313+00	2026-01-19 01:32:31.213522+00	bb2syrxn34ys	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	90	ofqvxlgxb3gu	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 01:32:31.235832+00	2026-01-19 01:32:31.235832+00	x7iujbq2cq4w	772cf690-88d3-4d47-9f3d-a4f4076147a6
00000000-0000-0000-0000-000000000000	91	6pyeyw67yz5j	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 02:20:25.573676+00	2026-01-19 02:20:25.573676+00	\N	debb82f1-61a0-436f-9704-416f249de4e7
00000000-0000-0000-0000-000000000000	92	k5tu3auy6qyx	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 02:28:52.150438+00	2026-01-19 02:28:52.150438+00	\N	61c9cdbf-c134-4e27-8ec2-9db76a31fb82
00000000-0000-0000-0000-000000000000	93	gpr7xf53vllt	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 02:53:10.719086+00	2026-01-19 02:53:10.719086+00	\N	85f18f7c-8166-4a51-a600-5b02c69d2fc1
00000000-0000-0000-0000-000000000000	94	zes2c4xaowc7	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 02:59:03.870899+00	2026-01-19 02:59:03.870899+00	\N	fc20bc02-81ad-47f1-9e99-604402a178d2
00000000-0000-0000-0000-000000000000	95	zbgp2qddie5l	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 03:03:50.744397+00	2026-01-19 03:03:50.744397+00	\N	945f857a-e366-41b8-9897-539629a7b967
00000000-0000-0000-0000-000000000000	80	xtad54ea6npk	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-14 21:31:43.508986+00	2026-01-19 17:13:18.130333+00	5fajvpbcqbfl	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	96	65n7id46uwoc	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-19 03:11:59.210055+00	2026-01-19 17:12:51.150315+00	\N	2a9bac4b-a27d-49c5-9f9f-f37e0ef507bc
00000000-0000-0000-0000-000000000000	97	w2wy5hb5loyp	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 17:12:51.18368+00	2026-01-19 17:12:51.18368+00	65n7id46uwoc	2a9bac4b-a27d-49c5-9f9f-f37e0ef507bc
00000000-0000-0000-0000-000000000000	98	vmvrvxgrk5ib	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-19 17:13:18.131122+00	2026-01-19 17:13:18.131122+00	xtad54ea6npk	b871f7e4-6c15-443b-b069-de4c97e4c042
00000000-0000-0000-0000-000000000000	99	2i5mn5rd5nt6	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-19 17:16:25.393435+00	2026-01-20 04:47:39.448522+00	\N	6e50c0d4-14da-4e51-b324-7739282d5440
00000000-0000-0000-0000-000000000000	100	hg2agf5jhnek	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-20 04:47:39.477428+00	2026-01-20 04:47:39.477428+00	2i5mn5rd5nt6	6e50c0d4-14da-4e51-b324-7739282d5440
00000000-0000-0000-0000-000000000000	101	vuqxvxxxanmn	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-20 04:48:13.51887+00	2026-01-20 17:27:46.184891+00	\N	777a4a35-1034-4f31-a9c3-2befa8caa3c3
00000000-0000-0000-0000-000000000000	102	ijla4r2m4ave	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-20 17:27:46.217634+00	2026-01-20 17:27:46.217634+00	vuqxvxxxanmn	777a4a35-1034-4f31-a9c3-2befa8caa3c3
00000000-0000-0000-0000-000000000000	103	47epvwulf464	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-20 17:27:53.37839+00	2026-01-21 15:11:59.452095+00	\N	5df4f5ed-797c-450b-a25b-f0d985f6b3cd
00000000-0000-0000-0000-000000000000	104	tpjrfe42bble	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-21 15:11:59.485385+00	2026-01-22 13:05:54.864201+00	47epvwulf464	5df4f5ed-797c-450b-a25b-f0d985f6b3cd
00000000-0000-0000-0000-000000000000	105	ndov4vnuef4e	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-22 13:05:54.897867+00	2026-01-22 13:05:54.897867+00	tpjrfe42bble	5df4f5ed-797c-450b-a25b-f0d985f6b3cd
00000000-0000-0000-0000-000000000000	106	7jv4jr7slp5e	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-22 13:06:04.46296+00	2026-01-22 16:20:40.687837+00	\N	abeae467-5b40-4a14-b192-9fb20964f2c2
00000000-0000-0000-0000-000000000000	107	yboqq5lxaobw	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-22 16:20:40.714013+00	2026-01-22 16:20:40.714013+00	7jv4jr7slp5e	abeae467-5b40-4a14-b192-9fb20964f2c2
00000000-0000-0000-0000-000000000000	108	sdzrasmtmfsr	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-22 16:20:49.385545+00	2026-01-22 16:20:49.385545+00	\N	49ba11a8-ece0-42a6-b6ba-172c621ab089
00000000-0000-0000-0000-000000000000	109	noeqzch7fgk7	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-22 16:21:41.105896+00	2026-01-22 16:21:41.105896+00	\N	b21a8814-9b21-48a3-8ac6-7c698f39f4ea
00000000-0000-0000-0000-000000000000	110	2g63q5guzbb5	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-22 16:21:52.343409+00	2026-01-22 16:21:52.343409+00	\N	0b84c6df-d727-4483-918b-1900e370bef0
00000000-0000-0000-0000-000000000000	111	xurtnr5fgich	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-22 16:22:01.892704+00	2026-01-22 17:37:35.500017+00	\N	78cb914e-3f56-452f-bf2a-fc0d2f2593cc
00000000-0000-0000-0000-000000000000	112	kev45cyv6fcy	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-22 17:37:35.523741+00	2026-01-23 04:25:28.402949+00	xurtnr5fgich	78cb914e-3f56-452f-bf2a-fc0d2f2593cc
00000000-0000-0000-0000-000000000000	113	qkt2d77v22me	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-23 04:25:28.433653+00	2026-01-23 18:35:33.023619+00	kev45cyv6fcy	78cb914e-3f56-452f-bf2a-fc0d2f2593cc
00000000-0000-0000-0000-000000000000	114	y5ysec25qhlf	f893837c-d4b8-40da-9729-0b8c988fac56	t	2026-01-23 18:35:33.056213+00	2026-01-24 16:22:40.853303+00	qkt2d77v22me	78cb914e-3f56-452f-bf2a-fc0d2f2593cc
00000000-0000-0000-0000-000000000000	115	w44n446o35s2	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-24 16:22:40.882333+00	2026-01-24 16:22:40.882333+00	y5ysec25qhlf	78cb914e-3f56-452f-bf2a-fc0d2f2593cc
00000000-0000-0000-0000-000000000000	116	lnc4dyg67h3o	f893837c-d4b8-40da-9729-0b8c988fac56	f	2026-01-24 16:27:57.387177+00	2026-01-24 16:27:57.387177+00	\N	fb875db7-cbca-4d28-9fe1-786f7fdb6c4c
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

6e50c0d4-14da-4e51-b324-7739282d5440	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 17:16:25.354077+00	2026-01-20 04:47:39.513145+00	\N	aal1	\N	2026-01-20 04:47:39.512111	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
eafd526c-70d3-4a29-906f-4d09785f3072	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-12 17:44:27.64715+00	2026-01-13 03:45:29.739308+00	\N	aal1	\N	2026-01-13 03:45:29.739203	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
777a4a35-1034-4f31-a9c3-2befa8caa3c3	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-20 04:48:13.506179+00	2026-01-20 17:27:46.256452+00	\N	aal1	\N	2026-01-20 17:27:46.256331	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
b8263d40-40b0-49d2-8114-59940785c967	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 04:43:51.7556+00	2026-01-13 04:43:51.7556+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
4f0f311b-f6f4-48fc-94cd-7e6d66107a5a	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-12 04:00:56.093146+00	2026-01-12 04:00:56.093146+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.17.208.45	\N	\N	\N	\N	\N
dd354e28-f6a3-47c2-90f0-4e079d61e14e	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-12 04:02:58.541988+00	2026-01-12 04:02:58.541988+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.3.23 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36	201.17.208.45	\N	\N	\N	\N	\N
ed0c7204-25f9-4725-a80d-8bc58c213988	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-12 04:28:55.705969+00	2026-01-13 14:09:31.931821+00	\N	aal1	\N	2026-01-13 14:09:31.931678	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.3.23 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
9daecd21-7ded-4a17-a6ba-0b81ff72600d	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	2026-01-12 04:16:47.646307+00	2026-01-12 17:24:00.240427+00	\N	aal1	\N	2026-01-12 17:24:00.240317	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
9f3c1a92-bfa3-4f22-9bf1-71689f37eec2	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 04:59:22.543543+00	2026-01-18 06:07:40.372698+00	\N	aal1	\N	2026-01-18 06:07:40.371106	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
c464e786-cdcc-4780-bfc6-fee9687f7d1d	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 15:44:15.06063+00	2026-01-13 15:44:15.06063+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.3.23 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
5029d3df-777d-4f06-b8ab-e0334ed978f4	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 15:45:31.686671+00	2026-01-13 15:45:31.686671+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.3.23 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36	187.20.28.84	\N	\N	\N	\N	\N
78cb914e-3f56-452f-bf2a-fc0d2f2593cc	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-22 16:22:01.891473+00	2026-01-24 16:22:40.918419+00	\N	aal1	\N	2026-01-24 16:22:40.918308	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
5df4f5ed-797c-450b-a25b-f0d985f6b3cd	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-20 17:27:53.363386+00	2026-01-22 13:05:54.937132+00	\N	aal1	\N	2026-01-22 13:05:54.935814	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
abeae467-5b40-4a14-b192-9fb20964f2c2	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-22 13:06:04.451976+00	2026-01-22 16:20:40.734883+00	\N	aal1	\N	2026-01-22 16:20:40.734722	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
49ba11a8-ece0-42a6-b6ba-172c621ab089	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-22 16:20:49.378505+00	2026-01-22 16:20:49.378505+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
b21a8814-9b21-48a3-8ac6-7c698f39f4ea	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-22 16:21:41.104547+00	2026-01-22 16:21:41.104547+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
772cf690-88d3-4d47-9f3d-a4f4076147a6	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-18 06:07:49.978912+00	2026-01-19 01:32:31.259985+00	\N	aal1	\N	2026-01-19 01:32:31.259872	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
0b84c6df-d727-4483-918b-1900e370bef0	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-22 16:21:52.34144+00	2026-01-22 16:21:52.34144+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
debb82f1-61a0-436f-9704-416f249de4e7	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 02:20:25.528433+00	2026-01-19 02:20:25.528433+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
61c9cdbf-c134-4e27-8ec2-9db76a31fb82	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 02:28:52.134054+00	2026-01-19 02:28:52.134054+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
85f18f7c-8166-4a51-a600-5b02c69d2fc1	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 02:53:10.68629+00	2026-01-19 02:53:10.68629+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
fc20bc02-81ad-47f1-9e99-604402a178d2	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 02:59:03.868146+00	2026-01-19 02:59:03.868146+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
945f857a-e366-41b8-9897-539629a7b967	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 03:03:50.736491+00	2026-01-19 03:03:50.736491+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
2a9bac4b-a27d-49c5-9f9f-f37e0ef507bc	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-19 03:11:59.206929+00	2026-01-19 17:12:51.21623+00	\N	aal1	\N	2026-01-19 17:12:51.216119	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
b871f7e4-6c15-443b-b069-de4c97e4c042	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 15:46:50.507888+00	2026-01-19 17:13:18.136143+00	\N	aal1	\N	2026-01-19 17:13:18.136042	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/2.3.23 Chrome/138.0.7204.251 Electron/37.7.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
fb875db7-cbca-4d28-9fe1-786f7fdb6c4c	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-24 16:27:57.35116+00	2026-01-24 16:27:57.35116+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36	201.80.1.103	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

00000000-0000-0000-0000-000000000000	2f6a658e-51cb-411f-8d4f-60316cfe491a	authenticated	authenticated	marcioteste1@gmail.com	$2a$10$IUwd0S8IrziDkHBHSxP/feKVz6h6j3eNW0JZ4u3Csd3w7Y9dTeE/.	2026-01-09 17:06:25.977021+00	\N		\N		\N			\N	2026-01-12 03:38:31.786421+00	{"provider": "email", "providers": ["email"]}	{"sub": "2f6a658e-51cb-411f-8d4f-60316cfe491a", "email": "marcioteste1@gmail.com", "company": "WorkShopping", "full_name": "Marcio Vinicios Santos", "email_verified": true, "phone_verified": false}	\N	2026-01-09 17:06:25.856263+00	2026-01-12 03:38:31.789261+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	f893837c-d4b8-40da-9729-0b8c988fac56	authenticated	authenticated	nuviaadmcloud859402@nuvia.com	$2a$10$iAgq8qldUFHCVR2d767Yse2uQWWHWwehEOuvG9.R73ZXh1IfMcUMC	2026-01-12 03:45:38.426546+00	\N		\N		\N			\N	2026-01-24 16:27:57.349796+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-01-12 03:45:38.376338+00	2026-01-24 16:27:57.407688+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	authenticated	authenticated	amilton@gmail.com	$2a$10$iW5SQcv/DAAuqouJUPx3euSPpeUx76pcrmcK/KyHvvXAEgwTIdu3i	2026-01-12 04:16:47.63059+00	\N		\N		\N			\N	2026-01-12 04:16:47.646202+00	{"provider": "email", "providers": ["email"]}	{"sub": "755ac4fc-2b9f-4f13-a97d-103cd32e5cf2", "email": "amilton@gmail.com", "company": "ppWord", "full_name": "Amillton santos", "email_verified": true, "phone_verified": false}	\N	2026-01-12 04:16:47.541221+00	2026-01-12 17:24:00.237296+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	740e9942-1742-4743-a450-f9efacc73bf4	authenticated	authenticated	henriquesantos@gmail.com	$2a$10$vHNgkkDNBhTcUwzHztzs7edg9b/WbzkFiLRAYCpdj6MgxHFjUeU5q	2026-01-12 03:53:05.738154+00	\N		\N		\N			\N	2026-01-12 03:53:05.742556+00	{"provider": "email", "providers": ["email"]}	{"sub": "740e9942-1742-4743-a450-f9efacc73bf4", "email": "henriquesantos@gmail.com", "company": "HenriWORK", "full_name": "Matheus Henrique Santos", "email_verified": true, "phone_verified": false}	\N	2026-01-12 03:53:05.72731+00	2026-01-12 03:53:05.745716+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: agentes_ia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.agentes_ia (id, empresa_id, nome, instrucoes, created_by, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auditoria (id, user_id, empresa_id, acao, entidade_tipo, entidade_id, ip_address, user_agent, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.empresas (id, nome, plano_id, contexto_ia, stripe_customer_id, status, is_active, created_at, updated_at) FROM stdin;
2	nuviaadmcloud859402's Empresa	4	{}	\N	active	t	2026-01-12 03:45:38.374551+00	2026-01-12 03:49:56.04513+00
1	Marcio Vinicios Santos's Empresa	4	{}	\N	suspended	f	2026-01-09 17:06:25.855841+00	2026-01-12 03:50:20.760535+00
3	Matheus Henrique Santos's Empresa	1	{}	\N	active	t	2026-01-12 03:53:05.726944+00	2026-01-12 03:53:05.726944+00
4	Amillton santos's Empresa	1	{}	\N	active	t	2026-01-12 04:16:47.54013+00	2026-01-12 04:16:47.54013+00
\.


--
-- Data for Name: org_to_empresa_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.org_to_empresa_mapping (org_id, empresa_id) FROM stdin;
\.


--
-- Data for Name: planos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.planos (id, nome, preco_mensal, max_usuarios, max_agentes, limite_mensagens_mes, stripe_price_id, features, is_active, cor, created_at, updated_at) FROM stdin;
1	Free	0.00	1	1	1000	\N	{"whatsapp": true, "ia_basica": true, "instagram": false, "suporte_email": true}	t	#6B7280	2026-01-09 16:06:50.217718+00	2026-01-09 16:06:50.217718+00
2	Pro	99.00	5	3	10000	\N	{"whatsapp": true, "instagram": true, "relatorios": true, "ia_avancada": true, "suporte_prioritario": true}	t	#3B82F6	2026-01-09 16:06:50.217718+00	2026-01-09 16:06:50.217718+00
3	Business	299.00	20	10	50000	\N	{"whatsapp": true, "instagram": true, "api_access": true, "relatorios": true, "ia_avancada": true, "white_label": false, "suporte_prioritario": true}	t	#8B5CF6	2026-01-09 16:06:50.217718+00	2026-01-09 16:06:50.217718+00
4	Enterprise	999.00	100	50	200000	\N	{"whatsapp": true, "instagram": true, "api_access": true, "relatorios": true, "ia_avancada": true, "white_label": true, "dedicated_support": true, "suporte_prioritario": true}	t	#F59E0B	2026-01-09 16:06:50.217718+00	2026-01-09 16:06:50.217718+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, email, full_name, company, plan, status, created_at, updated_at, last_login, empresa_id, role, avatar_url) FROM stdin;
2f6a658e-51cb-411f-8d4f-60316cfe491a	marcioteste1@gmail.com	Marcio Vinicios Santos	WorkShopping	free	active	2026-01-09 17:06:25.855841+00	2026-01-12 03:40:02.435829+00	2026-01-12 03:38:32.098+00	1	master	\N
740e9942-1742-4743-a450-f9efacc73bf4	henriquesantos@gmail.com	Matheus Henrique Santos	HenriWORK	free	active	2026-01-12 03:53:05.726944+00	2026-01-12 03:53:05.726944+00	\N	3	user	\N
f893837c-d4b8-40da-9729-0b8c988fac56	nuviaadmcloud859402@nuvia.com		\N	free	active	2026-01-12 03:45:38.374551+00	2026-01-24 16:27:58.094937+00	2026-01-24 16:27:58.099+00	\N	master	https://zlqpgxvmiqadavimqtns.supabase.co/storage/v1/object/public/avatars/avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768716539511.png
755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	amilton@gmail.com	Amillton santos	ppWord	free	active	2026-01-12 04:16:47.54013+00	2026-01-12 04:16:47.54013+00	\N	4	user	\N
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, role) FROM stdin;
026dda10-1447-4336-8a94-96498567834c	2f6a658e-51cb-411f-8d4f-60316cfe491a	user
7e316b00-eb5c-4f2d-a0a1-ae4594f6d36c	f893837c-d4b8-40da-9729-0b8c988fac56	user
c2a1cbfa-7a50-4ad2-ba03-b6778778352a	740e9942-1742-4743-a450-f9efacc73bf4	user
b4ccd7d5-e368-40ea-aaf8-d5cdd731d800	755ac4fc-2b9f-4f13-a97d-103cd32e5cf2	user
\.


--
-- Data for Name: uso_recursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uso_recursos (id, empresa_id, mes_referencia, mensagens_enviadas, tokens_consumidos, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages_2026_01_12; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: messages_2026_01_13; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: messages_2026_01_14; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: messages_2026_01_15; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: messages_2026_01_16; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: messages_2026_01_17; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

20211116024918	2026-01-09 13:06:21
20211116045059	2026-01-09 13:06:23
20211116050929	2026-01-09 13:06:24
20211116051442	2026-01-09 13:06:25
20211116212300	2026-01-09 13:06:26
20211116213355	2026-01-09 13:06:27
20211116213934	2026-01-09 13:06:29
20211116214523	2026-01-09 13:06:30
20211122062447	2026-01-09 13:06:31
20211124070109	2026-01-09 13:06:32
20211202204204	2026-01-09 13:06:33
20211202204605	2026-01-09 13:06:35
20211210212804	2026-01-09 13:06:38
20211228014915	2026-01-09 13:06:39
20220107221237	2026-01-09 13:06:40
20220228202821	2026-01-09 13:06:42
20220312004840	2026-01-09 13:06:43
20220603231003	2026-01-09 13:06:44
20220603232444	2026-01-09 13:06:46
20220615214548	2026-01-09 13:06:47
20220712093339	2026-01-09 13:06:48
20220908172859	2026-01-09 13:06:49
20220916233421	2026-01-09 13:06:50
20230119133233	2026-01-09 13:06:51
20230128025114	2026-01-09 13:06:53
20230128025212	2026-01-09 13:06:54
20230227211149	2026-01-09 13:06:55
20230228184745	2026-01-09 13:06:56
20230308225145	2026-01-09 13:06:57
20230328144023	2026-01-09 13:06:59
20231018144023	2026-01-09 13:07:00
20231204144023	2026-01-09 13:07:02
20231204144024	2026-01-09 13:07:03
20231204144025	2026-01-09 13:07:04
20240108234812	2026-01-09 13:07:05
20240109165339	2026-01-09 13:07:06
20240227174441	2026-01-09 13:07:08
20240311171622	2026-01-09 13:07:10
20240321100241	2026-01-09 13:07:12
20240401105812	2026-01-09 13:07:15
20240418121054	2026-01-09 13:07:17
20240523004032	2026-01-09 13:07:21
20240618124746	2026-01-09 13:07:22
20240801235015	2026-01-09 13:07:23
20240805133720	2026-01-09 13:07:24
20240827160934	2026-01-09 13:07:26
20240919163303	2026-01-09 13:07:27
20240919163305	2026-01-09 13:07:28
20241019105805	2026-01-09 13:07:29
20241030150047	2026-01-09 13:07:34
20241108114728	2026-01-09 13:07:35
20241121104152	2026-01-09 13:07:36
20241130184212	2026-01-09 13:07:38
20241220035512	2026-01-09 13:07:39
20241220123912	2026-01-09 13:07:40
20241224161212	2026-01-09 13:07:41
20250107150512	2026-01-09 13:07:42
20250110162412	2026-01-09 13:07:43
20250123174212	2026-01-09 13:07:44
20250128220012	2026-01-09 13:07:45
20250506224012	2026-01-09 13:07:46
20250523164012	2026-01-09 13:07:47
20250714121412	2026-01-09 13:07:49
20250905041441	2026-01-09 13:07:50
20251103001201	2026-01-09 13:07:51
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

avatars	avatars	\N	2026-01-13 17:28:21.522353+00	2026-01-13 17:28:21.522353+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-01-09 13:06:23.412165
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-01-09 13:06:23.420897
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2026-01-09 13:06:23.424087
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-01-09 13:06:23.440808
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-01-09 13:06:23.486978
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-01-09 13:06:23.490156
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2026-01-09 13:06:23.493683
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-01-09 13:06:23.497391
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-01-09 13:06:23.500047
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2026-01-09 13:06:23.503207
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2026-01-09 13:06:23.506243
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-01-09 13:06:23.510008
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-01-09 13:06:23.513464
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-01-09 13:06:23.516192
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-01-09 13:06:23.519136
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-01-09 13:06:23.537677
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-01-09 13:06:23.542813
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-01-09 13:06:23.545829
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-01-09 13:06:23.54891
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-01-09 13:06:23.553434
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-01-09 13:06:23.556211
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-01-09 13:06:23.562207
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-01-09 13:06:23.575145
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-01-09 13:06:23.590506
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-01-09 13:06:23.59396
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-01-09 13:06:23.598825
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2026-01-09 13:06:23.602178
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2026-01-09 13:06:23.613568
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2026-01-09 13:06:23.711728
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2026-01-09 13:06:23.716187
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2026-01-09 13:06:23.719906
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2026-01-09 13:06:23.725778
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2026-01-09 13:06:23.732154
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2026-01-09 13:06:23.737797
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2026-01-09 13:06:23.739822
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2026-01-09 13:06:23.745578
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2026-01-09 13:06:23.748016
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-01-09 13:06:23.753164
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2026-01-09 13:06:23.756414
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2026-01-09 13:06:23.763195
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2026-01-09 13:06:23.766335
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2026-01-09 13:06:23.773093
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2026-01-09 13:06:23.777045
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2026-01-09 13:06:23.781839
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-01-09 13:06:23.7848
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-01-09 13:06:23.787865
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-01-09 13:06:23.798167
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-01-09 13:06:23.80121
48	iceberg-catalog-ids	2666dff93346e5d04e0a878416be1d5fec345d6f	2026-01-09 13:06:23.803595
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-01-09 13:06:23.817741
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

3902579c-2758-46d0-aefc-ff8143ebc28c	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768325804494.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 17:36:44.986178+00	2026-01-13 17:36:44.986178+00	2026-01-13 17:36:44.986178+00	{"eTag": "\\"c94baf3d8e590baa679ff4b58b75af30\\"", "size": 1010492, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:36:45.000Z", "contentLength": 1010492, "httpStatusCode": 200}	b4f704c1-ade7-4ed8-8f7b-40ad910392f8	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
ae394116-aedd-49b3-97fa-da0385c04ee9	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768326558899.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 17:49:19.228997+00	2026-01-13 17:49:19.228997+00	2026-01-13 17:49:19.228997+00	{"eTag": "\\"c94baf3d8e590baa679ff4b58b75af30\\"", "size": 1010492, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:49:20.000Z", "contentLength": 1010492, "httpStatusCode": 200}	341955dd-2e9f-46b1-a085-0687c0ee55b6	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
7af0a7af-2461-403a-a497-5c30aff09ea5	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768327001421.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 17:56:41.924487+00	2026-01-13 17:56:41.924487+00	2026-01-13 17:56:41.924487+00	{"eTag": "\\"7226ad529d5264a7ce5e43b28c4b256d\\"", "size": 649706, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:56:42.000Z", "contentLength": 649706, "httpStatusCode": 200}	294d7118-4644-4736-97b7-5edb65abee1f	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
059c4f5c-e5de-4559-a834-42f399b4d76d	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768327013316.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 17:56:53.564327+00	2026-01-13 17:56:53.564327+00	2026-01-13 17:56:53.564327+00	{"eTag": "\\"c94baf3d8e590baa679ff4b58b75af30\\"", "size": 1010492, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T17:56:54.000Z", "contentLength": 1010492, "httpStatusCode": 200}	339e3b7a-ceaf-4ab2-8500-0fec5177fe0c	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
f11efabc-c6ec-4cab-8cf6-c8e9be2d80d2	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768327341010.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-13 18:02:21.652212+00	2026-01-13 18:02:21.652212+00	2026-01-13 18:02:21.652212+00	{"eTag": "\\"7226ad529d5264a7ce5e43b28c4b256d\\"", "size": 649706, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-13T18:02:22.000Z", "contentLength": 649706, "httpStatusCode": 200}	11f4c3bf-9479-4585-9b4a-7e78d97eb6d9	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
d51bf1c1-c0d8-4543-9fc9-7b47c922c713	avatars	avatars/f893837c-d4b8-40da-9729-0b8c988fac56-1768716539511.png	f893837c-d4b8-40da-9729-0b8c988fac56	2026-01-18 06:09:03.361026+00	2026-01-18 06:09:03.361026+00	2026-01-18 06:09:03.361026+00	{"eTag": "\\"c94baf3d8e590baa679ff4b58b75af30\\"", "size": 1010492, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-01-18T06:09:04.000Z", "contentLength": 1010492, "httpStatusCode": 200}	c706120d-1c1f-47c9-96b9-227e10e0d3a0	f893837c-d4b8-40da-9729-0b8c988fac56	{}	2
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

avatars	avatars	2026-01-13 17:36:44.986178+00	2026-01-13 17:36:44.986178+00
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name, created_by, idempotency_key, rollback) FROM stdin;
20260109160650	{"-- =====================================================\n-- ÉPICO 1.1 - User Story 1.1.1\n-- Criar tabela planos conforme PRD\n-- =====================================================\n\n-- Criar tabela planos\nCREATE TABLE IF NOT EXISTS public.planos (\n  id BIGSERIAL PRIMARY KEY,\n  nome TEXT NOT NULL UNIQUE,\n  preco_mensal DECIMAL(10, 2) NOT NULL DEFAULT 0,\n  max_usuarios INTEGER NOT NULL DEFAULT 1,\n  max_agentes INTEGER NOT NULL DEFAULT 1,\n  limite_mensagens_mes INTEGER NOT NULL DEFAULT 1000,\n  stripe_price_id TEXT UNIQUE,\n  features JSONB DEFAULT '{}'::jsonb,\n  is_active BOOLEAN DEFAULT true,\n  cor TEXT DEFAULT '#3B82F6',\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- Criar índice para busca por nome\nCREATE INDEX IF NOT EXISTS idx_planos_nome ON public.planos(nome);\nCREATE INDEX IF NOT EXISTS idx_planos_is_active ON public.planos(is_active);\nCREATE INDEX IF NOT EXISTS idx_planos_stripe_price_id ON public.planos(stripe_price_id);\n\n-- Criar função handle_updated_at se não existir\nCREATE OR REPLACE FUNCTION public.handle_updated_at()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$;\n\n-- Habilitar RLS\nALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;\n\n-- Políticas RLS para planos\n-- Todos usuários autenticados podem ler planos ativos\nCREATE POLICY \\"Authenticated users can view active plans\\"\n  ON public.planos FOR SELECT\n  TO authenticated\n  USING (is_active = true);\n\n-- Criar enum app_role se não existir\nDO $$ BEGIN\n  CREATE TYPE public.app_role AS ENUM ('admin', 'user');\nEXCEPTION\n  WHEN duplicate_object THEN null;\nEND $$;\n\n-- Apenas admins podem inserir/atualizar (temporário, será refinado)\nCREATE POLICY \\"Admins can manage plans\\"\n  ON public.planos FOR ALL\n  TO authenticated\n  USING (true)\n  WITH CHECK (true);\n\n-- Trigger para updated_at\nCREATE TRIGGER update_planos_updated_at\n  BEFORE UPDATE ON public.planos\n  FOR EACH ROW\n  EXECUTE FUNCTION public.handle_updated_at();\n\n-- Inserir planos padrão\nINSERT INTO public.planos (nome, preco_mensal, max_usuarios, max_agentes, limite_mensagens_mes, features, cor) VALUES\n  (\n    'Free',\n    0.00,\n    1,\n    1,\n    1000,\n    '{\\"whatsapp\\": true, \\"instagram\\": false, \\"ia_basica\\": true, \\"suporte_email\\": true}'::jsonb,\n    '#6B7280'\n  ),\n  (\n    'Pro',\n    99.00,\n    5,\n    3,\n    10000,\n    '{\\"whatsapp\\": true, \\"instagram\\": true, \\"ia_avancada\\": true, \\"suporte_prioritario\\": true, \\"relatorios\\": true}'::jsonb,\n    '#3B82F6'\n  ),\n  (\n    'Business',\n    299.00,\n    20,\n    10,\n    50000,\n    '{\\"whatsapp\\": true, \\"instagram\\": true, \\"ia_avancada\\": true, \\"suporte_prioritario\\": true, \\"relatorios\\": true, \\"api_access\\": true, \\"white_label\\": false}'::jsonb,\n    '#8B5CF6'\n  ),\n  (\n    'Enterprise',\n    999.00,\n    100,\n    50,\n    200000,\n    '{\\"whatsapp\\": true, \\"instagram\\": true, \\"ia_avancada\\": true, \\"suporte_prioritario\\": true, \\"relatorios\\": true, \\"api_access\\": true, \\"white_label\\": true, \\"dedicated_support\\": true}'::jsonb,\n    '#F59E0B'\n  )\nON CONFLICT (nome) DO NOTHING;\n\nCOMMENT ON TABLE public.planos IS 'Tabela de planos da plataforma NUVIA. Define limites e recursos por plano.';\nCOMMENT ON COLUMN public.planos.stripe_price_id IS 'ID do Price no Stripe para integração de pagamentos. Deve ser preenchido manualmente após criar no Stripe.';\n"}	create_planos_table	thiagoguimaraes0311@gmail.com	\N	\N
20260109161005	{"-- =====================================================\n-- ÉPICO 1.1 - User Story 1.1.2\n-- Criar tabela empresas (tenants) conforme PRD\n-- Migrar dados de organizations para empresas (se existir)\n-- =====================================================\n\n-- Criar tabela empresas\nCREATE TABLE IF NOT EXISTS public.empresas (\n  id BIGSERIAL PRIMARY KEY,\n  nome TEXT NOT NULL,\n  plano_id BIGINT REFERENCES public.planos(id) ON DELETE SET NULL,\n  contexto_ia JSONB DEFAULT '{}'::jsonb,\n  stripe_customer_id TEXT UNIQUE,\n  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive', 'pending')),\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- Criar índices\nCREATE INDEX IF NOT EXISTS idx_empresas_nome ON public.empresas(nome);\nCREATE INDEX IF NOT EXISTS idx_empresas_plano_id ON public.empresas(plano_id);\nCREATE INDEX IF NOT EXISTS idx_empresas_status ON public.empresas(status);\nCREATE INDEX IF NOT EXISTS idx_empresas_is_active ON public.empresas(is_active);\nCREATE INDEX IF NOT EXISTS idx_empresas_stripe_customer_id ON public.empresas(stripe_customer_id);\n\n-- Habilitar RLS (políticas serão criadas no ÉPICO 1.2)\nALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;\n\n-- Trigger para updated_at\nCREATE TRIGGER update_empresas_updated_at\n  BEFORE UPDATE ON public.empresas\n  FOR EACH ROW\n  EXECUTE FUNCTION public.handle_updated_at();\n\n-- Criar tabela de mapeamento organizations -> empresas (para migração)\nCREATE TABLE IF NOT EXISTS public.org_to_empresa_mapping (\n  org_id UUID NOT NULL,\n  empresa_id BIGINT NOT NULL,\n  PRIMARY KEY (org_id, empresa_id),\n  FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE\n);\n\n-- Migrar dados de organizations para empresas (apenas se organizations existir)\nDO $$\nDECLARE\n  org_record RECORD;\n  new_empresa_id BIGINT;\n  plano_id_mapped BIGINT;\n  organizations_exists BOOLEAN;\nBEGIN\n  -- Verificar se tabela organizations existe\n  SELECT EXISTS (\n    SELECT 1 FROM information_schema.tables \n    WHERE table_schema = 'public' AND table_name = 'organizations'\n  ) INTO organizations_exists;\n  \n  IF organizations_exists THEN\n    FOR org_record IN \n      SELECT id, name, plan, settings, created_at, updated_at \n      FROM public.organizations\n    LOOP\n      -- Mapear plan antigo para novo plano_id\n      SELECT id INTO plano_id_mapped\n      FROM public.planos\n      WHERE LOWER(nome) = LOWER(org_record.plan)\n      LIMIT 1;\n      \n      -- Se não encontrar plano, usar Free como padrão\n      IF plano_id_mapped IS NULL THEN\n        SELECT id INTO plano_id_mapped FROM public.planos WHERE nome = 'Free' LIMIT 1;\n      END IF;\n      \n      -- Inserir nova empresa\n      INSERT INTO public.empresas (nome, plano_id, contexto_ia, status, is_active, created_at, updated_at)\n      VALUES (\n        org_record.name,\n        plano_id_mapped,\n        COALESCE(org_record.settings, '{}'::jsonb),\n        'active',\n        true,\n        org_record.created_at,\n        org_record.updated_at\n      )\n      RETURNING id INTO new_empresa_id;\n      \n      -- Criar mapeamento\n      INSERT INTO public.org_to_empresa_mapping (org_id, empresa_id)\n      VALUES (org_record.id, new_empresa_id)\n      ON CONFLICT DO NOTHING;\n    END LOOP;\n  END IF;\nEND $$;\n\nCOMMENT ON TABLE public.empresas IS 'Tabela de empresas (tenants) da plataforma NUVIA. Cada empresa é isolada via RLS.';\nCOMMENT ON COLUMN public.empresas.contexto_ia IS 'Contexto e configurações específicas de IA da empresa (JSONB).';\nCOMMENT ON COLUMN public.empresas.stripe_customer_id IS 'ID do Customer no Stripe para gestão de assinaturas.';\nCOMMENT ON TABLE public.org_to_empresa_mapping IS 'Tabela de mapeamento temporária para migração de organizations (UUID) para empresas (BIGINT).';\n"}	create_empresas_table	thiagoguimaraes0311@gmail.com	\N	\N
20260109161400	{"-- =====================================================\n-- ÉPICO 1.2 - User Story 1.2.4\n-- Preparação e documentação RLS para tabelas relacionadas\n-- Estas políticas serão aplicadas quando as tabelas forem criadas\n-- =====================================================\n\n-- Esta migration apenas documenta como aplicar RLS quando as tabelas relacionadas forem criadas\n-- Não cria funções que dependem de tabelas inexistentes\n\n-- Quando a tabela 'conversations' for criada/atualizada:\n-- 1. Adicionar campo empresa_id se não existir:\n--    ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS empresa_id BIGINT REFERENCES public.empresas(id);\n-- 2. Aplicar RLS:\n--    CREATE POLICY \\"Users can view conversations in empresa\\"\n--    ON public.conversations FOR SELECT TO authenticated\n--    USING (empresa_id = public.current_empresa_id());\n\n-- Quando a tabela 'messages' for criada/atualizada:\n-- 1. Adicionar empresa_id via JOIN com conversations ou adicionar campo direto\n-- 2. Aplicar RLS usando JOIN:\n--    CREATE POLICY \\"Users can view messages in empresa\\"\n--    ON public.messages FOR SELECT TO authenticated\n--    USING (\n--      EXISTS (\n--        SELECT 1 FROM public.conversations c\n--        WHERE c.id = messages.conversation_id\n--        AND c.empresa_id = public.current_empresa_id()\n--      )\n--    );\n\n-- Quando a tabela 'message_templates' for criada/atualizada:\n-- 1. Adicionar campo empresa_id:\n--    ALTER TABLE public.message_templates ADD COLUMN IF NOT EXISTS empresa_id BIGINT REFERENCES public.empresas(id);\n-- 2. Aplicar RLS:\n--    CREATE POLICY \\"Users can view templates in empresa\\"\n--    ON public.message_templates FOR SELECT TO authenticated\n--    USING (empresa_id = public.current_empresa_id());\n\n-- Quando outras tabelas relacionadas (tags, queues, etc.) forem criadas:\n-- 1. Adicionar campo empresa_id se necessário\n-- 2. Aplicar RLS seguindo o mesmo padrão: filtrar por empresa_id = current_empresa_id()\n\n-- Esta migration não cria objetos, apenas documenta o processo\nSELECT 1 as documentation_complete;\n"}	rls_related_tables_preparation	thiagoguimaraes0311@gmail.com	\N	\N
20260109163715	{"-- =====================================================\n-- Correção: Criar empresa automaticamente no signup\n-- =====================================================\n\n-- Atualizar função handle_new_user para criar empresa automaticamente\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = public\nAS $$\nDECLARE\n  new_empresa_id BIGINT;\n  plano_free_id BIGINT;\n  org_name TEXT;\nBEGIN\n  -- Obter ID do plano Free\n  SELECT id INTO plano_free_id\n  FROM public.planos\n  WHERE nome = 'Free'\n  LIMIT 1;\n  \n  -- Gerar nome da empresa baseado no nome do usuário ou email\n  org_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Empresa';\n  \n  -- Criar nova empresa\n  INSERT INTO public.empresas (nome, plano_id, status, is_active)\n  VALUES (\n    org_name,\n    plano_free_id,\n    'active',\n    true\n  )\n  RETURNING id INTO new_empresa_id;\n  \n  -- Criar perfil vinculado à empresa\n  INSERT INTO public.profiles (id, email, full_name, company, role, empresa_id)\n  VALUES (\n    NEW.id,\n    NEW.email,\n    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),\n    NEW.raw_user_meta_data->>'company',\n    'user',\n    new_empresa_id\n  )\n  ON CONFLICT (id) DO UPDATE SET\n    empresa_id = COALESCE(profiles.empresa_id, new_empresa_id);\n  \n  -- Atribuir role 'user' no sistema user_roles\n  INSERT INTO public.user_roles (user_id, role)\n  VALUES (NEW.id, 'user')\n  ON CONFLICT (user_id, role) DO NOTHING;\n  \n  RETURN NEW;\nEND;\n$$;\n\nCOMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil e empresa automaticamente quando um novo usuário se registra. Cada novo usuário recebe uma empresa própria com plano Free.';\n"}	fix_signup_create_empresa	thiagoguimaraes0311@gmail.com	\N	\N
20260111221039	{"-- =====================================================\n-- OTIMIZAÇÃO: Remover política duplicada e garantir que não há recursão\n-- =====================================================\n\n-- A política \\"Empresa admins can view profiles in empresa\\" é redundante\n-- porque \\"Users can view profiles in same empresa\\" já permite ver perfis da mesma empresa\n-- Vamos remover a duplicada para simplificar\nDROP POLICY IF EXISTS \\"Empresa admins can view profiles in empresa\\" ON public.profiles;\n\n-- Manter apenas a política de gerenciamento para admins\n-- A política \\"Empresa admins can manage profiles in empresa\\" já está correta e usa SECURITY DEFINER"}	optimize_rls_profiles_policies	thiagoguimaraes0311@gmail.com	\N	\N
20260113170531	{"-- Adicionar coluna avatar_url na tabela profiles\nALTER TABLE public.profiles \nADD COLUMN IF NOT EXISTS avatar_url TEXT;\n\n-- Comentário na coluna\nCOMMENT ON COLUMN public.profiles.avatar_url IS 'URL da foto de perfil do usuário armazenada no Supabase Storage';"}	add_avatar_url_to_profiles	thiagoguimaraes0311@gmail.com	\N	\N
20260113173034	{"-- Corrigir política RLS para permitir que usuários atualizem avatar_url no próprio perfil\n-- A política existente \\"Usuários podem atualizar próprio perfil\\" deve permitir atualização de avatar_url\n\n-- Remover política existente se houver problema\nDROP POLICY IF EXISTS \\"Usuários podem atualizar próprio perfil\\" ON public.profiles;\n\n-- Recriar política de UPDATE para permitir que usuários atualizem seu próprio perfil\n-- Isso deve incluir todos os campos, incluindo avatar_url\nCREATE POLICY \\"Usuários podem atualizar próprio perfil\\"\n  ON public.profiles FOR UPDATE\n  TO authenticated\n  USING (auth.uid() = id)\n  WITH CHECK (auth.uid() = id);"}	fix_rls_profiles_update_avatar_url	thiagoguimaraes0311@gmail.com	\N	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 116, true);


--
-- Name: agentes_ia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.agentes_ia_id_seq', 1, false);


--
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_id_seq', 1, false);


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 4, true);


--
-- Name: planos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.planos_id_seq', 4, true);


--
-- Name: uso_recursos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.uso_recursos_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: agentes_ia agentes_ia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes_ia
    ADD CONSTRAINT agentes_ia_pkey PRIMARY KEY (id);


--
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- Name: empresas empresas_stripe_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_stripe_customer_id_key UNIQUE (stripe_customer_id);


--
-- Name: org_to_empresa_mapping org_to_empresa_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_to_empresa_mapping
    ADD CONSTRAINT org_to_empresa_mapping_pkey PRIMARY KEY (org_id, empresa_id);


--
-- Name: planos planos_nome_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos
    ADD CONSTRAINT planos_nome_key UNIQUE (nome);


--
-- Name: planos planos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos
    ADD CONSTRAINT planos_pkey PRIMARY KEY (id);


--
-- Name: planos planos_stripe_price_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos
    ADD CONSTRAINT planos_stripe_price_id_key UNIQUE (stripe_price_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: agentes_ia unique_agente_nome_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes_ia
    ADD CONSTRAINT unique_agente_nome_empresa UNIQUE (empresa_id, nome);


--
-- Name: uso_recursos unique_empresa_mes; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uso_recursos
    ADD CONSTRAINT unique_empresa_mes UNIQUE (empresa_id, mes_referencia);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: uso_recursos uso_recursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uso_recursos
    ADD CONSTRAINT uso_recursos_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_12 messages_2026_01_12_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_12_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_13 messages_2026_01_13_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_13_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_14 messages_2026_01_14_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_14_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_15 messages_2026_01_15_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_15_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_16 messages_2026_01_16_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_16_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_01_17 messages_2026_01_17_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT messages_2026_01_17_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_idempotency_key_key UNIQUE (idempotency_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: idx_agentes_ia_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agentes_ia_created_by ON public.agentes_ia USING btree (created_by);


--
-- Name: idx_agentes_ia_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agentes_ia_empresa_id ON public.agentes_ia USING btree (empresa_id);


--
-- Name: idx_agentes_ia_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agentes_ia_status ON public.agentes_ia USING btree (status);


--
-- Name: idx_auditoria_acao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_acao ON public.auditoria USING btree (acao);


--
-- Name: idx_auditoria_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_created_at ON public.auditoria USING btree (created_at DESC);


--
-- Name: idx_auditoria_empresa_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_empresa_created ON public.auditoria USING btree (empresa_id, created_at DESC);


--
-- Name: idx_auditoria_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_empresa_id ON public.auditoria USING btree (empresa_id);


--
-- Name: idx_auditoria_entidade; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_entidade ON public.auditoria USING btree (entidade_tipo, entidade_id);


--
-- Name: idx_auditoria_entidade_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_entidade_tipo ON public.auditoria USING btree (entidade_tipo);


--
-- Name: idx_auditoria_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_user_id ON public.auditoria USING btree (user_id);


--
-- Name: idx_empresas_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_is_active ON public.empresas USING btree (is_active);


--
-- Name: idx_empresas_nome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_nome ON public.empresas USING btree (nome);


--
-- Name: idx_empresas_plano_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_plano_id ON public.empresas USING btree (plano_id);


--
-- Name: idx_empresas_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_status ON public.empresas USING btree (status);


--
-- Name: idx_empresas_stripe_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_stripe_customer_id ON public.empresas USING btree (stripe_customer_id);


--
-- Name: idx_planos_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planos_is_active ON public.planos USING btree (is_active);


--
-- Name: idx_planos_nome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planos_nome ON public.planos USING btree (nome);


--
-- Name: idx_planos_stripe_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_planos_stripe_price_id ON public.planos USING btree (stripe_price_id);


--
-- Name: idx_profiles_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_empresa_id ON public.profiles USING btree (empresa_id);


--
-- Name: idx_profiles_empresa_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_empresa_role ON public.profiles USING btree (empresa_id, role);


--
-- Name: idx_profiles_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);


--
-- Name: idx_uso_recursos_empresa_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uso_recursos_empresa_id ON public.uso_recursos USING btree (empresa_id);


--
-- Name: idx_uso_recursos_empresa_mes; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uso_recursos_empresa_mes ON public.uso_recursos USING btree (empresa_id, mes_referencia DESC);


--
-- Name: idx_uso_recursos_mes_referencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uso_recursos_mes_referencia ON public.uso_recursos USING btree (mes_referencia);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_12_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_13_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_14_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_15_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_16_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: messages_2026_01_17_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--



--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: messages_2026_01_12_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_12_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_13_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_13_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_14_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_14_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_15_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_15_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_16_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_16_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_17_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: messages_2026_01_17_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: agentes_ia auto_fill_empresa_id_agentes_ia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER auto_fill_empresa_id_agentes_ia BEFORE INSERT ON public.agentes_ia FOR EACH ROW WHEN (((new.empresa_id IS NULL) AND (new.created_by IS NOT NULL))) EXECUTE FUNCTION public.auto_fill_empresa_id_from_user();


--
-- Name: profiles set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: agentes_ia update_agentes_ia_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_agentes_ia_updated_at BEFORE UPDATE ON public.agentes_ia FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: empresas update_empresas_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: planos update_planos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_planos_updated_at BEFORE UPDATE ON public.planos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: uso_recursos update_uso_recursos_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_uso_recursos_updated_at BEFORE UPDATE ON public.uso_recursos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--



--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: agentes_ia agentes_ia_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes_ia


--
-- Name: agentes_ia agentes_ia_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes_ia
    ADD CONSTRAINT agentes_ia_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- Name: auditoria auditoria_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- Name: auditoria auditoria_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria


--
-- Name: empresas empresas_plano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_plano_id_fkey FOREIGN KEY (plano_id) REFERENCES public.planos(id) ON DELETE SET NULL;


--
-- Name: org_to_empresa_mapping org_to_empresa_mapping_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.org_to_empresa_mapping
    ADD CONSTRAINT org_to_empresa_mapping_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles


--
-- Name: uso_recursos uso_recursos_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uso_recursos
    ADD CONSTRAINT uso_recursos_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--


--
-- Name: agentes_ia Admins can manage agents in empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage agents in empresa" ON public.agentes_ia TO authenticated USING (((empresa_id = public.current_empresa_id()) AND (empresa_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM public.profiles p


--
-- Name: POLICY "Admins can manage agents in empresa" ON agentes_ia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "Admins can manage agents in empresa" ON public.agentes_ia IS 'Admins da empresa podem gerenciar todos os agentes da empresa.';


--
-- Name: planos Admins can manage plans; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage plans" ON public.planos TO authenticated USING (true) WITH CHECK (true);


--
-- Name: planos Authenticated users can view active plans; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can view active plans" ON public.planos FOR SELECT TO authenticated USING ((is_active = true));


--
-- Name: profiles Empresa admins can manage profiles in empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Empresa admins can manage profiles in empresa" ON public.profiles TO authenticated USING (((empresa_id IS NOT NULL) AND (empresa_id = public.current_empresa_id()) AND public.is_user_admin_of_empresa(auth.uid(), empresa_id))) WITH CHECK (((empresa_id IS NOT NULL) AND (empresa_id = public.current_empresa_id()) AND ((role IS NULL) OR (role <> 'master'::text) OR public.is_user_admin_or_master(auth.uid()))));


--
-- Name: empresas Empresa admins can update own empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Empresa admins can update own empresa" ON public.empresas FOR UPDATE TO authenticated USING (((id = public.current_empresa_id()) AND (EXISTS ( SELECT 1
   FROM public.profiles


--
-- Name: empresas Master admins can create empresas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can create empresas" ON public.empresas FOR INSERT TO authenticated WITH CHECK (public.is_master_admin(auth.uid()));


--
-- Name: empresas Master admins can delete empresas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can delete empresas" ON public.empresas FOR DELETE TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: profiles Master admins can manage all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can manage all profiles" ON public.profiles TO authenticated USING (public.is_master_admin(auth.uid())) WITH CHECK (public.is_master_admin(auth.uid()));


--
-- Name: empresas Master admins can update all empresas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can update all empresas" ON public.empresas FOR UPDATE TO authenticated USING (public.is_master_admin(auth.uid())) WITH CHECK (public.is_master_admin(auth.uid()));


--
-- Name: agentes_ia Master admins can view all agents; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can view all agents" ON public.agentes_ia FOR SELECT TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: auditoria Master admins can view all auditoria; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can view all auditoria" ON public.auditoria FOR SELECT TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: empresas Master admins can view all empresas; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can view all empresas" ON public.empresas FOR SELECT TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: profiles Master admins can view all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: uso_recursos Master admins can view all uso recursos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Master admins can view all uso recursos" ON public.uso_recursos FOR SELECT TO authenticated USING (public.is_master_admin(auth.uid()));


--
-- Name: agentes_ia Users can create agents in empresa; Type: POLICY; Schema: public; Owner: postgres
--



--
-- Name: POLICY "Users can create agents in empresa" ON agentes_ia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "Users can create agents in empresa" ON public.agentes_ia IS 'Usuários podem criar agentes de IA na própria empresa.';


--
-- Name: agentes_ia Users can update own agents; Type: POLICY; Schema: public; Owner: postgres
--



--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK (((auth.uid() = id) AND ((empresa_id IS NULL) OR (empresa_id = ( SELECT profiles_1.empresa_id
   FROM public.profiles profiles_1
   FROM public.profiles profiles_1


--
-- Name: agentes_ia Users can view agents in empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view agents in empresa" ON public.agentes_ia FOR SELECT TO authenticated USING (((empresa_id = public.current_empresa_id()) AND (empresa_id IS NOT NULL)));


--
-- Name: POLICY "Users can view agents in empresa" ON agentes_ia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "Users can view agents in empresa" ON public.agentes_ia IS 'Usuários podem ver agentes de IA da mesma empresa.';


--
-- Name: auditoria Users can view auditoria in empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view auditoria in empresa" ON public.auditoria FOR SELECT TO authenticated USING (((empresa_id = public.current_empresa_id()) AND (empresa_id IS NOT NULL)));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: uso_recursos Users can view own uso recursos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own uso recursos" ON public.uso_recursos FOR SELECT TO authenticated USING (((empresa_id = public.current_empresa_id()) AND (empresa_id IS NOT NULL)));


--
-- Name: POLICY "Users can view own uso recursos" ON uso_recursos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON POLICY "Users can view own uso recursos" ON public.uso_recursos IS 'Usuários podem ver uso de recursos da própria empresa.';


--
-- Name: profiles Users can view profiles in same empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view profiles in same empresa" ON public.profiles FOR SELECT TO authenticated USING (((empresa_id IS NOT NULL) AND (empresa_id = public.current_empresa_id())));


--
-- Name: empresas Users can view their own empresa; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own empresa" ON public.empresas FOR SELECT TO authenticated USING ((id = public.current_empresa_id()));


--
-- Name: profiles Usuários podem atualizar próprio perfil; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: agentes_ia; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.agentes_ia ENABLE ROW LEVEL SECURITY;

--
-- Name: auditoria; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

--
-- Name: empresas; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

--
-- Name: planos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: uso_recursos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.uso_recursos ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--


--
-- Name: objects Leitura pública dos avatares; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects Usuários autenticados podem atualizar seus próprios avatares; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects Usuários autenticados podem deletar seus próprios avatares; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: objects Usuários autenticados podem fazer upload no bucket avatars; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--


--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--



--
--



--
--



--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--



--
--



--
--



--
--



--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--



--
--



--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--



--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--



--
-- Name: FUNCTION auto_fill_empresa_id_from_user(); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION current_empresa_id(); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION ensure_empresa_context(p_empresa_id bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION get_empresa_id_for_user(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION get_or_create_uso_recursos_current_month(p_empresa_id bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION handle_updated_at(); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION has_role(_user_id uuid, _role public.app_role); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION increment_uso_recursos(p_empresa_id bigint, p_mensagens integer, p_tokens bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION is_master_admin(user_id uuid); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION is_user_admin_of_empresa(_user_id uuid, _empresa_id bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION is_user_admin_or_master(_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION log_auditoria(p_user_id uuid, p_empresa_id bigint, p_acao text, p_entidade_tipo text, p_entidade_id bigint, p_ip_address inet, p_user_agent text, p_metadata jsonb); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION user_belongs_to_empresa(user_id uuid, empresa_id_check bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION validate_empresa_access(p_empresa_id bigint); Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
--



--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
--



--
--



--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--



--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--



--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--



--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--



--
-- Name: TABLE agentes_ia; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: SEQUENCE agentes_ia_id_seq; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE auditoria; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: SEQUENCE auditoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE empresas; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: SEQUENCE empresas_id_seq; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE org_to_empresa_mapping; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE planos; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: SEQUENCE planos_id_seq; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE uso_recursos; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: SEQUENCE uso_recursos_id_seq; Type: ACL; Schema: public; Owner: postgres
--



--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--



--
-- Name: TABLE messages_2026_01_12; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE messages_2026_01_13; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE messages_2026_01_14; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE messages_2026_01_15; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE messages_2026_01_16; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE messages_2026_01_17; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE prefixes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--



--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--



--
--



--
--



--
--



--
--



--
--



--
--



--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--



--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--



--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--



--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--



--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict CBVgEkma6gm1lGuosqa2dtem4KlFiufXcoJVWpvpzmVouoXi4TQEcTgMvycpj7V

--
-- PostgreSQL database cluster dump complete
--
