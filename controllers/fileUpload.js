const File = require("../models/File");
const cloudinary = require("cloudinary").v2;


//localFileUpload handlers

exports.localFileUpload = async(req,res) => {
    try{ 
        //fetch file from request
        const file = req.files.file; //hierarchy to fetch file from the body

        //create path where file is ned to br stored
        let path = __dirname + "/files" + Date.now()+"."+`${file.name.split('.'[1])}`; //server ka path
        console.log("PATH->",path);

        //add path to the move function
        file.mv(path,(err) => {
            console.log(err);
        });
        //create a successful response
        res.json({
            success:true,
            message: "local file uploaded successfully"
        });

    }
    catch(error){
        console.log(error);
    }
}

function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file,folder,quality){
     const options = {
         folder: folder,
         
    //     // public_id: file.name.split('.')[0], // Use original file name (without extension)
    //     // use_filename: true, // Preserve the file name
    //     // unique_filename: false // Prevent random renaming
     };
     if(quality){
        options.quality = quality;
     }
    options.resource_type = "auto";
    console.log("temp file path",file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

//image upload handler
exports.imageUpload = async(req,res) =>{
    try{
        //data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success : false,
                message: "File type not supported",
            })
        }
        //file type supported
        console.log("uploading to ch");
        const response = await uploadFileToCloudinary(file,"CodeHelp");
        console.log("response",response);

        //Db me entry krna hai
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl : response.secure_url,
        })
        res.json({
            success : true,
            message :"Image Successfully uploaded",
        })
    }
    catch(err){
        console.error(err);
            res.status(400).json({
                success:false,
                message : "Something went wrong"

            })
        }
    }

    //video upload ka handler

    exports.videoUpload = async(req,res) => {
        try{
            //data fetch

            const {name,tags,email} = req.body;
            console.log(name,tags,email);
            const file = req.files.videoFile;
            console.log(file);
            
            //validation
            const supportedTypes = ["mp4","mov"];
            const fileType = file.name.split('.')[1].toLowerCase();
            //if multiple '.'
            //const fileType = file.name.split('.').pop().toLowerCase();
            //todo : add a upper limit of 5 mb for video

            if(!isFileTypeSupported(fileType,supportedTypes)){
                return res.status(400).json({
                    success : false,
                    message: "File type not supported",
                })
            }

            //file format supported
            console.log("uploading to ch");
            const response = await uploadFileToCloudinary(file,"CodeHelp");
            console.log("response",response);

            //Db me entry krna hai
            const fileData = await File.create({
                name,
                tags,
                email,
                imageUrl : response.secure_url,
            })
            res.json({
                success : true,
                message :"Video Successfully uploaded",
            })


        }
        catch(err){
            console.error(err);
            res.status(400).json({
                success:false,
                message:"something went wrong"
            })

        }
    }


    exports.imageSizeReducer = async(req,res) =>{
        try{
            //data fetch
            const {name,tags,email} = req.body;
            console.log(name,tags,email);
    
            const file = req.files.imageFile;
            console.log(file);
    
            //validation
            const supportedTypes = ["jpg","jpeg","png"];
            const fileType = file.name.split('.')[1].toLowerCase();
    
            if(!isFileTypeSupported(fileType,supportedTypes)){
                return res.status(400).json({
                    success : false,
                    message: "File type not supported",
                })
            }

            //file type supported
            console.log("uploading to ch");
            // here 30 is new quality
            const response = await uploadFileToCloudinary(file,"CodeHelp",70);
            console.log("response",response);
    
            //Db me entry krna hai
            const fileData = await File.create({ 
                name,
                tags,
                email,
                imageUrl : response.secure_url,
            })
            res.json({
                success : true,
                message :"Image Successfully uploaded",
            })
        }
        catch(err){
            console.error(err);
                res.status(400).json({
                    success:false,
                    message : "Something went wrong"
    
                })
            }
        }


