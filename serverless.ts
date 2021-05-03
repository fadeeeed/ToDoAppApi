import type { AWS } from '@serverless/typescript';

//dynamodb Import
import dynamoDbTables from './resources/dynamodb-tables';
const serverlessConfiguration: AWS = {
  service: 'todoappapi',
  frameworkVersion: '2',
  custom: {
    region:'${opt:region,self:provider.region}',
    stage: '${opt:stage,self:provider.stage}',
    prefix:'${self:service}-${self:custom.stage}',
    list_table:'${self:service}-list-table-${opt:stage,self:provider.stage}',
    tasks_table: '${self:service}-tasks-table-${opt:stage,self:provider.stage}',
    table_throughputs:{
      prod: 5,
      default:1,
    },
    table_throughput: '${self:custom.TABLE.THROUGHPUTS.${self:custom.stage},self:custom.table_throughputs.default}',
    dynamodb:{
      stages:['dev'],
      start:{
        port:8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      }
    },
    ['serverless-offline']:{
      httpPort:3000,
      babelOptions:{
        presets:["env"]
      }
    }
  },
  plugins: [
    'serverless-bundle',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage:'dev',
    region:'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION:'${self:custom.region}',
      STAGE:'${self:custom.stage}',
      LIST_TABLE:'${self:custom.list_table}',
      TASKS_TABLE:'${self:custom.tasks_table}',
    },
    iamRoleStatements:[
      {
        Effect:'Allow',
        Action:[
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource:[
          {"Fn::GetAtt":['ListTable','Arn']},
          {"Fn::GetAtt":['TasksTable','Arn']}
        ]
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  package:{
    individually:true,
  },
  // import the function via paths
  functions: { 
    hello:{
      handler: 'src/functions/hello/handler.hello',
      events:[
        {
          http:{
            method: 'get',
            path:'hello',
          }
        }
      ]
    }
  },
  resources:{
    Resources:dynamoDbTables,
  }
};

module.exports = serverlessConfiguration;
