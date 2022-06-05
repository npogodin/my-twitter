const Minio = require("minio");

const initializeStorage = () => {
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ROOT_HOST,
    port: Number(process.env.MINIO_API_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    pathStyle: true,
  });

  const bucketName = "first-bucket";
  (async () => {
    console.log(`Creating Bucket: ${bucketName}`);
    await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
      console.log(`Error while creating bucket '${bucketName}': ${e.message}`);
    });

    console.log(`Listing all buckets...`);
    const bucketsList = await minioClient.listBuckets();
    console.log(`Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`);
  })();
};

module.exports = initializeStorage;
