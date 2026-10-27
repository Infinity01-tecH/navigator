import { useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import type { AvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';
import styleCollection from '../../config/avatarEditor/styles';

interface OptionsTabsProps {
  store: AvatarEditorStore;
  /** i18n lookup for tab labels, e.g. t('style') -> 'Style'. */
  t: (key: string) => string;
}

/**
 * Horizontal scrolling tab bar (Style / Features / Earrings / Eyebrows...).
 * A tab is disabled (but still shown) when the current style doesn't have
 * that option at all.
 */
export function OptionsTabs({ store, t }: OptionsTabsProps) {
  const tabs = useMemo(() => {
    const resolvedOptions = store.selectedStylePreview.toJSON().options;
    const configStyleOptions =
      styleCollection[store.selectedStyleName].options;

    const result: Record<string, boolean> = {
      style: Object.keys(store.availableStyles).length > 1,
    };

    for (const key in configStyleOptions) {
      // 'letter' is synthetic (see getSchemaOptions.ts) — it resolves to the
      // real `seed` option, not a same-named key, so it needs its own check
      // here rather than falling through to the generic `key in resolvedOptions`.
      result[key] = key === 'letter' ? true : key in resolvedOptions;
    }

    return result;
  }, [store.selectedStylePreview, store.selectedStyleName, store.availableStyles]);

  const tabKeys = Object.keys(tabs);

  return (
    <div className="rounded-t-2xl overflow-hidden bg-background">
      <Tabs value={store.selectedTab} onValueChange={store.setSelectedTab}>
        <TabsList className="overflow-x-auto scrollbar-hide flex-nowrap justify-start">
          {tabKeys.map((key, i) => (
            <TabsTrigger
              key={key}
              value={i.toString()}
              disabled={!tabs[key]}
              className="shrink-0"
            >
              {t(key)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
