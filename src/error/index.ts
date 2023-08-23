import typeUtil from 'util/types';

export { UnsupportedOsError } from './unsupported-os';

export const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  typeUtil.isNativeError(error);
