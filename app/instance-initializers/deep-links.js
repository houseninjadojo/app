export function initialize(appInstance) {
  const service = appInstance.lookup('service:deep-links');
  service.start();
}

export default {
  name: 'deep-links',
  initialize,
};
