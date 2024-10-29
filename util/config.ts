export const Config = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  zerochassSecret: process.env.ZEROCHASS_SECRET,

  awsRegion: process.env.AWS_REGION,
  awsBucket: process.env.AWS_BUCKET,
};
