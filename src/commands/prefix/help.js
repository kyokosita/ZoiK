module.exports = {
  name: "help",
  description: "Hiển thị danh sách lệnh",
  async execute(message, args, client) {
    const commands = client.prefixCommands;
    if (!commands || commands.size === 0) {
      return message.reply("Không có lệnh nào được tải.");
    }

    const list = commands.map(cmd => `\`${cmd.name}\` - ${cmd.description || "Không mô tả"}`).join("\n");

    await message.reply({
      content: `📋 **Danh sách lệnh:**\n${list}`,
    });
  },
};