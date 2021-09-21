const graphql = require("graphql");
//const _= require('lodash');
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//const users = [
//  { id: '23', firstname: 'Amanda', age: 35 },
//  { id: '47', firstname: 'Helene', age: 34 },
//];

//shema company
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

//schema user
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

//Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        //return _.find(users, { id: args.id });
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((res) => res.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstname, age }) {
        return axios
          .post("http://localhost:3000/users", { firstname, age })
          .then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { id, firstname, age, companyId }) {
        return axios.patch(`http://localhost:3000/users/${id}`, { id, firstname, age, companyId })
          .then(response => (response.data))
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

/*
Naming in the same query
{
	SGC: company(id: "1") {
    id
    name
    description
  }
  
  Sanctuary: company(id: "2") {
    id
    name
    description
    
  }
}


{
  "data": {
    "SGC": {
      "id": "1",
      "name": "Stargate Command",
      "description": "Go beyond"
    },
    "Sanctuary": {
      "id": "2",
      "name": "Sanctuary",
      "description": "Beautiful creatures"
    }
  }
}


//Fragment details in graphiql
{
	SGC: company(id: "1") {
    ...companyDetails
  }
  
  Sanctuary: company(id: "2") {
    ...companyDetails
    
  }
}


fragment companyDetails on Company {
  id
  name
  description
}

*/
