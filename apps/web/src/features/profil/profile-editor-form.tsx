'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ACTIVITY_OPTIONS, EDUCATION_OPTIONS, INTEREST_OPTIONS, NO_SELECTION } from './constants';
import { PROFILE_COPY, PROFILE_EDITOR_COPY as COPY } from './content';
import { ProfileChoiceFields } from './profile-choice-fields';
import { draftToPreferences, isDraftDirty, toggleValue } from './profile-draft';
import { ProfileRegionFields } from './profile-region-fields';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';
import { useProfile } from './use-profile';
import { useUnsavedGuard } from './use-unsaved-guard';
import type { ProfileDraft, ProfileEditorFormProps } from './types';
import { AKTIVITAS_LAIN_MAKS, NAMA_PROFIL_MAKS } from '@hakkita/schema';

export function ProfileEditorForm({
  regions,
  initialDraft,
  hadName,
  fromProfile,
}: ProfileEditorFormProps) {
  const router = useRouter();
  const { save } = useProfile();
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const isSavingRef = useRef(false);
  const isDirty = isDraftDirty(draft, initialDraft);
  const guard = useUnsavedGuard(isDirty && !isSaving);

  function update(changes: Partial<ProfileDraft>) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingRef.current) return;
    if (hadName && !draft.nama.trim()) {
      setNameError(PROFILE_COPY.nameRequired);
      return;
    }
    setNameError(null);
    setError(null);
    isSavingRef.current = true;
    setIsSaving(true);
    try {
      const preferensi = draftToPreferences(draft, regions);
      const failure = await save(draft.nama.trim(), preferensi);
      if (failure) {
        setError(failure);
        return;
      }
      router.push('/profil?disimpan=1');
    } catch {
      setError(PROFILE_COPY.saveError);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <form aria-busy={isSaving} className="flex flex-col gap-8" noValidate onSubmit={handleSubmit}>
      {error && (
        <p className="m-0 text-sm text-[#a13239]" role="alert">
          {error}
        </p>
      )}
      <div className="max-w-[440px]">
        <label className="mb-2 block text-sm font-medium text-[#253044]" htmlFor="profile-name">
          {COPY.nameLabel}
        </label>
        <TextInput
          aria-describedby={nameError ? 'profile-name-error' : undefined}
          aria-invalid={Boolean(nameError)}
          autoComplete="name"
          disabled={isSaving}
          id="profile-name"
          maxLength={NAMA_PROFIL_MAKS}
          onChange={(event) => {
            update({ nama: event.target.value });
            setNameError(null);
          }}
          value={draft.nama}
        />
        {nameError && (
          <p className="m-0 mt-2 text-sm text-[#a13239]" id="profile-name-error" role="alert">
            {nameError}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-8 [&>section:last-child]:border-b-0 [&>section:last-child]:pb-0">
        <ProfileRegionFields
          isDisabled={isSaving}
          kota={draft.kota}
          onChange={(provinsi, kota) => update({ provinsi, kota })}
          provinsi={draft.provinsi}
          regions={regions}
        />
        <ProfileChoiceFields
          heading={COPY.activitiesHeading}
          hint={COPY.activitiesHint}
          legend={COPY.activitiesHeading}
          name="kegiatan"
          onToggle={(value) =>
            update({
              kegiatan: toggleValue(draft.kegiatan, value as ProfileDraft['kegiatan'][number]),
            })
          }
          options={ACTIVITY_OPTIONS}
          values={draft.kegiatan}
        >
          {draft.kegiatan.includes('lainnya') && (
            <div className="mt-4 max-w-[540px]">
              <label
                className="mb-2 block text-sm font-medium text-[#253044]"
                htmlFor="profile-other"
              >
                {COPY.activitiesOtherLabel}
              </label>
              <TextInput
                aria-describedby="profile-other-hint"
                disabled={isSaving}
                id="profile-other"
                maxLength={AKTIVITAS_LAIN_MAKS}
                onChange={(event) => update({ kegiatanLain: event.target.value })}
                value={draft.kegiatanLain}
              />
              <p className="m-0 mt-2 text-[13px] text-[#64748b]" id="profile-other-hint">
                {COPY.activitiesOtherHint}
              </p>
            </div>
          )}
        </ProfileChoiceFields>
        <section className="border-b border-[#e7ecf2] pb-8">
          <h2 className="m-0 mb-2 text-xl font-semibold text-[#253044]">{COPY.educationHeading}</h2>
          <p className="m-0 mb-5 text-sm leading-6 text-[#64748b]">{COPY.educationHint}</p>
          <div className="max-w-[440px]">
            <SelectField
              isDisabled={isSaving}
              label={COPY.educationLabel}
              onChange={(value) => update({ pendidikan: value === NO_SELECTION ? '' : value })}
              options={[{ value: NO_SELECTION, label: COPY.noSelection }, ...EDUCATION_OPTIONS]}
              placeholder={COPY.educationPlaceholder}
              value={draft.pendidikan || null}
            />
          </div>
        </section>
        <ProfileChoiceFields
          heading={COPY.interestsHeading}
          hint={COPY.interestsHint}
          legend={COPY.interestsHeading}
          name="minat"
          onToggle={(value) =>
            update({ minat: toggleValue(draft.minat, value as ProfileDraft['minat'][number]) })
          }
          options={INTEREST_OPTIONS}
          values={draft.minat}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-2.5">
        <Button className="max-[640px]:w-full" isDisabled={isSaving} type="submit">
          {isSaving ? COPY.saving : COPY.save}
          <ArrowRight aria-hidden="true" size={18} />
        </Button>
        <Button
          className="max-[640px]:w-full"
          isDisabled={isSaving}
          onPress={() => guard.requestLeave(fromProfile ? '/profil' : '/kenali-hakmu')}
          tone="secondary"
          type="button"
        >
          {fromProfile ? COPY.cancel : COPY.skip}
        </Button>
      </div>
      <UnsavedChangesDialog onLeave={guard.leave} onStay={guard.stay} open={guard.isLeaving} />
    </form>
  );
}
