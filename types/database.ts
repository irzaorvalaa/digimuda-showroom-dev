export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          role: string;
          user_id: string;
        };
        Insert: {
          role?: string;
          user_id: string;
        };
        Update: {
          role?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          created_at: string;
          id: string;
          logo_url: string | null;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_url?: string | null;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      car_colors: {
        Row: {
          car_id: string;
          created_at: string;
          gallery_urls: string[];
          hex: string;
          id: string;
          is_default: boolean;
          name: string;
          sort_order: number;
        };
        Insert: {
          car_id: string;
          created_at?: string;
          gallery_urls?: string[];
          hex: string;
          id?: string;
          is_default?: boolean;
          name: string;
          sort_order?: number;
        };
        Update: {
          car_id?: string;
          created_at?: string;
          gallery_urls?: string[];
          hex?: string;
          id?: string;
          is_default?: boolean;
          name?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "car_colors_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          }
        ];
      };
      cars: {
        Row: {
          acceleration_0_100: number | null;
          brand_id: string | null;
          cover_image_url: string;
          created_at: string;
          description: string | null;
          drivetrain: string | null;
          engine: string | null;
          exterior_color: string | null;
          gallery_urls: string[];
          id: string;
          interior_color: string | null;
          interior_hex: string | null;
          is_featured: boolean;
          mileage_km: number | null;
          name: string;
          power_hp: number | null;
          price_idr: number | null;
          slug: string;
          status: string;
          top_speed_kmh: number | null;
          torque_nm: number | null;
          transmission: string | null;
          updated_at: string;
          year: number;
        };
        Insert: {
          acceleration_0_100?: number | null;
          brand_id?: string | null;
          cover_image_url: string;
          created_at?: string;
          description?: string | null;
          drivetrain?: string | null;
          engine?: string | null;
          exterior_color?: string | null;
          gallery_urls?: string[];
          id?: string;
          interior_color?: string | null;
          interior_hex?: string | null;
          is_featured?: boolean;
          mileage_km?: number | null;
          name: string;
          power_hp?: number | null;
          price_idr?: number | null;
          slug: string;
          status?: string;
          top_speed_kmh?: number | null;
          torque_nm?: number | null;
          transmission?: string | null;
          updated_at?: string;
          year: number;
        };
        Update: {
          acceleration_0_100?: number | null;
          brand_id?: string | null;
          cover_image_url?: string;
          created_at?: string;
          description?: string | null;
          drivetrain?: string | null;
          engine?: string | null;
          exterior_color?: string | null;
          gallery_urls?: string[];
          id?: string;
          interior_color?: string | null;
          interior_hex?: string | null;
          is_featured?: boolean;
          mileage_km?: number | null;
          name?: string;
          power_hp?: number | null;
          price_idr?: number | null;
          slug?: string;
          status?: string;
          top_speed_kmh?: number | null;
          torque_nm?: number | null;
          transmission?: string | null;
          updated_at?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cars_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          }
        ];
      };
      inquiries: {
        Row: {
          car_id: string | null;
          created_at: string;
          full_name: string;
          id: string;
          message: string | null;
          status: string;
          whatsapp: string;
        };
        Insert: {
          car_id?: string | null;
          created_at?: string;
          full_name: string;
          id?: string;
          message?: string | null;
          status?: string;
          whatsapp: string;
        };
        Update: {
          car_id?: string | null;
          created_at?: string;
          full_name?: string;
          id?: string;
          message?: string | null;
          status?: string;
          whatsapp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_admin_role: { Args: Record<PropertyKey, never>; Returns: string };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      is_super_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
