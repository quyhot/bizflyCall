const awsConfig = {
    accessKeyId: process.env.BIZFLY_ACCESSKEY_ID || '<Your secret key>',
    secretAccessKey: process.env.BIZFLY_SECRET_ACCESSKEY || '<Your secret access key>',
    region: process.env.BIZFLY_REGION || '<Your region>',
    endpoint: process.env.BIZFLY_ENDPOINT || '<Your endpoint>',
    apiVersions: {
        s3: '2006-03-01'
    },
    logger: process.stdout
}

const bucketName = process.env.BUCKET_NAME || '<Your bucket>'

const awsSetup = () => {
    const AWS = require('aws-sdk')
    AWS.config.update(awsConfig)
    return AWS
}

const uploadS3 = async (s3, uploadParams) => {
    return new Promise((resolve, reject) => {
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log('Error', err)
                reject({err})
            }
            if (data) {
                console.log('Upload Success', data.Location)
                resolve({data})
            }
        })
    })
}

const uploadFile = async (AWS) => {
    const fs = require('fs')
    const path = require('path')
    const s3 = new AWS.S3()

    const file = './aa.jpeg'
    const uploadParams = {Bucket: bucketName, Body: ''}
    const fileStream = fs.createReadStream(file)
    fileStream.on('error', function (err) {
        console.log('File Error', err)
    })
    uploadParams.Body = fileStream
    uploadParams.Key = `/testaa/${path.basename(file)}`
    uploadParams.ContentType = 'image/jpeg'
    uploadParams.ACL = 'public-read'
    uploadParams.Metadata = {}
    const a = await uploadS3(s3, uploadParams)
    console.log(a)
}

const getFiles = async (s3, bucketParams) => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(bucketParams, (err, data) => {
            if (err) {
                console.log("Error getFiles ", err)
                reject({err})
            } else {
                console.log("Success")
                resolve({data})
            }
        })
    })
}

const deleteFile = async (s3, params) => {
    params.Bucket = bucketName
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.log("Error deleteFile ", err)
                reject({err})
            } else {
                console.log("Success")
                resolve({data})
            }
        })
    })
}

const deleteFiles = async (s3, params) => {
    params.Bucket = bucketName
    return new Promise((resolve, reject) => {
        s3.deleteObjects(params, (err, data) => {
            if (err) {
                console.log("Error deleteFile ", err)
                reject({err})
            } else {
                console.log("Success")
                resolve({data})
            }
        })
    })
}

const getAllFileInBucket = async (AWS) => {
    const s3 = new AWS.S3()
    const bucketParams = {
        Bucket: bucketName,
        // Delimiter: 'testaa/',
        Prefix: '/testaa/',
    }
    const {data} = await getFiles(s3, bucketParams)
    return data
}

const deleteAFile = async (AWS, folder) => {
    const s3 = new AWS.S3()
    const params = {
        Key: '/testaa/'
    }
    const data = await deleteFile(s3, params)
    console.log('aaa')
}

const deleteMultiFile = async (AWS, files) => {
    const s3 = new AWS.S3()
    const params = {
        Bucket: bucketName,
        Delete: {
            Objects: []
        }
    }
    for (const file of files) {
        params.Delete.Objects.push({
            Key: file.Key
        })
    }
    const data = await deleteFiles(s3, params)
    console.log('aaa')
}


(async () => {
    const AWS = awsSetup()
    // const data = await getAllFileInBucket(AWS)
    // await uploadFile(AWS)
    // await deleteAFile(AWS, data)
    // await deleteMultiFile(AWS, data.Contents)
    console.log('aaaaaaa')
})()
