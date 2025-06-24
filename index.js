require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');

// --- Khởi tạo client ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// --- Tạo collection lệnh ---
client.commands = new Collection();        // Slash commands
client.prefixCommands = new Collection();  // z! commands
client.zoikCommands = new Collection();    // k! commands

// --- Đếm số lệnh ---
let totalCommandFiles = 0;
let loadedSlash = 0;
let loadedPrefix = 0;
let loadedZoik = 0;
let loadedEvents = 0;

// --- Hàm load command ---
const loadCommands = (dir, collection, type) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadCommands(fullPath, collection, type);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);
      totalCommandFiles++;

      if (type === 'slash' && command.data && command.execute) {
        collection.set(command.data.name, command);
        loadedSlash++;
      }

      if (type === 'prefix' && command.name && command.run) {
        collection.set(command.name, command);
        loadedPrefix++;
      }

      if (type === 'zoik' && command.name && command.run) {
        collection.set(command.name, command);
        loadedZoik++;
      }
    }
  }
};

// --- Load command theo loại ---
loadCommands(path.join(__dirname, 'commands/prefix'), client.prefixCommands, 'prefix');
loadCommands(path.join(__dirname, 'commands/zoik'), client.zoikCommands, 'zoik');
loadCommands(path.join(__dirname, 'commands/slash'), client.commands, 'slash');

// --- Load events ---
const loadEvents = (dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadEvents(fullPath);
    } else if (file.endsWith('.js')) {
      const event = require(fullPath);
      if (!event.name || typeof event.execute !== 'function') continue;

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      loadedEvents++;
    }
  }
};

loadEvents(path.join(__dirname, 'events'));

// --- Slash command registration ---
client.once(Events.ClientReady, async () => {
  console.log(`🤖 Bot đã đăng nhập với tên: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const slashData = client.commands.map(cmd => cmd.data.toJSON());

  try {
    console.log('📤 Đang đăng ký slash commands...');
    await rest.put(Routes.applicationCommands(client.user.id), { body: slashData });
    console.log('✅ Slash commands đã được đăng ký!');
  } catch (err) {
    console.error('❌ Lỗi khi đăng ký slash commands:', err);
  }
});

// --- Log ---
console.log(`✅ Loaded ${totalCommandFiles} command files.`);
console.log(`🔵 Prefix commands (z!): ${loadedPrefix}`);
console.log(`🟣 Zoik commands (k!): ${loadedZoik}`);
console.log(`🟢 Slash commands: ${loadedSlash}`);
console.log(`📡 Events loaded: ${loadedEvents}`);

// --- Khởi động bot ---
client.login(process.env.TOKEN);