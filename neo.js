const neo4j = require("neo4j-driver");

function connect(dbName) {
  this.dbName = dbName;
  this.driver = neo4j.driver(
    process.env.NEO4J_URL,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );
}

function session() {
  return this.driver.session({
    database: this.dbName,
    defaultAccessMode: neo4j.session.WRITE,
  });
}

module.exports = {
  connect,
  session,
  dropAll: "MATCH (n) DETACH DELETE n",
  makeFriends:
    "MATCH (user:User {id: $userId}) WITH user MATCH (friend:User {id: $friendId}) MERGE (user)-[:FRIENDS]->(friend)",
  register: "MERGE (user:User { id:$userId, email:$email })",
  getAllFriends:
  "MATCH (user:User {id: $userId})<-[:FRIENDS]->(friends:User) RETURN friends",
};
