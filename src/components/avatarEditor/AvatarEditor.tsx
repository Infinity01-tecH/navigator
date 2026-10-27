import { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import { useAvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';
import { Header, type AvatarSavePayload } from './Header';
import { Preview } from './Preview';
import { OptionsTabs } from './OptionsTabs';
import { Options } from './Options';
import labels from '../../config/avatarEditor/labels.json';

// Copied verbatim from the original messages/en.json — vue-i18n itself is
// dropped (see Footer.tsx flag: no existing i18n system in Navigator to
// plug into), but the actual English label text is preserved exactly rather
// than guessed at, since DiceBear's key naming isn't always a literal
// camelCase split of its label (e.g. "iconVariant" -> "Icon", not "Icon
// Variant"; "baseColor" -> "Color", not "Base Color").
function t(key: string): string {
  return (labels as Record<string, string>)[key] ?? key;
}

interface AvatarEditorProps {
  /**
   * Called with the finished avatar when the user taps Save. The caller
   * (whichever Navigator screen embeds this editor) is responsible for the
   * actual Supabase write — this component has no knowledge of auth or the
   * database, same separation the original iframe boundary had.
   */
  onSave: (payload: AvatarSavePayload) => void;
  /**
   * The user's real first initial (from their Navigator display name).
   * Only affects a genuine first-ever open of the editor on this device —
   * see UseAvatarEditorStoreOptions in useAvatarEditorStore.ts for the
   * exact gating. Optional: omit it (e.g. profile name not loaded yet) and
   * the editor falls back to its normal random first-run default.
   */
  initialLetter?: string;
}

export function AvatarEditor({ onSave, initialLetter }: AvatarEditorProps) {
  // Single store instance for the whole editor tree — created once here and
  // passed down via props, which is what keeps this equivalent to Pinia's
  // singleton store instead of each component getting its own disconnected
  // copy of the state.
  const store = useAvatarEditorStore({ initialLetter });

  // Mirrors App.vue's backgroundColor computed(): darken the avatar's own
  // background color by 10% to get the surround tint for header/preview/tabs.
  const surroundColor = useMemo(() => {
    const color =
      store.selectedStyleOptions?.backgroundColor === 'transparent' ||
      !store.selectedStyleOptions?.backgroundColor
        ? '#ffffff'
        : `#${store.selectedStyleOptions.backgroundColor}`;

    return tinycolor(color).darken(10).toHexString();
  }, [store.selectedStyleOptions?.backgroundColor]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4" style={{ backgroundColor: surroundColor }}>
        <Header store={store} onSave={onSave} />
        <Preview store={store} surroundColor={surroundColor} />
      </div>

      <OptionsTabs store={store} t={t} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <Options store={store} />
      </div>
    </div>
  );
}
