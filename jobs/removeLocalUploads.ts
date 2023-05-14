const nodeSchedule = require('node-schedule');
const fs = require('fs')
const path = require("path")
const cloudinary = require('cloudinary').v2;

const pathUploads: string = path.join(__dirname, "../public/uploads")

nodeSchedule.scheduleJob("5 * * * *", () => {

    fs.readdir(pathUploads, (err: any, data: Array<string>) => {
        data.forEach((element) => {
            let typefile;
            let typeContent;
            if(element.split('.').pop() == "png" ||element.split('.').pop() == "jpg"){
                typefile = "uploadsImage"
                typeContent = "image"
            }
            else{
                typefile = "uploadsFiles"
                typeContent= "raw"
            }
            fetch(cloudinary.url(typefile+'/'+element,{
                resource_type: typeContent
            }))
                .then(response => {
                    if (response.ok) {
                        fs.unlink(pathUploads + '/' + element, (err: any) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                    }
                })
        })
    })
})

