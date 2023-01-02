import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { captureException } from 'houseninja/utils/sentry';
import { service } from '@ember/service';
import { debug } from '@ember/debug';
import type MetricsService from 'houseninja/services/metrics';

export default class CameraService extends Service {
  @service declare metrics: MetricsService;

  @tracked image: Photo | undefined;

  clear(): void {
    this.image = undefined;
  }

  async setCameraServiceImage(source: CameraSource): Promise<void> {
    this.image = await this.getImage(source);
  }

  async getImage(source: CameraSource): Promise<Photo | undefined> {
    debug('[camera] getting image');
    try {
      const options = {
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source,
      };
      this.metrics.trackEvent({
        event: 'camera.capture',
        properties: options,
        breadcrumb: {
          type: 'ui',
          message: 'capturing image',
        },
      });
      const image = await Camera.getPhoto(options);
      return image;
    } catch (e) {
      captureException(e as Error);
    }
  }
}
export { CameraSource, Photo };
