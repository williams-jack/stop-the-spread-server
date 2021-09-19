# stop-the-spread-server
Back end API for the HackMIT Project Stop The Spread.

# Authors
Jackson Williams, Nicholas Ratliff, and Christopher Muniz

# Purpose
The goal of this project is to provide a proof-of-concept of a COVID-19 contact-tracing application 
that can be used by individuals and business owners to help prevent the spread of COVID-19. Business
owners can register a business account and list their locations in the app. When regular users 
(refferred to as "individuals") enter and exit these listed locations, they log the times they entered
("checked-in") and exited ("checked-out") of the location. When an individual indicates that they have
tested positive for COVID-19, email notifications are sent to all other users that were in that location
during the same timeframe (as long as said timeframe was in the past 14 days). 

This setup is advantageous to both individuals and businesses. Individual users can protect themselves 
and others through the notification system in our app. Businesses can leave the job of contact-tracing
to our application, which will help keep their customers and employees safe. This system allows everyone
to focus on what is truly important, leading happy and healthy lives!

# Installation
Ensure that MongoDB and Node.js are installed on your machine, then execute the following command:\
`$ npm install something`

# Run
In the root directory of this repo, execute the following command:\
`$ node app.js`
