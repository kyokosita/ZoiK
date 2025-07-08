require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.prefixCommands = new Collection();
client.zoikCommands = new Collection();
client.slashCommands = new Collection();
client.player = new Player(client);

const { loadCommands, loadEvents } = require("./src/utils/loader");
loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);