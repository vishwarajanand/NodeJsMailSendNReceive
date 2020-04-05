# Send and Recieve mail via Node Js
This repository demo'es a nodeJS app to send mails using SMPT protocol and receive using IMAP protocol.

# Run
1. Add SMTP server username and passwords in `configs/defaults.json`
2. Authorize "less secure apps" for Gmail as described [here](https://support.google.com/accounts/answer/6010255?hl=en)
3. Enable IMAP in your Gmail account settings as described [here](https://support.google.com/mail/answer/7126229?hl=en)
4. Run `npm install && node index.js`
5. Go to `http://localhost:3000/send_mail` to send a test mail.
6. Send a mail to username in `configs/defaults.json` to get a notification for the receiving mail.

# Tests

1. Load testing:
Start server `node index.js`
Run Loadtests `loadtest -n 2000 http://localhost:3000`
Traffic should be served from several workers

2. Cluster Management using pm2:
start pm2 cluster management `pm2 start app.js -i 3` 
(or use `pm2 start app.js -i -1` to autoselect #instances)
see seen list `pm2 list`
see live monitor `pm2 monit`
stop app `pm2 stop app`
(or use `pm2 stop all`)
remove app `pm2 delete app`
(or use `pm2 delete all`)

# Previews

1. Sent mails are seen as below:

![Send Mail Test](https://raw.githubusercontent.com/vishwarajanand/NodeJsMailSendNReceive/master/demos/send_mail_demo.png "Send Mail Test")

2. Received mails are notified in mail object, printed to console as below:

![Receive Mail Test](https://raw.githubusercontent.com/vishwarajanand/NodeJsMailSendNReceive/master/demos/receive_mail_demo.png "Receive Mail Test")

# Demo Video

ToDo: Will upload later

# Credits

1. https://github.com/ghansh22/email_using_nodejs/blob/master/mailer.js
2. https://github.com/jcreigno/nodejs-mail-notifier/blob/master/sample/toggled-mail-notifier.js
