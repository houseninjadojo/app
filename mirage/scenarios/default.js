export default function (server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  // server.createList('post', 10);

  // server.createList('property', 1);
  server.create('user', {
    id: '01ce0d37-cf98-4f3d-9810-2f5781085d5f',
    email: 'miles@houseninja.co',
    firstName: 'Miles',
    lastName: 'Zimmerman',
  });
  server.create('user', {
    id: '22d8949b-11da-4d13-b4f2-574bede56e0f',
    email: 'achilles@houseninja.co',
    firstName: 'Achilles',
    lastName: 'Imperial',
  });
}
