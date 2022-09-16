import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { FilePicker } from '@capawesome/capacitor-file-picker';

export default class FileService extends Service {
  @tracked file = null;

  clear() {
    this.file = null;
  }

  async setFileServiceFile() {
    this.file = await this.getFile();
    console.log(this.file);
  }

  async getFile() {
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
      console.log(e);
    }
  }
}
