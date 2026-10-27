import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type {
  SelectedStyleOptionsCollection,
  SelectedStyleOptions,
  SelectedStyleCombinations,
} from './types';
import getRandomOptions from './getRandomOptions';
import { createAvatar } from './createAvatar';
import getAvatarCombinations from './getAvatarCombinations';
import styleCollection from '../../config/avatarEditor/styles';

// Bumped whenever the shape of SelectedStyleOptionsCollection changes in a
// way that would make previously-stored localStorage data invalid/stale.
// Mirrors __dicebearEditorVersion from the original Vite build define.
const EDITOR_STORAGE_VERSION = '1';

const STYLE_STORAGE_KEY = 'nav_avatar_editor_style';
const OPTIONS_STORAGE_KEY = `nav_avatar_editor_options_${EDITOR_STORAGE_VERSION}`;

function buildDefaultOptionsCollection(
  initialLetter?: string,
): SelectedStyleOptionsCollection {
  const result = Object.keys(styleCollection).reduce<SelectedStyleOptionsCollection>(
    (acc, key) => {
      acc[key] = getRandomOptions(styleCollection[key].options);
      return acc;
    },
    {},
  );

  // First-run override: if the caller knows the user's real initial (from
  // their Navigator display name) and Initials has a synthetic `letter`
  // option (see getSchemaOptions.ts), pin it here instead of leaving it to
  // getRandomOptions' random A-Z pick. Deliberately narrow — this only ever
  // touches the `initials` entry inside a freshly-built collection, so it
  // can never clobber a style the user already customized and saved.
  if (initialLetter && result['initials'] && 'letter' in result['initials']) {
    result['initials'] = { ...result['initials'], letter: initialLetter };
  }

  return result;
}

// True only when there is no stored style choice at all — i.e. this device
// has never saved an avatar before. Deliberately distinct from
// readStoredStyleName()'s return value, which always resolves to *some*
// valid key (falling back to the first style) and so can't itself tell
// "never chosen" apart from "chose the first style on purpose." This is
// what gates the initial-letter default below: it must fire once, on a
// genuine first-ever open, and never again once the user has picked
// (and saved) anything — including if they explicitly pick Initials
// themselves later.
function hasStoredStyleChoice(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(STYLE_STORAGE_KEY);
    return !!stored && stored in styleCollection;
  } catch {
    return false;
  }
}

function readStoredStyleName(): string {
  if (typeof window === 'undefined') {
    return Object.keys(styleCollection)[0];
  }

  try {
    const stored = window.localStorage.getItem(STYLE_STORAGE_KEY);
    return stored && stored in styleCollection
      ? stored
      : Object.keys(styleCollection)[0];
  } catch {
    // localStorage can throw in some sandboxed/iframe contexts (Safari
    // private mode, certain in-app webviews). Fall back to first style
    // rather than crashing the editor if it does.
    return Object.keys(styleCollection)[0];
  }
}

function readStoredOptionsCollection(
  initialLetter?: string,
): SelectedStyleOptionsCollection {
  if (typeof window === 'undefined') {
    return buildDefaultOptionsCollection(initialLetter);
  }

  try {
    const stored = window.localStorage.getItem(OPTIONS_STORAGE_KEY);
    if (!stored) {
      return buildDefaultOptionsCollection(initialLetter);
    }

    const parsed = JSON.parse(stored) as SelectedStyleOptionsCollection;

    // Fill in any styles that exist in the current build but weren't in the
    // stored collection yet (e.g. a style was added after this user's last
    // visit). Without this, selecting a newer style would read `undefined`.
    // NOTE: intentionally does NOT pass initialLetter here — this branch
    // means SOME collection was already stored, i.e. not a true first run,
    // so the letter default must not apply even if `initials` happens to be
    // one of the newly-backfilled styles.
    const defaults = buildDefaultOptionsCollection();
    for (const key of Object.keys(defaults)) {
      if (!parsed[key]) {
        parsed[key] = defaults[key];
      }
    }

    return parsed;
  } catch {
    return buildDefaultOptionsCollection(initialLetter);
  }
}

export interface AvatarEditorStore {
  selectedStyleName: string;
  setSelectedStyleName: (name: string) => void;

  selectedStyleOptions: SelectedStyleOptions;
  setSelectedStyleOptions: (options: SelectedStyleOptions) => void;

  selectedTab: string;
  setSelectedTab: (tab: string) => void;

  /** One live-rendered tile per style, for the "style" tab. */
  availableStyles: SelectedStyleCombinations;

  /** Every selectable value for the current tab's option, pre-rendered. */
  selectedStyleCombinations: SelectedStyleCombinations;

  /** The current avatar for the active style + its selected options. */
  selectedStylePreview: ReturnType<typeof createAvatar>;

  /** Applies a fresh random option set to the currently selected style. */
  shuffle: () => void;
}

