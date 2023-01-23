const AWSXRay = require('aws-xray-sdk')
import AWS from 'aws-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
const bucketName = process.env.TODOS_S3_BUCKET

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    const attachmentId = `${todoId}/${userId}/${Date.now()}`
    const presignedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: attachmentId,
      Expires: 300
    })
    return presignedUrl
  }
