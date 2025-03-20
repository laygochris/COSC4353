// const bcrypt = require('bcrypt');
// const plainText = "zelda4ever";
// bcrypt.hash(plainText, 10).then(hash => {
//   console.log("Hash:", hash);
//   bcrypt.compare(plainText, hash).then(isMatch => {
//     console.log("Do they match?", isMatch);
//   });
// });
// const plainText2 = "password";
// const hash = "$2b$10$1QbZlEr7p/U4d8NoPJtbLOow1smFu/vpWLctzM6GQrNSbWBiPQnSG"; // hash from your DB

// bcrypt.compare(plainText2, hash)
//   .then(isMatch => {
//     console.log("Comparison result:", isMatch);
//   })
//   .catch(err => {
//     console.error("Error comparing:", err);
//   });

const bcrypt = require('bcrypt');
const plainText = "password";
bcrypt.hash(plainText, 10).then(hash => {
  console.log("Newly generated hash:", hash);
  return bcrypt.compare(plainText, hash);
}).then(isMatch => {
  console.log("Comparison result (fresh):", isMatch);
}).catch(err => {
  console.error("Error:", err);
});
