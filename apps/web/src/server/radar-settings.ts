import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';

function createRadarSettingsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Radar belum dikonfigurasi');
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function loadRadarSettings() {
  const { data, error } = await createRadarSettingsClient()
    .from('program_radar_settings')
    .select('*')
    .eq('id', true)
    .single();
  if (error) throw error;
  return data;
}

export async function updateRadarSetting(
  setting: 'automatic_discovery_enabled' | 'monitoring_enabled',
  enabled: boolean,
) {
  const client = createRadarSettingsClient();
  const updatedAt = new Date().toISOString();
  const { error } = await (setting === 'automatic_discovery_enabled'
    ? client
        .from('program_radar_settings')
        .update({ automatic_discovery_enabled: enabled, updated_at: updatedAt })
        .eq('id', true)
    : client
        .from('program_radar_settings')
        .update({ monitoring_enabled: enabled, updated_at: updatedAt })
        .eq('id', true));
  if (error) throw error;
}
