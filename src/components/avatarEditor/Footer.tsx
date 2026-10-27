import { useMemo } from 'react';
import type { Style } from '@dicebear/core';
import styleCollection from '../../config/avatarEditor/styles';
import {
  privacyPolicyUrl,
  cookiePolicyUrl,
  legalNoticeUrl,
} from '../../config/avatarEditor/legal';
import type { AvatarEditorStore } from '../../lib/avatarEditor/useAvatarEditorStore';

interface FooterProps {
  tab: string;
  store: AvatarEditorStore;
}

type MetaEntry = {
  title?: string;
  creator?: string;
  creatorUrl?: string;
  sourceUrl?: string;
  licenseName?: string;
  licenseUrl?: string;
};

export function Footer({ tab, store }: FooterProps) {
  const visibleStyles = useMemo<Style[]>(() => {
    if (tab === 'style') {
      return Object.values(styleCollection).map((v) => v.style);
    }

    return [styleCollection[store.selectedStyleName].style];
  }, [tab, store.selectedStyleName]);

  const metaList = useMemo(() => {
    const result: MetaEntry[] = [];
    const knownSources: string[] = [];

    for (const style of visibleStyles) {
      const meta = style.meta();
      const creatorName = meta.creator().name();
      const sourceUrl = meta.source().url();

      if (!creatorName || creatorName === 'Florian Körner') {
        continue;
      }

      if (sourceUrl) {
        if (knownSources.includes(sourceUrl)) {
          continue;
        }

        knownSources.push(sourceUrl);
      }

      result.push({
        title: meta.source().name(),
        creator: creatorName,
        creatorUrl: meta.creator().url(),
        sourceUrl,
        licenseName: meta.license().name(),
        licenseUrl: meta.license().url(),
      });
    }

    return result;
  }, [visibleStyles]);

  return (
    <div className="mt-6 p-4 rounded-xl bg-muted text-muted-foreground text-xs leading-relaxed">
      <ul className="flex flex-wrap gap-x-3 gap-y-1 list-none p-0">
        {privacyPolicyUrl && (
          <li>
            <a href={privacyPolicyUrl} target="_blank" rel="noreferrer" className="border-b border-dashed hover:border-solid">
              Privacy Policy
            </a>
          </li>
        )}
        {cookiePolicyUrl && (
          <li>
            <a href={cookiePolicyUrl} target="_blank" rel="noreferrer" className="border-b border-dashed hover:border-solid">
              Cookie Policy
            </a>
          </li>
        )}
        {legalNoticeUrl && (
          <li>
            <a href={legalNoticeUrl} target="_blank" rel="noreferrer" className="border-b border-dashed hover:border-solid">
              Legal Notice
            </a>
          </li>
        )}
      </ul>

      {metaList.length > 0 && (
        <>
          <div className="font-medium mt-3">Licenses</div>
          <p className="mt-1">
            {metaList.map((meta, i) => (
              <span key={meta.sourceUrl ?? i}>
                <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer" className="border-b border-dashed hover:border-solid">
                  {meta.title}
                </a>{' '}
                by{' '}
                <a href={meta.creatorUrl} target="_blank" rel="noopener noreferrer" className="border-b border-dashed hover:border-solid">
                  {meta.creator}
                </a>{' '}
                /{' '}
                <a href={meta.licenseUrl} target="_blank" rel="noopener noreferrer" className="border-b border-dashed hover:border-solid">
                  {meta.licenseName?.replace(/\.$/, '')}
                </a>
                .{' '}
              </span>
            ))}
            {metaList.length === 1 ? 'Remix of the original.' : '- All avatars are remixes of the original works.'}
          </p>
        </>
      )}
    </div>
  );
}
