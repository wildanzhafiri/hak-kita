'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RADAR_CONTROLS_ENDPOINT } from './constants';
import { RADAR_RUN_COPY } from './content';
import { useRadarRunContext } from './radar-run-context';
import { RadarRunPanel } from './radar-run-panel';
import type { RadarControlsProps, RadarSettingAction } from './types';

function isRadarSettings(value: unknown): value is RadarControlsProps['initialSettings'] {
  return (
    value !== null &&
    typeof value === 'object' &&
    'automatic_discovery_enabled' in value &&
    typeof value.automatic_discovery_enabled === 'boolean' &&
    'monitoring_enabled' in value &&
    typeof value.monitoring_enabled === 'boolean'
  );
}

export function RadarControls({ initialSettings }: RadarControlsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [busyAction, setBusyAction] = useState<RadarSettingAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { state: run, elapsedSeconds, start, stop, dismiss } = useRadarRunContext();
  const router = useRouter();
  const previousStatus = useRef(run?.status);
  const isRunning = run?.status === 'running';
  const isBusy = busyAction !== null || isRunning;

  useEffect(() => {
    const wasRunning = previousStatus.current === 'running';
    previousStatus.current = run?.status;
    if (wasRunning && run?.status === 'done') router.refresh();
  }, [run?.status, router]);

  async function submitSetting(action: RadarSettingAction, enabled: boolean) {
    setBusyAction(action);
    setMessage(null);
    try {
      const response = await fetch(RADAR_CONTROLS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, enabled }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : RADAR_RUN_COPY.requestFailedMessage;
        throw new Error(errorMessage);
      }
      if (
        result &&
        typeof result === 'object' &&
        'settings' in result &&
        isRadarSettings(result.settings)
      ) {
        setSettings(result.settings);
      }
      setMessage('Pengaturan Radar disimpan.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Koneksi terputus. Coba lagi.');
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section
      className="mb-6 rounded-xl border border-[#dce4ed] bg-white p-4 sm:p-5"
      aria-label="Pengaturan Radar"
    >
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
        <Switch
          label="Pencarian program otomatis"
          description="Terjadwal sekali sehari."
          isSelected={settings.automatic_discovery_enabled}
          isDisabled={isBusy}
          onChange={(enabled) => void submitSetting('automatic_discovery', enabled)}
        />
        <Switch
          label="Pemantauan program"
          description="Periksa perubahan pada sumber resmi program setiap hari."
          isSelected={settings.monitoring_enabled}
          isDisabled={isBusy}
          onChange={(enabled) => void submitSetting('monitoring', enabled)}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2 border-t border-[#e6edf5] pt-5 sm:flex-row sm:flex-wrap">
        <Button
          className="w-full sm:w-auto"
          isDisabled={isBusy}
          onPress={() => void start('discovery')}
          tone="secondary"
          type="button"
        >
          {isRunning && run?.kind === 'discovery' ? 'Mencari…' : 'Cari program sekarang'}
        </Button>
        <Button
          className="w-full sm:w-auto"
          isDisabled={isBusy}
          onPress={() => void start('monitoring')}
          tone="secondary"
          type="button"
        >
          {isRunning && run?.kind === 'monitoring' ? 'Memeriksa…' : 'Periksa sumber sekarang'}
        </Button>
      </div>
      {message && (
        <p className="mt-4 text-sm text-[#526173]" role="status">
          {message}
        </p>
      )}
      {run && (
        <RadarRunPanel
          state={run}
          elapsedSeconds={elapsedSeconds}
          onDismiss={dismiss}
          onStop={stop}
        />
      )}
    </section>
  );
}
