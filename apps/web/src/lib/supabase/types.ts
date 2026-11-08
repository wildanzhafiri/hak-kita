import type { KnowledgeDocument, ObstacleReportStage, Profile, Program } from '@hakkita/schema';
import type { ProgramFollowSnapshot } from '@hakkita/domain';

export interface Database {
  public: {
    Tables: {
      program_knowledge_documents: {
        Row: {
          id: string;
          program_id: string;
          record: KnowledgeDocument;
          updated_at: string;
        };
        Insert: {
          id: string;
          program_id: string;
          record: KnowledgeDocument;
          updated_at?: string;
        };
        Update: {
          program_id?: string;
          record?: KnowledgeDocument;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_source_observations: {
        Row: {
          source_url: string;
          baseline_fingerprint: string;
          latest_fingerprint: string;
          etag: string | null;
          last_modified: string | null;
          first_checked_at: string;
          last_checked_at: string;
          changed_at: string | null;
          last_error: string | null;
        };
        Insert: {
          source_url: string;
          baseline_fingerprint: string;
          latest_fingerprint: string;
          etag?: string | null;
          last_modified?: string | null;
          first_checked_at?: string;
          last_checked_at?: string;
          changed_at?: string | null;
          last_error?: string | null;
        };
        Update: {
          latest_fingerprint?: string;
          etag?: string | null;
          last_modified?: string | null;
          last_checked_at?: string;
          changed_at?: string | null;
          last_error?: string | null;
        };
        Relationships: [];
      };
      program_news: {
        Row: {
          id: string;
          program_id: string;
          title: string;
          summary: string;
          source_url: string;
          published_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          title: string;
          summary: string;
          source_url: string;
          published_on: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          summary?: string;
          source_url?: string;
          published_on?: string;
        };
        Relationships: [];
      };
      program_news_email_deliveries: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          news_id: string;
          status: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          program_id: string;
          news_id: string;
          status?: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at?: string | null;
          sent_at?: string | null;
        };
        Relationships: [];
      };
      program_email_preferences: {
        Row: {
          user_id: string;
          enabled: boolean;
          enabled_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          enabled?: boolean;
          enabled_at?: string;
          updated_at?: string;
        };
        Update: {
          enabled?: boolean;
          enabled_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_email_state: {
        Row: {
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          updated_at?: string;
        };
        Update: {
          snapshot?: ProgramFollowSnapshot;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_email_deliveries: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          status: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          status?: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: 'pending' | 'sending' | 'sent' | 'failed';
          claimed_at?: string | null;
          sent_at?: string | null;
        };
        Relationships: [];
      };
      program_follows: {
        Row: {
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          program_id: string;
          snapshot: ProgramFollowSnapshot;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          program_id?: string;
          snapshot?: ProgramFollowSnapshot;
          updated_at?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          id: string;
          record: Program;
          updated_at: string;
        };
        Insert: {
          id: string;
          record: Program;
          updated_at?: string;
        };
        Update: {
          id?: string;
          record?: Program;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_programs: {
        Row: {
          created_at: string;
          program_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          program_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          program_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      berkas_progress: {
        Row: {
          answers: Record<string, string>;
          checked_item_ids: string[];
          details_updated_at: string | null;
          note: string;
          program_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          answers?: Record<string, string>;
          checked_item_ids?: string[];
          details_updated_at?: string | null;
          note?: string;
          program_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          answers?: Record<string, string>;
          checked_item_ids?: string[];
          details_updated_at?: string | null;
          note?: string;
          program_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      condition_profiles: {
        Row: {
          profile: Profile;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          profile: Profile;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          profile?: Profile;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      obstacle_reports: {
        Row: {
          created_at: string;
          id: number;
          program_id: string;
          region_code: string;
          stage: ObstacleReportStage;
        };
        Insert: {
          created_at?: string;
          id?: never;
          program_id: string;
          region_code: string;
          stage: ObstacleReportStage;
        };
        Update: {
          created_at?: string;
          id?: never;
          program_id?: string;
          region_code?: string;
          stage?: ObstacleReportStage;
        };
        Relationships: [];
      };
    };
    Views: {
      obstacle_report_aggregates: {
        Row: {
          program_id: string;
          region_code: string;
          report_count: number;
          stage: ObstacleReportStage;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      obstacle_report_stage: ObstacleReportStage;
    };
    CompositeTypes: Record<string, never>;
  };
}
