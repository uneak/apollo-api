export default ({ mongoClient = null }) => {
  // do Something with options
  return () => ({
    // users: new Users(mongoClient.db().collection("users")),
  });
};
