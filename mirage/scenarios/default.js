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
  server.create('user', {
    id: '61f1f8d79f08390069a537c3',
    email: 'achilles.imperial@gmail.com',
    firstName: 'Ottomanelli',
    lastName: 'Imperial',
  });
  server.create('user', {
    id: '61fc347b504a01006933ed13',
    email: 'miles@houseninja.co',
    firstName: 'Miles',
    lastName: 'Zimmerman',
  });

  server.loadFixtures();
}
