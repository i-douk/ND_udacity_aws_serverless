
let AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))
const s3bucket = process.env.TODOS_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION


export class AttachmentUtils {
   constructor (
     private readonly  s3 = new XAWS.S3({signatureVersion : 'v4'}),
     private readonly bucketName = s3bucket,
     private readonly expirationTime = signedUrlExpiration,
      ) {}

  async deleteAttachment(todoId: string)  {        
    await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: todoId
    }).promise()
}

  async getUploadUrl(todoId: string): Promise<string> {
  const uploadUrl = this.s3.getSignedUrl('putObject', {
    Bucket: this.bucketName,
    Key: todoId,
    Expires: parseInt(this.expirationTime)
  })
  return uploadUrl
  }
  


}

