import AWS from 'aws-sdk'

var bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
var bucketRegion = process.env.NEXT_PUBLIC_AWS_REGION

import { v4 as uuidv4 } from 'uuid'

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.Credentials({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_USER_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_USER_SECRET_ACCESS_KEY,
    }),
})

export const s3Upload = async file => {
    const filename = uuidv4()
    const fileExt = file.name.split('.').pop()
    const key = `${filename}.${fileExt}`
    const upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: key,
            Body: file,
        },
    })
    const promise = upload.promise()
    const data = await promise
    return data.Location
}

export default s3Upload
