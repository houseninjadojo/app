export default function (server) {
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  // server.createList('post', 10);

  // server.createList('property', 1);
  server.create('user', {
    id: 'c1022bb5-80f3-4248-918c-48f6eb7114c0',
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
    id: 'ac8e5f27-6929-4afa-9a04-07696efeedf9',
    email: 'achilles+andrew@houseninja.co',
    firstName: 'Andrew',
    lastName: 'Demo',
  });

  server.createList('payment-method', 5);
  // server.createList('work-order', 50);

  server.loadFixtures();
}
