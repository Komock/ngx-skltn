import { Injectable, Inject } from '@angular/core';
import { SkltnConfig } from '../interfaces/skltn-config';
import { SKLTN_CONFIG_TOKEN } from './skltn-config.service';

@Injectable({
  providedIn: 'root'
})
export class SkltnService {

  ids: string[] = [];

  config: SkltnConfig;

  private defaultConfig: SkltnConfig = {
    rectRadius: 4,
    bgFill: '#ddd',
    flareFill: 'rgba(255, 255, 255, 0.6)',
    flareWidth: '150px',
    duration: 1200,
    delay: 0,
    timing: 'ease-in-out',
  };

  constructor(
    @Inject(SKLTN_CONFIG_TOKEN) config: SkltnConfig,
  ) {
    this.config = Object.assign({}, this.defaultConfig, config);
  }

}
