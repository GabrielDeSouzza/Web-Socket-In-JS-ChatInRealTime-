const nodeSchedule = require('node-schedule');
const fs = require('fs')
const path = require("path")
const cloudinary = require('cloudinary').v2;

const pathUploads: string = path.join(__dirname, "../public/uploads")

nodeSchedule.scheduleJob("5 * * * *", () => {

    fs.readdir(pathUploads, (err: any, data: Array<string>) => {
        data.forEach((element) => {
            fetch(cloudinary.url('wsChatAppUploads/' + element))
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

