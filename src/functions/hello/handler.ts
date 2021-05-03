import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';

// const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
//   return formatJSONResponse({
//     message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
//     event,
//   });
// }

export const hello: APIGatewayProxyHandler = async(event, _context) =>{
  return{
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless Webpack (Typescript) Your function executed successfully",
      input:event,
    },null,2)
  };
}

