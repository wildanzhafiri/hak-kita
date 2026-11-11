import type {
  KnowledgeDocument,
  ObstacleReportStage,
  PreferensiProfil,
  Program,
  RadarProgramDraft,
} from '@hakkita/schema';
import type { ProgramFollowSnapshot } from '@hakkita/domain';
import type { RadarRunState } from '@/app/admin/validasi/types';
import type { RadarRunCursor } from '@/server/types';

export interface Database {
  public: {
    Tables: {
      information_records: {
        Row: {
          id: string;
          kind: 'program' | 'layanan';
        };
        Insert: {
          id: string;
          kind: 'program' | 'layanan';
        };
        Update: {
          id?: string;
          kind?: 'program' | 'layanan';
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: 'admin';
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: 'admin';
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role?: 'admin';
          created_at?: string;
        };
        Relationships: [];
      };
      program_knowledge_documents: {
        Row: {
          id: string;
          program_id: string | null;
          public_service_id: string | null;
          record: KnowledgeDocument;
          updated_at: string;
        };
        Insert: {
          id: string;
          program_id?: string | null;
          public_service_id?: string | null;
          record: KnowledgeDocument;
          updated_at?: string;
        };
        Update: {
          program_id?: string | null;
          public_service_id?: string | null;
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
          source_text: string | null;
          content_updated_at: string | null;
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
          source_text?: string | null;
          content_updated_at?: string | null;
        };
        Update: {
          latest_fingerprint?: string;
          etag?: string | null;
          last_modified?: string | null;
          last_checked_at?: string;
          changed_at?: string | null;
          last_error?: string | null;
          source_text?: string | null;
          content_updated_at?: string | null;
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
          email_text: string | null;
          extra_source_urls: string[];
        };
        Insert: {
          id?: string;
          program_id: string;
          title: string;
          summary: string;
          source_url: string;
          published_on: string;
          created_at?: string;
          email_text?: string | null;
          extra_source_urls?: string[];
        };
        Update: {
          title?: string;
          summary?: string;
          source_url?: string;
          published_on?: string;
          email_text?: string | null;
          extra_source_urls?: string[];
        };
        Relationships: [];
      };
      program_radar_candidates: {
        Row: {
          id: string;
          program_id: string;
          source_url: string;
          source_fingerprint: string;
          evidence_quote: string | null;
          draft_title: string | null;
          draft_summary: string | null;
          draft_email_text: string | null;
          published_on: string | null;
          status: 'pending' | 'approved' | 'rejected';
          detected_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          news_id: string | null;
        };
        Insert: {
          id?: string;
          program_id: string;
          source_url: string;
          source_fingerprint: string;
          evidence_quote?: string | null;
          draft_title?: string | null;
          draft_summary?: string | null;
          draft_email_text?: string | null;
          published_on?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          detected_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          news_id?: string | null;
        };
        Update: {
          evidence_quote?: string | null;
          draft_title?: string | null;
          draft_summary?: string | null;
          draft_email_text?: string | null;
          published_on?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          news_id?: string | null;
        };
        Relationships: [];
      };
      program_radar_program_candidates: {
        Row: {
          id: string;
          record: RadarProgramDraft;
          status: 'pending' | 'approved' | 'rejected';
          detected_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          program_id: string | null;
        };
        Insert: {
          id?: string;
          record: RadarProgramDraft;
          status?: 'pending' | 'approved' | 'rejected';
          detected_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          program_id?: string | null;
        };
        Update: {
          record?: RadarProgramDraft;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          program_id?: string | null;
        };
        Relationships: [];
      };
      program_radar_runs: {
        Row: {
          id: string;
          kind: 'discovery' | 'monitoring';
          status: 'running' | 'done' | 'failed' | 'stopped';
          state: RadarRunState;
          cursor: RadarRunCursor | null;
          lease_until: string | null;
          stop_requested: boolean;
          dismissed: boolean;
          started_by: string | null;
          started_at: string;
          updated_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          kind: 'discovery' | 'monitoring';
          status?: 'running' | 'done' | 'failed' | 'stopped';
          state: RadarRunState;
          cursor?: RadarRunCursor | null;
          lease_until?: string | null;
          stop_requested?: boolean;
          dismissed?: boolean;
          started_by?: string | null;
          started_at?: string;
          updated_at?: string;
          finished_at?: string | null;
        };
        Update: {
          status?: 'running' | 'done' | 'failed' | 'stopped';
          state?: RadarRunState;
          cursor?: RadarRunCursor | null;
          lease_until?: string | null;
          stop_requested?: boolean;
          dismissed?: boolean;
          updated_at?: string;
          finished_at?: string | null;
        };
        Relationships: [];
      };
      program_radar_settings: {
        Row: {
          id: boolean;
          automatic_discovery_enabled: boolean;
          monitoring_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          automatic_discovery_enabled?: boolean;
          monitoring_enabled?: boolean;
          updated_at?: string;
        };
        Update: {
          automatic_discovery_enabled?: boolean;
          monitoring_enabled?: boolean;
          updated_at?: string;
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
      public_services: {
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
      user_profiles: {
        Row: {
          display_name: string;
          preferences: PreferensiProfil | Record<string, never>;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          display_name?: string;
          preferences?: PreferensiProfil | Record<string, never>;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          display_name?: string;
          preferences?: PreferensiProfil | Record<string, never>;
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
    Functions: {
      review_program_radar_candidate: {
        Args: {
          p_candidate_id: string;
          p_reviewer_id: string;
          p_action: 'approve' | 'reject';
          p_title?: string | null;
          p_summary?: string | null;
          p_published_on?: string | null;
          p_email_text?: string | null;
          p_extra_source_urls?: string[];
        };
        Returns: string | null;
      };
      review_program_radar_program_candidate: {
        Args: {
          p_candidate_id: string;
          p_reviewer_id: string;
          p_action: 'approve' | 'reject';
          p_program_id?: string | null;
          p_program_record?: Program | null;
        };
        Returns: string | null;
      };
    };
    Enums: {
      obstacle_report_stage: ObstacleReportStage;
    };
    CompositeTypes: Record<string, never>;
  };
}
