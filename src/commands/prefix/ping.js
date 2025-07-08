module.exports = {
  name: "ping",
  description: "Kiểm tra độ trễ bot",
  async execute(message, args, client) {
    const msg = await message.reply("🏓 Đang kiểm tra ping...");
    const latency = msg.createdTimestamp - message.createdTimestamp;
    msg.edit(`🏓 Pong! Độ trễ bot: ${latency}ms`);
  },
};