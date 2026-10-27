import type { ConfigStyleCollection } from '../../lib/avatarEditor/types';
import { Style } from '@dicebear/core';
import getSchemaOptions from '../../lib/avatarEditor/getSchemaOptions';

import adventurerDef from '@dicebear/styles/adventurer.json';
import adventurerNeutralDef from '@dicebear/styles/adventurer-neutral.json';
import avataaars from '@dicebear/styles/avataaars.json';
import avataaarsNeutralDef from '@dicebear/styles/avataaars-neutral.json';
import bigEarsDef from '@dicebear/styles/big-ears.json';
import bigEarsNeutralDef from '@dicebear/styles/big-ears-neutral.json';
import bigSmileDef from '@dicebear/styles/big-smile.json';
import botttsDef from '@dicebear/styles/bottts.json';
import botttsNeutralDef from '@dicebear/styles/bottts-neutral.json';
import croodlesDef from '@dicebear/styles/croodles.json';
import croodlesNeutralDef from '@dicebear/styles/croodles-neutral.json';
import dylanDef from '@dicebear/styles/dylan.json';
import funEmojiDef from '@dicebear/styles/fun-emoji.json';
import glassDef from '@dicebear/styles/glass.json';
// Curated replacement for @dicebear/styles/glyphs.json: same schema/meta/colors
// as the stock Glyphs style, but all 35 default shape variants are swapped for
// 55 career/profession icons. Lives locally, not in node_modules, because it's
// genuinely custom content — not something `npm install` can provide.
import glyphsCareerDef from './data/glyphs-career.json';
import initialsDef from '@dicebear/styles/initials.json';
import loreleiDef from '@dicebear/styles/lorelei.json';
import loreleiNeutralDef from '@dicebear/styles/lorelei-neutral.json';
import micahDef from '@dicebear/styles/micah.json';
import mininavsDef from '@dicebear/styles/miniavs.json';
import notionistsDef from '@dicebear/styles/notionists.json';
import notionistsNeutralDef from '@dicebear/styles/notionists-neutral.json';
import openPeepsDef from '@dicebear/styles/open-peeps.json';
import personasDef from '@dicebear/styles/personas.json';
import pixelArtDef from '@dicebear/styles/pixel-art.json';
import pixelArtNeutralDef from '@dicebear/styles/pixel-art-neutral.json';
import thumbsDef from '@dicebear/styles/thumbs.json';
import toonHeadDef from '@dicebear/styles/toon-head.json';

function createStyle(definition: unknown): {
  style: Style;
  options: ReturnType<typeof getSchemaOptions>;
} {
  const style = new Style(definition);

  return { style, options: getSchemaOptions(style) };
}

const availableStyles: ConfigStyleCollection = {
  adventurer: createStyle(adventurerDef),
  adventurerNeutral: createStyle(adventurerNeutralDef),
  avataaars: createStyle(avataaars),
  avataaarsNeutral: createStyle(avataaarsNeutralDef),
  bigEars: createStyle(bigEarsDef),
  bigEarsNeutral: createStyle(bigEarsNeutralDef),
  bigSmile: createStyle(bigSmileDef),
  bottts: createStyle(botttsDef),
  botttsNeutral: createStyle(botttsNeutralDef),
  croodles: createStyle(croodlesDef),
  croodlesNeutral: createStyle(croodlesNeutralDef),
  dylan: createStyle(dylanDef),
  funEmoji: createStyle(funEmojiDef),
  glass: createStyle(glassDef),
  glyphs: createStyle(glyphsCareerDef),
  initials: createStyle(initialsDef),
  lorelei: createStyle(loreleiDef),
  loreleiNeutral: createStyle(loreleiNeutralDef),
  micah: createStyle(micahDef),
  miniavs: createStyle(mininavsDef),
  notionists: createStyle(notionistsDef),
  notionistsNeutral: createStyle(notionistsNeutralDef),
  openPeeps: createStyle(openPeepsDef),
  personas: createStyle(personasDef),
  pixelArt: createStyle(pixelArtDef),
  pixelArtNeutral: createStyle(pixelArtNeutralDef),
  thumbs: createStyle(thumbsDef),
  toonHead: createStyle(toonHeadDef),
};

export default availableStyles;
