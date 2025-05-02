export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          organization_id: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          organization_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          organization_id: string
          user_id: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_tools: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          slug: string
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          slug: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          slug?: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      user_tool_access: {
        Row: {
          user_id: string
          tool_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          tool_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          tool_id?: string
          created_at?: string
        }
      }
      organization_tool_access: {
        Row: {
          organization_id: string
          tool_id: string
          created_at: string
        }
        Insert: {
          organization_id: string
          tool_id: string
          created_at?: string
        }
        Update: {
          organization_id?: string
          tool_id?: string
          created_at?: string
        }
      }
    }
  }
}
