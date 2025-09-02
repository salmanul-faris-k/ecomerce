const { ObjectId } = require("mongodb");

for (let i = 0; i < 30; i++) {
  console.log(new ObjectId().toString());
}
