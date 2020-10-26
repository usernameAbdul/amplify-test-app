require("dotenv").config()
 const axios = require('axios');

const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const listTodos = gql`
  query listTodos {
    listTodos {
      items {
        id
        name
        description
      }
    }
  }
`
const deleteTodo = gql `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      priority
      createdAt
      updatedAt
    }
  }
`
exports.handler = async (event) => {
    
  try {
    
    const allTodos=await getAllTodos()

   
    if(allTodos.length){
        await Promise.all(allTodos.map(todo=>deletingTodos(todo.id)));
    }
    const body = {
        message: "successfully created todo!"
      }
      return {
        statusCode: 200,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
      }
    
  } catch (err) {
    console.log('error posting to appsync: ', err);
  } 
}
async function getAllTodos(){
    const graphqlData = await axios({
        url: process.env.API_URL,
        method: 'post',
        headers: {
          'x-api-key': process.env.API_KEY
        },
        data: {
          query: print(listTodos),
        }
      });
      return graphqlData.data.data.listTodos.items;
}
async function deletingTodos(id){
  
    const graphqlData = await axios({
        url: process.env.API_URL,
        method: 'post',
        headers: {
          'x-api-key': process.env.API_KEY
        },
        data: {
          query: print(deleteTodo),
          variables: {
            input: {
              id: id,
             
            }
          }
        }
      });
    
}