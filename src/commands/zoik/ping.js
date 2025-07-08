const os = require("os");

module.exports = {
  name: "ping",
  description: "Kiểm tra độ trễ bot (owner)",
  async execute(message, args, client) {
    const uptime = process.uptime();
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const msg = await message.reply("🔍 Đang kiểm tra ping...");
    const latency = msg.createdTimestamp - message.createdTimestamp;

    return await msg.edit(
      `🔧 **Bot Info**
🏓 Ping: ${latency}ms
⏱ Uptime: ${Math.floor(uptime)}s
💾 Memory: ${memory.toFixed(2)} MB
💻 Platform: ${os.platform()}`
    );
  },
};