import Service from '@ember/service';
import { PhotoViewer } from '@capacitor-community/photoviewer';

export default class PhotoService extends Service {
  open(url) {
    if (url) {
      PhotoViewer.show({
        images: [{ url }],
        mode: 'one',
      });
    }
  }
}
