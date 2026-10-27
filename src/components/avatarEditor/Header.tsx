import { useState, useCallback, useMemo } from 'react';
import { Sparkles, Maximize2 } from 'lucide-react';
import styleCollection from '../../config/avatarEditor/styles';
import type { AvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';

export interface AvatarSavePayload {
  style: string;
  options: Record<string, string>;
  svg: string;
}

interface HeaderProps {
  store: AvatarEditorStore;
  /**
   * Replaces the original's window.postMessage bridge. Since this component
   * now lives natively inside Navigator (no iframe boundary), the finished
   * avatar is handed directly to whichever screen embeds this editor, which
   * is then responsible for the actual Supabase write — same division of
   * responsibility as before, just a direct call instead of a cross-window
   * message.
   */
  onSave: (payload: AvatarSavePayload) => void;
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enter = useCallback(() => {
    document.documentElement.requestFullscreen?.().then(() => {
      setIsFullscreen(true);
    });
  }, []);

  return { isFullscreen, enter };
}

export function Header({ store, onSave }: HeaderProps) {
  const [showSavedDialog, setShowSavedDialog] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const { isFullscreen, enter } = useFullscreen();

  const styleMeta = useMemo(() => {
    const meta = styleCollection[store.selectedStyleName].style.meta();

    return {
      title: meta.source().name(),
      source: meta.source().url(),
      creator: meta.creator().name(),
      homepage: meta.creator().url(),
      license: {
        name: meta.license().name(),
        url: meta.license().url(),
      },
    };
  }, [store.selectedStyleName]);

  function handleShuffle() {
    store.shuffle();
  }

  function handleSave() {
    setSaveError(false);

    try {
      // Render the current avatar locally — no network call, no
      // api.dicebear.com (mirrors the original's local-only render).
      const svg = store.selectedStylePreview.toString();

      onSave({
        style: store.selectedStyleName,
        options: store.selectedStyleOptions,
        svg,
      });

      setShowSavedDialog(true);
    } catch (e) {
      setSaveError(true);
      console.error('[avatar:save] failed to prepare avatar for saving', e);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            aria-label="Shuffle"
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <Sparkles size={16} className="text-foreground" />
          </button>
          {!isFullscreen && (
            <button
              onClick={enter}
              aria-label="Fullscreen"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Maximize2 size={16} className="text-foreground" />
            </button>
          )}
        </div>

        <button
          onClick={handleSave}
          className="h-9 px-4 rounded-full bg-muted text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Save
        </button>
      </div>

      {saveError && (
        <p className="text-xs text-[#e0533d] text-right mt-1">
          Something went wrong saving your avatar. Try again.
        </p>
      )}

      {showSavedDialog && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6"
          onClick={() => setShowSavedDialog(false)}
        >
          <div
            className="bg-background rounded-2xl p-5 max-w-[340px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-2">Avatar saved</h3>
            <p className="text-sm text-muted-foreground">
              Your new avatar has been saved.
            </p>
            {styleMeta.license.name !== 'CC0 1.0' && (
              <p className="text-xs text-muted-foreground mt-3">
                "{styleMeta.title}" by{' '}
                <a href={styleMeta.homepage} target="_blank" rel="noreferrer" className="underline">
                  {styleMeta.creator}
                </a>
                , licensed under{' '}
                <a href={styleMeta.license.url} target="_blank" rel="noreferrer" className="underline">
                  {styleMeta.license.name}
                </a>
                .
              </p>
            )}
            <button
              onClick={() => setShowSavedDialog(false)}
              className="mt-4 w-full h-10 bg-primary text-foreground text-sm font-semibold rounded-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
