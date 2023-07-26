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
    // port: 9000,
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
  image: Base64Image,
  recipeId: string,
  imageIndex: string
): Promise<string | null> {
  if (!minioClient) {
    console.error("Minio client not initialized. Not uploading image");
    return null;
  }

  const filename = `${recipeId}/${imageIndex}.${image.type}`;

  const metaData: Minio.ItemBucketMetadata = {
    "Content-Type": `image/${image.type}`,
    "Content-Encoding": `base64`,
  };

  const res = await minioClient.putObject(
    config.bucket,
    filename,
    image.data,
    metaData
  );

  console.log(res);

  return `http://${S3_ENDPOINT}/${S3_BUCKET}/${filename}`;
}

type Base64Image = {
  type: string;
  data: Buffer;
};

export function getBase64ImagesFromFormValue(val: string): Base64Image[] {
  // val format example: 'data:image/png;base64,iVBOR...,data:image/png;base64,iVOOJ...'
  // Split string into array that looks like this: [<type>, <data>, <type>, <data>]
  const split = val.split(",");

  const base64Array: Base64Image[] = [];

  for (let i = 0; i < split.length; i += 2) {
    // type format: data:image/png;base64
    const type = split[i].split(";")[0].split("/")[1];

    // data is a base64 string
    const data = Buffer.from(split[i + 1], "base64");

    base64Array.push({
      type,
      data,
    });
  }

  return base64Array;
}
