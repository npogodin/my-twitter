const Minio = require("minio");

let storageInstance = null;

const getStorageInstance = () => {
  if (storageInstance) {
    return storageInstance;
  }
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ROOT_HOST,
    port: Number(process.env.MINIO_API_PORT),
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    pathStyle: true,
  });

  storageInstance = minioClient;
  return minioClient;
};

const initializeStorage = () => {
  const storageInstance = getStorageInstance();

  (async () => {
    console.log(`Listing all buckets...`);
    const bucketsList = await storageInstance.listBuckets();
    console.log(`Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`);
  })();
};

module.exports = { initializeStorage, getStorageInstance };
