<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Kafka -> Discord Project</h3>

  <p align="center">
    A project done to understand how Kafka works by producing messages and sending them to a discord server
  </p>
</div>

### Built With

* [Node.js](https://nodejs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [KafkaJS](https://kafka.js.org/)
* [Docker](https://docs.docker.com/)


<!-- GETTING STARTED -->
## Getting Started
### Prerequisites

Make sure you have Node, NPM, and Docker installed
* NPM
  ```sh
  sudo apt install npm
  ```
* Node.js
  ```sh
  sudo apt install nodejs
  ```
* [Docker](https://docs.docker.com/engine/install/ubuntu/)


### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repository and enter the folder
```sh
git clone git@github.com:brenno-calado/kafka-discord.git && cd kafka-discord
```
2. Get a Discord bot url by accessing server config > integrations > webhooks > new webhook

3. Copy the bot's name and the webhook url and put it in your .env file at consumer folder
  example of environments for consumer:
  - KAFKA_CLIENT_ID=DISCORD
  - KAFKA_BROKERS=localhost:9092
  - KAFKA_GROUP_ID=NPM
  - DISCORD_URL=your-discord-url
  - TOPICS=NPM_PACKAGE
  - SERVER_PORT=9001
  - ENVIRONMENT=dev

  example of environments for producer:
  - KAFKA_CLIENT_ID=DISCORD
  - KAFKA_BROKERS=localhost:9092
4. Install dependencies
   ```sh
   npm install
   ```
5. run your constainer orchestration
  ```sh
  docker-compose up
  ```
6. Watch for messages coming to your Discord server
