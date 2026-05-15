export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          uid: string
          username: string
          avatar: string | null
          highScore: number | null
          totalRuns: number | null
          created_at: string
        }
        Insert: {
          uid: string
          username: string
          avatar?: string | null
          highScore?: number | null
          totalRuns?: number | null
          created_at?: string
        }
        Update: {
          uid?: string
          username?: string
          avatar?: string | null
          highScore?: number | null
          totalRuns?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_uid_fkey"
            columns: ["uid"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
