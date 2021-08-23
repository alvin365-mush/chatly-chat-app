const aws = require("aws-sdk");
const dynamoDb = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event, context, callback) => {
  //evnt willcontain event.request.userAttributes.sub
  // insert code to be executed by your lambda trigger
  if (!event?.request?.userAttributes?.sub) {
    console.log("No sub provided");
    return;
  }
  const now = new Date();
  const timestamp = now.getTime();
  const userItem = {
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    createdAt: { S: now.toISOString() },
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
  };
  const params = {
    Item: userItem,
    TableName: tableName,
  };

  //save new user to dynamo db
  try {
    await dynamoDb.putItem(params).promise();
    console.log("success");
  } catch (e) {
    console.log(e);
  }
};
