/**
 * Start the deep links handler service on application boot
 *
 * @see /app/services/deep-links.js
 * @see https://guides.emberjs.com/release/applications/initializers/#toc_application-instance-initializers
 */
export function initialize(appInstance) {
  const service = appInstance.lookup('service:deep-links');
  service.start();
}

export default {
  after: 'session-setup',
  name: 'deep-links',
  initialize,
};
