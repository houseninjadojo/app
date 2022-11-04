import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { File, FilePicker } from '@capawesome/capacitor-file-picker';
import { debug } from '@ember/debug';
import { captureException } from 'houseninja/utils/sentry';
import { service } from '@ember/service';

import type MetricsService from 'houseninja/services/metrics';

export default class FileService extends Service {
  @service declare metrics: MetricsService;

  @tracked file: File | undefined;

  clear(): void {
    this.file = undefined;
  }

  async setFileServiceFile(): Promise<void> {
    debug(`Set File Service File: ${this.file?.path}`);
    this.file = await this.getFile();
  }

  async getFile(): Promise<File | undefined> {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/pdf', 'image/png', 'image/jpg', 'image/jpg'],
        multiple: false,
        readData: true,
      });
      const file = result.files[0];
      if (file) {
        const { name, mimeType, size, path } = file;
        this.metrics.trackEvent({
          event: 'file.opened',
          properties: { name, mimeType, size, path },
        });
        return file;
      }
    } catch (e) {
      captureException(e as Error);
    }
  }
}
