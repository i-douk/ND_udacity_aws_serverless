
let AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(require('aws-sdk'))
const s3bucket = process.env.TODOS_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION


export class AttachmentUtils {
   constructor (
     private readonly  s3 = new XAWS.S3({signatureVersion : 'v4'}),
     private readonly bucketName = s3bucket,
     private readonly expirationTime = parseInt(signedUrlExpiration)
      ) {}

   getAttachmentUrl (todoId :string){
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`

  }

  async deleteAttachment(todoId: string)  {        
    await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: todoId
    }).promise()
}

async getUploadUrl(todoId: string) {
  const uploadUrl = await this.s3.getSignedUrl('putObject', {
    Bucket: this.bucketName,
    Key: `${todoId}.png`,
    Expires: this.expirationTime,
  })
  return uploadUrl as string
}


}

