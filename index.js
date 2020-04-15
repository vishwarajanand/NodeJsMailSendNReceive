const http = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const port = parseInt(process.argv[2] || '3000')
const configs = require("./configs/defaults.json")

// include nodemailer to send mails
const nodemailer = require('nodemailer');
// const simpleParser = require('mailparser').simpleParser;

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

    // receive mails on master by mail-notifier
    const notifier = require('mail-notifier');
    const imap = {
        user: configs.email_server.gmail_username,
        password: configs.email_server.gmail_password,
        host: "imap.gmail.com",
        port: 993, // imap port
        tls: true,// use secure connection
        tlsOptions: { rejectUnauthorized: false }
    };

    var notification = notifier(imap)
        .on('mail', mail => {
            // simpleParser(mail, { streamAttachments: true }, (err, parsed) => {
            //     console.log("parsed.headers", parsed.headers);
            //     console.log("parsed.subject", parsed.subject);
            //     console.log("parsed.to", parsed.to);
            //     console.log("parsed.cc", parsed.cc);
            //     console.log("parsed.bcc", parsed.bcc);
            //     console.log("parsed.date", parsed.date);
            //     console.log("parsed.messageId", parsed.messageId);
            //     console.log("parsed.inReplyTo", parsed.inReplyTo);
            //     // console.log("parsed.reply-to", parsed.reply - to);
            //     console.log("parsed.references", parsed.references);
            //     console.log("parsed.html", parsed.html);
            //     console.log("parsed.text", parsed.text);
            //     console.log("parsed.textAsHtml", parsed.textAsHtml);
            //     console.log(JSON.stringify(parsed));
            // });
            console.log(mail);

            // get the msid
            var sub = mail.subject;

            // get the message
            var mail_body_threads = mail.text.split(configs.email_parser_settings.thread_seperator);
            var latest_msg = mail_body_threads.length > 0 ? mail_body_threads[0] : "";

            console.log("Subject:", sub);
            console.log("Message Body:", latest_msg);
        })
        .start();

    notification.on('end', function () {
        console.log('...notification ended...');
    });

    notification.on('error', function (err) {
        console.log('...notification error : %s', err);
    });

    notification.start();

} else {
    // send mails on workers by nodemailer
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
                    user: configs.email_server.gmail_username,
                    pass: configs.email_server.gmail_password
                }
            });
            // email options
            let mailOptions = {
                from: configs.email_server.gmail_username,
                to: configs.email_server.forward_alias || configs.email_server.gmail_username,
                subject: configs.email_parser_settings.subject_prefix + 'Test email from Node JS App',
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
