const graphql = require('graphql');
//const _= require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema

} = graphql;

//const users = [
//  { id: '23', firstname: 'Amanda', age: 35 },
//  { id: '47', firstname: 'Helene', age: 34 },
//];


//shema company
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields : {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
});


//schema user
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  },

});

//Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        //return _.find(users, { id: args.id });
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});


module.exports = new GraphQLSchema({
  query: RootQuery
});
