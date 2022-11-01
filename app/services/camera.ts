import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import Sentry, { captureException } from 'houseninja/utils/sentry';

export default class CameraService extends Service {
  @tracked image: Photo | undefined;

  clear(): void {
    this.image = undefined;
  }

  async setCameraServiceImage(source: CameraSource): Promise<void> {
    this.image = await this.getImage(source);
  }

  async getImage(source: CameraSource): Promise<Photo | undefined> {
    Sentry.addBreadcrumb({
      type: 'ui',
      category: 'camera',
      message: 'taking a photo',
    });
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source,
      });
      return image;
    } catch (e) {
      captureException(e as Error);
    }
  }
}
