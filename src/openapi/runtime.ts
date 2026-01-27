import OASNormalize from 'oas-normalize';
import Oas from 'oas';
import type { GroupedPaths } from '../api/declaration';

export const getPathsFromOpenApi = async <T>(
  input: T,
): Promise<GroupedPaths> => {
  const normalizedOas = new OASNormalize(input, {
    enablePaths: false,
  });
  // @ts-expect-error
  const oas = new Oas(await normalizedOas.load());

  return {};
};
