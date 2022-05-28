const http = require("http");
const mysql = require("mysql");
const Minio = require("minio");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER_NAME,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to DB!");
});

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

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(process.env.PORT,  () => {
  console.log(`Server running at http://localhost:${process.env.PORT}/`);
});
