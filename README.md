# autoReplier
A nodejs application to reply to emails recieved when youre unavailabe/on vacation

--check for new emails in a given Gmail ID
--send replies to Emails that have no prior replies
--add a Label to the email and move the email to the label
--app repeats this sequence of steps 1-3 in random intervals of 45 to 120 seconds

nvm version v20.8.0

## Packages Used:

### googleapis
https://www.npmjs.com/package/googleapis
Node.js client library for using Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT tokens is included.
very good resource that I found - https://www.fullstacklabs.co/blog/access-mailbox-using-gmail-node

### fs
standard nodejs package for read write utility

### dotenv
for storing and accessing sensitive/protected/(constant) information

### cron
cron is a robust tool for running jobs (functions or commands) on schedules defined using the cron syntax.
Perfect for tasks like data backups, notifications, and many more!

### readline
to generate a CLI