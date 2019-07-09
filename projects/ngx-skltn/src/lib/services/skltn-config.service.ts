import { InjectionToken } from '@angular/core';
import { SkltnConfig } from '../interfaces/skltn-config';

export const SkltnConfigService = new InjectionToken<SkltnConfig>('SkltnConfig');
