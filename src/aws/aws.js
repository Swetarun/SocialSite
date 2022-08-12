const aws = require('aws-sdk')

//-------------------aws-----------------------------------------

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1",
});

let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: "2006-03-01" }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",     //access control list
            Bucket: "classroom-training-bucket", //HERE
            Key: "postImage/" + file.originalname, //HERE
            Body: file.buffer,
        };

        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ error: err.message });
            }

            return resolve(data.Location); //link generated
        });

    });
};

module.exports = { uploadFile };
