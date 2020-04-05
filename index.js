const http = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const port = parseInt(process.argv[2] || '3000')
const configs = require("./configs/defaults.json")

// include nodemailer to send mails
const nodemailer = require('nodemailer');
// const LocalStorage = require('node-localstorage').LocalStorage;
// localStorage = new LocalStorage('./data');
if (cluster.isMaster) {
    console.log('this is the master process: ', process.pid)
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`worker process ${process.pid} had died`)
        console.log(`starting new worker`)
        cluster.fork()
    })

    // receive mails on master
    const notifier = require('mail-notifier');
    const imap = {
        user: configs.smpt_server.username,
        password: configs.smpt_server.password,
        host: "imap.gmail.com",
        port: 993, // imap port
        tls: true,// use secure connection
        tlsOptions: { rejectUnauthorized: false }
    };

    var notification = notifier(imap)
        .on('mail', mail => console.log(mail)) // or use it wisely!
        .start();

    notification.on('end', function () {
        console.log('...notification ended...');
    });

    notification.on('error', function (err) {
        console.log('...notification error : %s', err);
    });

    notification.start();

} else {
    // send mails by workers
    console.log(`started a worker at ${process.pid}`)
    http.createServer((req, res) => {
        console.log(`serving form ${process.pid}`)
        if (req.url === '/kill') {
            res.end(`killing: ${process.pid}`)
            process.exit()
        }
        else if (req.url === '/configs') {
            res.end(JSON.stringify(configs))
        } else if (req.url === '/send_mail') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: configs.smpt_server.username,
                    pass: configs.smpt_server.password
                }
            });
            // email options
            let mailOptions = {
                from: configs.smpt_server.username,
                to: configs.smpt_server.forward_alias || configs.smpt_server.username,
                subject: 'Test email from Node JS App',
                text: 'Hello pinged from Node Js. Yoo Hoo!'
            };// send email
            transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                    console.log(error)
                    res.end(`Mail sending failed due to error: ${error}`)
                }
                console.log(response)
                res.end("Mail sent successfully!")
            });
        } else {
            res.end('invalid path')
        }
    }).listen(port)
    console.log(`index.js service running on port ${port}`)
}
