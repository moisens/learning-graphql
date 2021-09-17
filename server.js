const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');


const app = express();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}))

app.listen(5000, () => {
  console.log(`Server started on port ${5000}`);
});