export interface UseAvatarEditorStoreOptions {
  /**
   * The user's real first initial (e.g. from their Navigator display name),
   * used only on a genuine first-ever open of this editor on this device —
   * i.e. when hasStoredStyleChoice() is false. Pins the initial style
   * selection to 'initials' and pre-selects this letter, instead of
   * whatever style/letter readStoredStyleName/readStoredOptionsCollection
   * would otherwise fall back to. Never applied once the user has an
   * actual saved choice — picking and saving any style (including
   * Initials with a different letter) permanently opts out of this
   * override for this device.
   */
  initialLetter?: string;
}

export function useAvatarEditorStore(
  { initialLetter }: UseAvatarEditorStoreOptions = {},
): AvatarEditorStore {
  const isFirstRun = useRef(!hasStoredStyleChoice()).current;
  const firstRunLetter = isFirstRun ? initialLetter : undefined;

  const [selectedStyleName, setSelectedStyleNameState] = useState<string>(() =>
    firstRunLetter ? 'initials' : readStoredStyleName(),
  );

  const [selectedStyleOptionsCollection, setSelectedStyleOptionsCollection] =
    useState<SelectedStyleOptionsCollection>(() =>
      readStoredOptionsCollection(firstRunLetter),
    );

  const [selectedTab, setSelectedTab] = useState('0');

  // --- Persistence -----------------------------------------------------
  // Pinia's useLocalStorage/useStorage auto-write on every change. These two
  // effects are the direct equivalent: write-through on every state change,
  // same two keys, same behavior on reload.
  useEffect(() => {
    try {
      window.localStorage.setItem(STYLE_STORAGE_KEY, selectedStyleName);
    } catch {
      // Same non-fatal-if-blocked reasoning as the read path above.
    }
  }, [selectedStyleName]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        OPTIONS_STORAGE_KEY,
        JSON.stringify(selectedStyleOptionsCollection),
      );
    } catch {
      // Same non-fatal-if-blocked reasoning as the read path above.
    }
  }, [selectedStyleOptionsCollection]);

  // --- selectedStyleOptions: settable "computed" ------------------------
  // Vue's `computed({ get, set })` reads/writes into the collection keyed by
  // the current style. There's no direct React equivalent to a memo you can
  // also assign to — split explicitly into a derived read value and a
  // setter function that writes back into the collection.
  const selectedStyleOptions = useMemo(
    () => selectedStyleOptionsCollection[selectedStyleName],
    [selectedStyleOptionsCollection, selectedStyleName],
  );

  const setSelectedStyleOptions = useCallback(
    (options: SelectedStyleOptions) => {
      setSelectedStyleOptionsCollection((prev) => ({
        ...prev,
        [selectedStyleName]: options,
      }));
    },
    [selectedStyleName],
  );

  const setSelectedStyleName = useCallback((name: string) => {
    setSelectedStyleNameState(name);
  }, []);

  // --- Expensive derived values ------------------------------------------
  // These three mirror Pinia's computed() properties. Each does real render
  // work (createAvatar/getAvatarCombinations call into DiceBear's SVG
  // generation), so the dependency arrays below are load-bearing: too broad
  // and every keystroke re-renders every style's thumbnail; too narrow and
  // the UI goes stale after a change. Depend only on the exact primitive
  // values each one actually reads.

  const selectedStyleCombinations = useMemo(
    () =>
      getAvatarCombinations(
        selectedStyleName,
        selectedStyleOptionsCollection[selectedStyleName],
      ),
    [selectedStyleName, selectedStyleOptionsCollection],
  );

  const availableStyles = useMemo(() => {
    const result: SelectedStyleCombinations = {};

    for (const key in styleCollection) {
      if (false === Object.prototype.hasOwnProperty.call(styleCollection, key)) {
        continue;
      }

      result[key] = [
        {
          active: selectedStyleName === key,
          avatar: createAvatar(key, selectedStyleOptionsCollection[key]),
          options: selectedStyleOptionsCollection[key],
        },
      ];
    }

    return result;
  }, [selectedStyleName, selectedStyleOptionsCollection]);

  const selectedStylePreview = useMemo(
    () =>
      createAvatar(
        selectedStyleName,
        selectedStyleOptionsCollection[selectedStyleName],
      ),
    [selectedStyleName, selectedStyleOptionsCollection],
  );

  // --- Tab-change scroll-to-top side effect -------------------------------
  // Mirrors the Pinia store's `watch(selectedTab, () => window.scrollTo(...))`.
  // This has no return value and nothing reads it — it's a pure side effect,
  // easy to lose in a port since there's no template/JSX reference to it.
  // Skipped on the very first render (Vue's `watch` without `{ immediate:
  // true }` doesn't fire on initial value either) via the ref guard below.
  const isFirstTabRender = useRef(true);
  useEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
  }, [selectedTab]);

  const shuffle = useCallback(() => {
    setSelectedStyleOptionsCollection((prev) => ({
      ...prev,
      [selectedStyleName]: getRandomOptions(
        styleCollection[selectedStyleName].options,
      ),
    }));
  }, [selectedStyleName]);

  return {
    selectedStyleName,
    setSelectedStyleName,
    selectedStyleOptions,
    setSelectedStyleOptions,
    selectedTab,
    setSelectedTab,
    availableStyles,
    selectedStyleCombinations,
    selectedStylePreview,
    shuffle,
  };
}
