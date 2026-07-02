export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      agentes_ia: {
        Row: {
          created_at: string | null
          created_by: string | null
          empresa_id: number
          id: number
          instrucoes: string
          nome: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          empresa_id: number
          id?: number
          instrucoes: string
          nome: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          empresa_id?: number
          id?: number
          instrucoes?: string
          nome?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          created_at: string | null
          current_conversations: number | null
          id: string
          max_conversations: number | null
          profile_id: string
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_conversations?: number | null
          id?: string
          max_conversations?: number | null
          profile_id: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_conversations?: number | null
          id?: string
          max_conversations?: number | null
          profile_id?: string
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          empresa_id: number
          id: number
          is_active: boolean | null
          is_default: boolean | null
          key_encrypted: string
          key_hash: string
          key_name: string
          last_used_at: string | null
          metadata: Json | null
          provider: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          empresa_id: number
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          key_encrypted: string
          key_hash: string
          key_name: string
          last_used_at?: string | null
          metadata?: Json | null
          provider: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          empresa_id?: number
          id?: number
          is_active?: boolean | null
          is_default?: boolean | null
          key_encrypted?: string
          key_hash?: string
          key_name?: string
          last_used_at?: string | null
          metadata?: Json | null
          provider?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      auditoria: {
        Row: {
          acao: string
          created_at: string | null
          empresa_id: number | null
          entidade_id: number | null
          entidade_tipo: string
          id: number
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string | null
          empresa_id?: number | null
          entidade_id?: number | null
          entidade_tipo: string
          id?: number
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string | null
          empresa_id?: number | null
          entidade_id?: number | null
          entidade_tipo?: string
          id?: number
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_config: {
        Row: {
          ai_instructions: string | null
          ai_personality: string | null
          auto_close_after_minutes: number | null
          bot_mode: string | null
          created_at: string | null
          fallback_to_human: boolean | null
          id: string
          knowledge_base_enabled: boolean | null
          menu_message: string | null
          offline_message: string | null
          transfer_message: string | null
          updated_at: string | null
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          ai_instructions?: string | null
          ai_personality?: string | null
          auto_close_after_minutes?: number | null
          bot_mode?: string | null
          created_at?: string | null
          fallback_to_human?: boolean | null
          id?: string
          knowledge_base_enabled?: boolean | null
          menu_message?: string | null
          offline_message?: string | null
          transfer_message?: string | null
          updated_at?: string | null
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          ai_instructions?: string | null
          ai_personality?: string | null
          auto_close_after_minutes?: number | null
          bot_mode?: string | null
          created_at?: string | null
          fallback_to_human?: boolean | null
          id?: string
          knowledge_base_enabled?: boolean | null
          menu_message?: string | null
          offline_message?: string | null
          transfer_message?: string | null
          updated_at?: string | null
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      bot_flow_triggers: {
        Row: {
          active: boolean | null
          bot_config_id: string
          created_at: string | null
          flow_name: string
          id: string
          priority: number | null
          trigger_type: string | null
          trigger_value: string | null
        }
        Insert: {
          active?: boolean | null
          bot_config_id: string
          created_at?: string | null
          flow_name: string
          id?: string
          priority?: number | null
          trigger_type?: string | null
          trigger_value?: string | null
        }
        Update: {
          active?: boolean | null
          bot_config_id?: string
          created_at?: string | null
          flow_name?: string
          id?: string
          priority?: number | null
          trigger_type?: string | null
          trigger_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_flow_triggers_bot_config_id_fkey"
            columns: ["bot_config_id"]
            isOneToOne: false
            referencedRelation: "bot_config"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_keywords: {
        Row: {
          active: boolean | null
          bot_config_id: string
          created_at: string | null
          id: string
          keyword: string
          priority: number | null
          response: string
        }
        Insert: {
          active?: boolean | null
          bot_config_id: string
          created_at?: string | null
          id?: string
          keyword: string
          priority?: number | null
          response: string
        }
        Update: {
          active?: boolean | null
          bot_config_id?: string
          created_at?: string | null
          id?: string
          keyword?: string
          priority?: number | null
          response?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_keywords_bot_config_id_fkey"
            columns: ["bot_config_id"]
            isOneToOne: false
            referencedRelation: "bot_config"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_audit: {
        Row: {
          action: string
          agent_id: string | null
          conversation_id: string
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          agent_id?: string | null
          conversation_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          agent_id?: string | null
          conversation_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_audit_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_audit_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_context: {
        Row: {
          bot_state: string | null
          conversation_id: string
          created_at: string | null
          current_intent: string | null
          id: string
          last_interaction_at: string | null
          message_history: Json | null
          updated_at: string | null
          user_data: Json | null
        }
        Insert: {
          bot_state?: string | null
          conversation_id: string
          created_at?: string | null
          current_intent?: string | null
          id?: string
          last_interaction_at?: string | null
          message_history?: Json | null
          updated_at?: string | null
          user_data?: Json | null
        }
        Update: {
          bot_state?: string | null
          conversation_id?: string
          created_at?: string | null
          current_intent?: string | null
          id?: string
          last_interaction_at?: string | null
          message_history?: Json | null
          updated_at?: string | null
          user_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_context_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_metrics: {
        Row: {
          agent_messages_count: number | null
          conversation_id: string
          created_at: string | null
          first_response_time: number | null
          id: string
          messages_count: number | null
          resolution_time: number | null
          satisfaction_feedback: string | null
          satisfaction_score: number | null
        }
        Insert: {
          agent_messages_count?: number | null
          conversation_id: string
          created_at?: string | null
          first_response_time?: number | null
          id?: string
          messages_count?: number | null
          resolution_time?: number | null
          satisfaction_feedback?: string | null
          satisfaction_score?: number | null
        }
        Update: {
          agent_messages_count?: number | null
          conversation_id?: string
          created_at?: string | null
          first_response_time?: number | null
          id?: string
          messages_count?: number | null
          resolution_time?: number | null
          satisfaction_feedback?: string | null
          satisfaction_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_metrics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_tags: {
        Row: {
          conversation_id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agente_id: number | null
          api_key_id: number | null
          assigned_agent_id: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string
          conversation_uuid: string | null
          created_at: string | null
          empresa_id: number | null
          first_response_at: string | null
          id: string
          last_message_at: string | null
          mensagens: Json | null
          metadata: Json | null
          priority: string | null
          queue_id: string | null
          resolved_at: string | null
          sla_breach: boolean | null
          status: string | null
          tokens_usados: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agente_id?: number | null
          api_key_id?: number | null
          assigned_agent_id?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          conversation_uuid?: string | null
          created_at?: string | null
          empresa_id?: number | null
          first_response_at?: string | null
          id?: string
          last_message_at?: string | null
          mensagens?: Json | null
          metadata?: Json | null
          priority?: string | null
          queue_id?: string | null
          resolved_at?: string | null
          sla_breach?: boolean | null
          status?: string | null
          tokens_usados?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agente_id?: number | null
          api_key_id?: number | null
          assigned_agent_id?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          conversation_uuid?: string | null
          created_at?: string | null
          empresa_id?: number | null
          first_response_at?: string | null
          id?: string
          last_message_at?: string | null
          mensagens?: Json | null
          metadata?: Json | null
          priority?: string | null
          queue_id?: string | null
          resolved_at?: string | null
          sla_breach?: boolean | null
          status?: string | null
          tokens_usados?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes_ia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          contexto_ia: Json | null
          created_at: string | null
          id: number
          is_active: boolean | null
          nome: string
          plano_id: number | null
          status: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          contexto_ia?: Json | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          nome: string
          plano_id?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contexto_ia?: Json | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          nome?: string
          plano_id?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      flow_executions: {
        Row: {
          completed_at: string | null
          conversation_id: string
          created_at: string | null
          current_node: string | null
          flow_name: string
          id: string
          started_at: string | null
          status: string | null
          variables: Json | null
        }
        Insert: {
          completed_at?: string | null
          conversation_id: string
          created_at?: string | null
          current_node?: string | null
          flow_name: string
          id?: string
          started_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Update: {
          completed_at?: string | null
          conversation_id?: string
          created_at?: string | null
          current_node?: string | null
          flow_name?: string
          id?: string
          started_at?: string | null
          status?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_executions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          approved: boolean | null
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          approved?: boolean | null
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          approved?: boolean | null
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          media_url: string | null
          message_type: string | null
          metadata: Json | null
          sender_id: string | null
          sender_type: string
          status: string | null
          whatsapp_message_id: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type: string
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_type?: string
          status?: string | null
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_to_empresa_mapping: {
        Row: {
          empresa_id: number
          org_id: string
        }
        Insert: {
          empresa_id: number
          org_id: string
        }
        Update: {
          empresa_id?: number
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_to_empresa_mapping_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      planos: {
        Row: {
          cor: string | null
          created_at: string | null
          features: Json | null
          id: number
          is_active: boolean | null
          limite_mensagens_mes: number
          max_agentes: number
          max_usuarios: number
          nome: string
          preco_mensal: number
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          cor?: string | null
          created_at?: string | null
          features?: Json | null
          id?: number
          is_active?: boolean | null
          limite_mensagens_mes?: number
          max_agentes?: number
          max_usuarios?: number
          nome: string
          preco_mensal?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cor?: string | null
          created_at?: string | null
          features?: Json | null
          id?: number
          is_active?: boolean | null
          limite_mensagens_mes?: number
          max_agentes?: number
          max_usuarios?: number
          nome?: string
          preco_mensal?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string
          empresa_id: number | null
          failed_login_attempts: number | null
          full_name: string | null
          id: string
          last_login: string | null
          locked_until: string | null
          org_id: string
          plan: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          empresa_id?: number | null
          failed_login_attempts?: number | null
          full_name?: string | null
          id: string
          last_login?: string | null
          locked_until?: string | null
          org_id: string
          plan?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          empresa_id?: number | null
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          locked_until?: string | null
          org_id?: string
          plan?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          priority: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          priority?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          priority?: number | null
        }
        Relationships: []
      }
      quick_replies: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          shortcut: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          shortcut: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          shortcut?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      two_factor_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      uso_recursos: {
        Row: {
          created_at: string | null
          empresa_id: number
          id: number
          mensagens_enviadas: number
          mes_referencia: string
          tokens_consumidos: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          empresa_id: number
          id?: number
          mensagens_enviadas?: number
          mes_referencia: string
          tokens_consumidos?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          empresa_id?: number
          id?: number
          mensagens_enviadas?: number
          mes_referencia?: string
          tokens_consumidos?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_config: {
        Row: {
          access_token: string | null
          business_account_id: string | null
          connected_number: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          permissions: Json | null
          phone_number_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          webhook_verify_token: string | null
        }
        Insert: {
          access_token?: string | null
          business_account_id?: string | null
          connected_number?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          permissions?: Json | null
          phone_number_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          webhook_verify_token?: string | null
        }
        Update: {
          access_token?: string | null
          business_account_id?: string | null
          connected_number?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          permissions?: Json | null
          phone_number_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_verify_token?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_api_key: {
        Args: { p_key_id: number; p_user_id: string }
        Returns: boolean
      }
      current_empresa_id: { Args: never; Returns: number }
      current_org_id: { Args: never; Returns: string }
      decrypt_api_key: {
        Args: { p_empresa_id: number; p_encrypted_key: string }
        Returns: string
      }
      encrypt_api_key: {
        Args: { p_empresa_id: number; p_plain_key: string }
        Returns: string
      }
      ensure_empresa_context: {
        Args: { p_empresa_id: number }
        Returns: boolean
      }
      ensure_uso_recursos_current_month: {
        Args: { p_empresa_id: number }
        Returns: undefined
      }
      generate_encryption_key: {
        Args: { p_empresa_id: number }
        Returns: string
      }
      get_decrypted_api_key: {
        Args: { p_empresa_id: number; p_key_id: number }
        Returns: string
      }
      get_default_decrypted_api_key: {
        Args: { p_empresa_id: number; p_provider: string }
        Returns: string
      }
      get_empresa_id_for_user: { Args: { p_user_id: string }; Returns: number }
      get_empresa_id_from_conversation: {
        Args: { p_conversation_id: string }
        Returns: number
      }
      get_empresa_id_from_profile: {
        Args: { p_profile_id: string }
        Returns: number
      }
      get_or_create_uso_recursos_current_month: {
        Args: { p_empresa_id: number }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_api_key: { Args: { p_plain_key: string }; Returns: string }
      increment_uso_recursos: {
        Args: { p_empresa_id: number; p_mensagens?: number; p_tokens?: number }
        Returns: undefined
      }
      insert_api_key: {
        Args: {
          p_created_by?: string
          p_empresa_id: number
          p_is_default?: boolean
          p_key_name: string
          p_metadata?: Json
          p_plain_key: string
          p_provider: string
        }
        Returns: number
      }
      is_empresa_admin: { Args: { p_empresa_id: number }; Returns: boolean }
      is_master_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_id: string }; Returns: boolean }
      is_user_admin_of_empresa: {
        Args: { _empresa_id: number; _user_id: string }
        Returns: boolean
      }
      is_user_admin_or_master: { Args: { _user_id: string }; Returns: boolean }
      log_auditoria: {
        Args: {
          p_acao: string
          p_empresa_id: number
          p_entidade_id?: number
          p_entidade_tipo: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_user_agent?: string
          p_user_id: string
        }
        Returns: number
      }
      user_belongs_to_empresa: {
        Args: { p_empresa_id: number; p_user_id: string }
        Returns: boolean
      }
      validate_empresa_access: {
        Args: { p_empresa_id: number }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "master"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "master"],
    },
  },
} as const
