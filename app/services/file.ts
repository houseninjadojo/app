import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { File, FilePicker } from '@capawesome/capacitor-file-picker';
import { debug } from '@ember/debug';
import { captureException } from 'houseninja/utils/sentry';

export default class FileService extends Service {
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
      if (result?.files.length !== 0) {
        return result.files[0];
      }
    } catch (e) {
      captureException(e as Error);
    }
  }
}
