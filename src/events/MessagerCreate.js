require("dotenv").config();

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const prefix = "z!";
    const zoikPrefix = "k!";
    const ownerId = process.env.OWNER_ID;

    // =======================
    // xử lý lệnh z!
    // =======================
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();

      const command = client.prefixCommands.get(cmdName);
      if (!command) return;

      try {
        await command.execute(client, message, args); // ✅ đúng thứ tự
      } catch (err) {
        console.error(err);
        message.reply("❌ Lỗi khi thực hiện lệnh.");
      }
    }

    // =======================
    // xử lý lệnh k! (owner-only)
    // =======================
    else if (message.content.startsWith(zoikPrefix)) {
      if (message.author.id !== ownerId) {
        return message.reply("🚫 Lệnh này chỉ dành cho owner.");
      }

      const args = message.content.slice(zoikPrefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();

      const command = client.zoikCommands.get(cmdName);
      if (!command) return;

      try {
        const botReply = await command.execute(client, message, args);

        setTimeout(() => {
          message.delete().catch(() => {});
        }, 10_000);

        if (botReply && botReply.deletable) {
          setTimeout(() => {
            botReply.delete().catch(() => {});
          }, 10_000);
        }
      } catch (err) {
        console.error(err);
        message.reply("❌ Lỗi khi thực hiện lệnh owner.");
      }
    }
  },
};