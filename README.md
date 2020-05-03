# Send and Receive mail via Node Js
This repository demo's a nodeJS app to send mails using [SMTP protocol](https://www.npmjs.com/package/nodemailer) and receive them using [IMAP protocol](https://www.npmjs.com/package/mail-notifier).

Run this code or feel free to modify according to your needs.

# Configs
Following configurations are required for boot starting:

1. `gmail_username` and `gmail_password` which would be used for forwarding emails.
2. `forward_alias` where emails can be forwarded.
3. Enable `Less Secure Apps` so that Google does not block sign-in attempt by checking the toggle [here](https://myaccount.google.com/lesssecureapps?pli=1). 
4. Enable IMAP in your Gmail account settings as described [here](https://support.google.com/mail/answer/7126229?hl=en)


# Run
1. Run `npm install && node index.js <custom_port_no>`
2. Go to `http://localhost:3000/send_mail` to send a test mail.
3. Send a mail to username in `configs/defaults.json` to get a notification for the receiving mail.

# Tests

1. Load testing:
Start server `node index.js`
Run Load tests `loadtest -n 2000 http://localhost:3000`
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

2. Received emails are notified in mail object, printed to console as below:

![Receive Mail Test](https://raw.githubusercontent.com/vishwarajanand/NodeJsMailSendNReceive/master/demos/receive_mail_demo.png "Receive Mail Test")

# Demo Video

[![Watch on YouTube](https://img.youtube.com/vi/C-YVCWws7UY/hqdefault.jpg)](https://youtu.be/C-YVCWws7UY)

https://youtu.be/C-YVCWws7UY

# Credits

1. https://github.com/ghansh22/email_using_nodejs/blob/master/mailer.js
2. https://github.com/jcreigno/nodejs-mail-notifier/blob/master/sample/toggled-mail-notifier.js
