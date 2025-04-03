// Simplified type definitions for MySQL compatibility layer

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Simplified Database type for compatibility
export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          content: string
          created_at: string | null
          id: string
          student_id: string
          teacher_id: string
          date: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          student_id: string
          teacher_id: string
          date: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          student_id?: string
          teacher_id?: string
          date?: string
        }
        Relationships: any[]
      }
      grades: {
        Row: {
          created_at: string | null
          id: string
          score: number
          student_id: string
          subject_id: string
          teacher_id: string
          term: string
          academic_year: string
          comment?: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          score: number
          student_id: string
          subject_id: string
          teacher_id: string
          term: string
          academic_year: string
          comment?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number
          student_id?: string
          subject_id?: string
          teacher_id?: string
          term?: string
          academic_year?: string
          comment?: string | null
        }
        Relationships: any[]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          first_name: string
          last_name: string
          email: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          first_name: string
          last_name: string
          email: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: any[]
      }
      students: {
        Row: {
          admission_number: string
          created_at: string | null
          date_of_birth: string
          first_name: string
          grade: string
          id: string
          last_name: string
          parent_id: string | null
          stream: string | null
        }
        Insert: {
          admission_number: string
          created_at?: string | null
          date_of_birth: string
          first_name: string
          grade: string
          id?: string
          last_name: string
          parent_id?: string | null
          stream?: string | null
        }
        Update: {
          admission_number?: string
          created_at?: string | null
          date_of_birth?: string
          first_name?: string
          grade?: string
          id?: string
          last_name?: string
          parent_id?: string | null
          stream?: string | null
        }
        Relationships: any[]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: any[]
      }
      teachers: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          subjects_taught: string[]
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          subjects_taught?: string[]
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          subjects_taught?: string[]
        }
        Relationships: any[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
