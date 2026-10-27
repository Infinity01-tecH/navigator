import type { ConfigStyleOptions, SelectedStyleOptions } from './types';
import getRandomBoolean from './getRandomBoolean';
import getRandomNumber from './getRandomNumber';

export default function getRandomOptions(
  configStyleOptions: ConfigStyleOptions,
): SelectedStyleOptions {
  const result: SelectedStyleOptions = {};

  for (const key in configStyleOptions) {
    if (
      false === Object.prototype.hasOwnProperty.call(configStyleOptions, key)
    ) {
      continue;
    }

    const styleOption = configStyleOptions[key];
    const values = styleOption.values;

    if (getRandomBoolean(styleOption.probability)) {
      const possibleValues = values.filter((v) => v && v !== 'transparent');

      result[key] =
        possibleValues[getRandomNumber(0, possibleValues.length - 1)];
    } else {
      result[key] = values[0];
    }
  }

  return result;
}
