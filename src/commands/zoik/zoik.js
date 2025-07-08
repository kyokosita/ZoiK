module.exports = {
  name: "zoik",
  description: "Hiển thị toàn bộ lệnh owner (k!)",
  async execute(message, args, client) {
    const ownerId = process.env.OWNER_ID;

    if (message.author.id !== ownerId) {
      return message.reply("🚫 Lệnh này chỉ dành cho owner.");
    }

    const zoikCommands = client.zoikCommands.map(cmd => `\`k!${cmd.name}\``).join(", ");
    
    return message.reply(
      `👑 **Danh sách lệnh owner (k!)**:\n${zoikCommands.length > 0 ? zoikCommands : "Không có lệnh nào."}`
    );
  },
};