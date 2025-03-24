export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          approved: boolean | null
          constituency: string
          created_at: string | null
          election_id: string
          id: string
          manifesto: string | null
          party_id: string | null
          party_name: string
          profile_image: string | null
          state: string
          updated_at: string | null
          user_id: string
          vote_count: number | null
        }
        Insert: {
          approved?: boolean | null
          constituency: string
          created_at?: string | null
          election_id: string
          id?: string
          manifesto?: string | null
          party_id?: string | null
          party_name: string
          profile_image?: string | null
          state: string
          updated_at?: string | null
          user_id: string
          vote_count?: number | null
        }
        Update: {
          approved?: boolean | null
          constituency?: string
          created_at?: string | null
          election_id?: string
          id?: string
          manifesto?: string | null
          party_id?: string | null
          party_name?: string
          profile_image?: string | null
          state?: string
          updated_at?: string | null
          user_id?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidates_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "mock_party_database"
            referencedColumns: ["party_id"]
          },
        ]
      }
      elections: {
        Row: {
          constituency: string | null
          created_at: string | null
          end_date: string
          id: string
          start_date: string
          state: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          voter_turnout: number | null
        }
        Insert: {
          constituency?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          start_date: string
          state?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
          voter_turnout?: number | null
        }
        Update: {
          constituency?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          start_date?: string
          state?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          voter_turnout?: number | null
        }
        Relationships: []
      }
      fraud_logs: {
        Row: {
          created_at: string | null
          description: string
          election_id: string | null
          id: string
          resolved: boolean | null
          severity: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          election_id?: string | null
          id?: string
          resolved?: boolean | null
          severity: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          election_id?: string | null
          id?: string
          resolved?: boolean | null
          severity?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_logs_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_aadhaar_database: {
        Row: {
          aadhaar_id: string
          address: string
          dob: string
          name: string
          state: string
        }
        Insert: {
          aadhaar_id: string
          address: string
          dob: string
          name: string
          state: string
        }
        Update: {
          aadhaar_id?: string
          address?: string
          dob?: string
          name?: string
          state?: string
        }
        Relationships: []
      }
      mock_party_database: {
        Row: {
          party_id: string
          party_name: string
          party_short_name: string
          symbol_url: string | null
        }
        Insert: {
          party_id: string
          party_name: string
          party_short_name: string
          symbol_url?: string | null
        }
        Update: {
          party_id?: string
          party_name?: string
          party_short_name?: string
          symbol_url?: string | null
        }
        Relationships: []
      }
      mock_passport_database: {
        Row: {
          expiry_date: string
          issue_date: string
          name: string
          nationality: string
          passport_id: string
        }
        Insert: {
          expiry_date: string
          issue_date: string
          name: string
          nationality: string
          passport_id: string
        }
        Update: {
          expiry_date?: string
          issue_date?: string
          name?: string
          nationality?: string
          passport_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhaar_verified: boolean | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          face_verified: boolean | null
          id: string
          name: string
          party_id: string | null
          passport_verified: boolean | null
          phone: string | null
          phone_verified: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          aadhaar_verified?: boolean | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          face_verified?: boolean | null
          id: string
          name: string
          party_id?: string | null
          passport_verified?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          aadhaar_verified?: boolean | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          face_verified?: boolean | null
          id?: string
          name?: string
          party_id?: string | null
          passport_verified?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          type: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          type: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          type?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          blockchain_hash: string
          candidate_id: string
          election_id: string
          id: string
          timestamp: string | null
          voter_id: string
        }
        Insert: {
          blockchain_hash: string
          candidate_id: string
          election_id: string
          id?: string
          timestamp?: string | null
          voter_id: string
        }
        Update: {
          blockchain_hash?: string
          candidate_id?: string
          election_id?: string
          id?: string
          timestamp?: string | null
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_verification_complete: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      generate_otp: {
        Args: {
          p_user_id: string
          p_type: string
        }
        Returns: string
      }
      verify_aadhaar: {
        Args: {
          p_user_id: string
          p_aadhaar_id: string
        }
        Returns: boolean
      }
      verify_otp: {
        Args: {
          p_user_id: string
          p_code: string
          p_type: string
        }
        Returns: boolean
      }
      verify_passport: {
        Args: {
          p_user_id: string
          p_passport_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role:
        | "voter"
        | "candidate"
        | "admin"
        | "state_official"
        | "overseas_voter"
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
