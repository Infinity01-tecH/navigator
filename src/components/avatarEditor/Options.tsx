import { useMemo, useRef } from 'react';
import { Avatar } from './Avatar';
import { Footer } from './Footer';
import type { AvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';
import type { SelectedStyleOptions } from '../../lib/avatarEditor/types';

interface TabItem {
  avatar: string;
  active?: boolean;
  options?: SelectedStyleOptions;
  onClick: () => void;
  onColorInput?: (value: string) => void;
}

interface OptionsProps {
  store: AvatarEditorStore;
}

// Mirrors the original's useDebounceFn(50ms, maxWait 50ms) on color-drag
// input — a color <input> fires on every drag tick, and each tick would
// otherwise trigger a full re-render of getAvatarCombinations (a real
// render cost, not just a wasted re-render).
function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => fn(...args), delayMs);
  };
}

export function Options({ store }: OptionsProps) {
  const changeOptionsWithOverride = useDebouncedCallback(
    (options: SelectedStyleOptions, optionKey: string, value: string) => {
      store.setSelectedStyleOptions({
        ...options,
        [optionKey]: value,
      });
    },
    50,
  );

  const tabs = useMemo(() => {
    const result: Record<string, TabItem[]> = {};

    result['style'] = Object.keys(store.availableStyles).map((styleName) => ({
      avatar: store.availableStyles[styleName][0].avatar.toString(),
      active: store.selectedStyleName === styleName,
      onClick: () => store.setSelectedStyleName(styleName),
    }));

    for (const key in store.selectedStyleCombinations) {
      result[key] = store.selectedStyleCombinations[key].map((combination) => ({
        avatar: combination.avatar.toString(),
        active: combination.active,
        options: combination.options,
        onClick: () => store.setSelectedStyleOptions(combination.options),
        onColorInput: combination.isCustomColor
          ? (value: string) =>
              changeOptionsWithOverride(combination.options, key, value)
          : undefined,
      }));
    }

    return result;
  }, [store.availableStyles, store.selectedStyleName, store.selectedStyleCombinations]);

  const tabKeys = Object.keys(tabs);
  const activeTabKey = tabKeys[parseInt(store.selectedTab, 10)];
  const activeItems = tabs[activeTabKey] ?? [];

  return (
    <div className="px-3 py-4 bg-background">
      <div className="grid grid-cols-3 gap-3">
        {activeItems.map((item, i) => (
          <button
            key={i}
            onClick={item.onClick}
            className={`relative rounded-2xl transition-all ${
              item.active
                ? 'ring-[3px] ring-[#0095ff]'
                : 'ring-1 ring-[#e5e7ea] hover:ring-[#c8f135]'
            }`}
          >
            <Avatar svg={item.avatar} className="rounded-xl overflow-hidden w-full aspect-square" />

            {item.onColorInput && (
              <label className="absolute bottom-0 right-0 block cursor-pointer">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{
                    background:
                      'conic-gradient(red 0%, red 14.29%, orange 14.29%, orange 28.57%, yellow 28.57%, yellow 42.86%, green 42.86%, green 57.14%, blue 57.14%, blue 71.43%, indigo 71.43%, indigo 85.71%, violet 85.71%)',
                  }}
                />
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 w-6 h-6 cursor-pointer"
                  onChange={(e) => item.onColorInput?.(e.target.value.replace(/^#/, ''))}
                />
              </label>
            )}
          </button>
        ))}
      </div>

      <Footer tab={activeTabKey} store={store} />
    </div>
  );
}
