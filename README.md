# marketplaceNotifier

This is a script which periodically scrapes few of the most popular Croatian online marketplaces (Njuskalo, Index.hr and Plavi Oglasnik) for new adverts within a specific category and bounds, and immediately notifies the user through a Telegram bot. It is meant to be run as a server app.

### Installation
First, fill .envExample with your data and rename it to .env (last three fields are optional and take an absolute url path to the page you want to scrape).
Then run:
```bash
npm install
npm run build
```

Optionally, you can install a systemd service that runs the script every 30 seconds:
change `User` and `WorkingDirectory` inside `marketplace-notifier.service` and install the service and the timer.

### Running manually
You can run the script once by running `npm start`
