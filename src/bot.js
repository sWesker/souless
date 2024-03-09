require("dotenv").config();
const { token } = process.env;
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  IntentsBitField,
  PermissionsBitField,
} = require("discord.js");
const fs = require("fs");
const internal = require("stream");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildIntegrations,
    IntentsBitField.Flags.GuildWebhooks,
    IntentsBitField.Flags.GuildScheduledEvents,
    IntentsBitField.Flags.AutoModerationConfiguration,
  ],
});
client.slashCommands = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.process = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

//Moderation Logs

const Logs = require("discord-logs");

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason", reason);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

Logs(client, {
  debug: true,
});

const { handleLogs } = require("./events/client/handleLogs");

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);
