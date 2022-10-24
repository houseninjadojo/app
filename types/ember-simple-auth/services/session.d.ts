/* eslint-disable @typescript-eslint/no-explicit-any */
import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Transition from '@ember/routing/transition';

interface Data {
  authenticated: {
    id: string;
    access_token: string;
    authenticator: string;
    kind?: string;
  };
}

declare module 'ember-simple-auth/services/session' {
  export default class session extends Service.extend(Evented) {
    /**
     * Triggered whenever the session is successfully authenticated. This happens
     * when the session gets authenticated via
     * {{#crossLink "SessionService/authenticate:method"}}{{/crossLink}} but also
     * when the session is authenticated in another tab or window of the same
     * application and the session state gets synchronized across tabs or windows
     * via the store (see
     * {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
     * When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
     * event will automatically get handled (see
     * {{#crossLink "ApplicationRouteMixin/sessionAuthenticated:method"}}{{/crossLink}}).
     * @event authenticationSucceeded
     * @public
     */

    /**
     * Triggered whenever the session is successfully invalidated. This happens
     * when the session gets invalidated via
     * {{#crossLink "SessionService/invalidate:method"}}{{/crossLink}} but also
     * when the session is invalidated in another tab or window of the same
     * application and the session state gets synchronized across tabs or windows
     * via the store (see
     * {{#crossLink "BaseStore/sessionDataUpdated:event"}}{{/crossLink}}).
     * When using the {{#crossLink "ApplicationRouteMixin"}}{{/crossLink}} this
     * event will automatically get handled (see
     * {{#crossLink "ApplicationRouteMixin/sessionInvalidated:method"}}{{/crossLink}}).
     * @event invalidationSucceeded
     * @public
     */

    isAuthenticated: boolean;
    data: Data | null;
    store: any;
    attemptedTransition: any;
    session: any;

    set(key: any, value: any): any;
    authenticate(...args: any[]): Promise<any>;
    invalidate(...args: any): Promise<any>;
    authorize(...args: any[]): Promise<any>;
    setup(): void;

    requireAuthentication(transition: Transition, route: string): void;
    handleAuthentication(routeAfterAuthentication: string): void;
    handleInvalidation(routeAfterInvalidation: string): void;
  }
}
