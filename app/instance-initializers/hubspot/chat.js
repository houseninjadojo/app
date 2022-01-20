export function initialize(appInstance) {
  const notifications = appInstance.lookup('service:notifications');

  window.HubSpotConversations.on(
    'unreadConversationCountChanged',
    (payload) => {
      notifications.add('local', 'state?', {
        id: 1,
        title: `You have ${payload.unreadCount} chat notifications.`,
      });
    }
  );
}

export default {
  initialize,
  after: 'notifications',
};
