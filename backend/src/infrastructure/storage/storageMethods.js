const multiparty = require("multiparty");
const { getStorageInstance } = require("./initializeStorage");
const getUserFromToken = require("../../utils/getUserFromToken");

const storageMethods = {
  saveTweetImage: async (req) =>
    new Promise(async (resolve) => {
      const storageInstance = getStorageInstance();
      const author = await getUserFromToken(req);
      const form = new multiparty.Form();
      let isFilePresentInForm = false;
      req.body = {};

      const userBucketName = `${author.nickname.toLowerCase()}-bucket`;
      const userBucketExists = await storageInstance.bucketExists(userBucketName);

      if (!userBucketExists) {
        console.log(`Creating Bucket: ${userBucketName}`);
        await storageInstance.makeBucket(userBucketName).catch((e) => {
          console.log(`Error while creating bucket '${userBucketName}': ${e.message}`);
        });
      }

      form.on("field", async (name, value) => {
        req.body[name] = value;
      });

      form.on("part", async (part) => {
        if (part.filename === undefined) {
          part.resume();
        }

        if (part.filename !== undefined) {
          isFilePresentInForm = true;
          await storageInstance.putObject(userBucketName, part.filename, part);
          req.body.uploadedImageName = part.filename;
          req.body.uploadedImageExtension = part.filename.split(".").pop();
          resolve();
        }
      });

      form.on("close", () => {
        console.log("File upload completed!");
        if (!isFilePresentInForm) resolve();
      });

      form.parse(req);
    }),
  addNewTweetImage: async (req) =>
    new Promise(async (resolve) => {
      const storageInstance = getStorageInstance();
      const author = await getUserFromToken(req);
      const userBucketName = `${author.nickname.toLowerCase()}-bucket`;

      const form = new multiparty.Form();
      req.body = {};

      form.on("part", async (part) => {
        if (part.filename === undefined) {
          part.resume();
        }

        if (part.filename !== undefined) {
          await storageInstance.putObject(userBucketName, part.filename, part);
          req.body.uploadedImageName = part.filename;
          req.body.uploadedImageExtension = part.filename.split(".").pop();
          if (req.body.uploadedImageExtension === "jpg") {
            req.body.uploadedImageExtension = "jpeg";
          }
          resolve();
        }
      });

      form.on("close", () => {
        console.log("File upload completed!");
      });

      form.parse(req);
    }),
  deleteTweetImage: async (tweet) => {
    const storageInstance = getStorageInstance();
    const userBucketName = `${tweet.author.toLowerCase()}-bucket`;

    await storageInstance.removeObject(userBucketName, tweet.imageName);
    console.log(`Tweet image ${tweet.imageName} successfully removed from storage`);
  },
  getTweetImage: async (tweet) => {
    const storageInstance = getStorageInstance();
    const userBucketName = `${tweet.author.toLowerCase()}-bucket`;

    return await storageInstance.getObject(userBucketName, tweet.imageName);
  },
};

module.exports = storageMethods;
