import type { V1, V2 } from 'paseto.js';
import type { PasetoVersion } from './PasetoVersion';

export interface IPasetoVersionNameMap {
    [PasetoVersion.v1]: V1;
    [PasetoVersion.v2]: V2;
}
