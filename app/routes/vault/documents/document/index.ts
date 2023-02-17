import Route from '@ember/routing/route';
import { instrumentRoutePerformance } from '@sentry/ember';
import { VaultRoute } from 'houseninja/data/enums/routes';

class VaultDocumentsDocumentIndexRoute extends Route {
  model(): Document | undefined {
    return this.modelFor(VaultRoute.ShowDocument) as Document;
  }
}

export default instrumentRoutePerformance(VaultDocumentsDocumentIndexRoute);
