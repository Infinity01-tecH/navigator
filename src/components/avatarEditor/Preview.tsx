import { Avatar } from './Avatar';
import type { AvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';

interface PreviewProps {
  store: AvatarEditorStore;
  /** Darkened version of the avatar's background color, computed by the parent. */
  surroundColor: string;
}

/**
 * The large avatar preview. Sits inside a color-matched surround (see
 * surroundColor / App-level tinycolor darken logic) so the whole header
 * area visually "belongs" to whatever background color the avatar has.
 */
export function Preview({ store, surroundColor }: PreviewProps) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl p-6 transition-colors"
      style={{ backgroundColor: surroundColor }}
    >
      <div className="w-full max-w-[220px] aspect-square">
        <Avatar
          svg={store.selectedStylePreview.toString()}
          className="w-full h-full rounded-2xl object-contain"
        />
      </div>
    </div>
  );
}
