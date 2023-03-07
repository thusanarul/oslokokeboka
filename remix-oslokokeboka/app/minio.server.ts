import * as Minio from "minio";

const { S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } =
  process.env;

if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
  throw new Error("Environment variables needed for minio storage is missing");
}

const config = {
  bucket: S3_BUCKET,
};

const setup = () => {
  console.log("Setting up minio client");

  const minioClient = new Minio.Client({
    endPoint: S3_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
  });

  return minioClient;
};

let minioClient: Minio.Client | undefined;
declare global {
  var __minioClient: Minio.Client | undefined;
}

if (process.env.NODE_ENV === "production") {
  minioClient = setup();
} else {
  if (!global.__minioClient) {
    global.__minioClient = setup();
  }
  minioClient = global.__minioClient;
}

export async function uploadImageToBucket(
  base64: string,
  recipeId: string,
  imageIndex: string
) {
  if (!minioClient) {
    console.error("Minio client not initialized. Not uploading image");
    return null;
  }

  const data = Buffer.from(base64.split(",")[1], "base64");

  const type = base64.split(";")[0].split("/")[1];

  const filename = `${recipeId}/${imageIndex}`;

  const metaData: Minio.ItemBucketMetadata = {
    "Content-Type": `image/${type}`,
    "Content-Encoding": `base64`,
  };

  const res = await minioClient.putObject(
    config.bucket,
    filename,
    data,
    metaData
  );

  console.log(res);
}
