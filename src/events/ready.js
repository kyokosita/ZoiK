const { REST, Routes, ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`✅ Bot đã khởi động với user: ${client.user.tag}`);

    // đếm số lượng lệnh
    const prefixCount = client.prefixCommands.size;
    const zoikCount = client.zoikCommands.size;
    const slashCount = client.slashCommands.size;

    console.log(`🔎 Prefix commands: ${prefixCount}`);
    console.log(`🔎 Zoik commands: ${zoikCount}`);
    console.log(`🔎 Slash commands: ${slashCount}`);

    // đăng ký slash command
    const commands = [];
    client.slashCommands.forEach(cmd => {
      commands.push(cmd.data.toJSON());
    });

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
      console.log("🔄 Đang đăng ký slash commands lên Discord...");
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log("✅ Slash commands đã được đăng ký thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi đăng ký slash commands:", error);
    }
    const statuses = [
  `z!help | ${client.guilds.cache.size} servers`,
  `/ping | slash commands ready`
];

let index = 0;
setInterval(() => {
  client.user.setActivity(statuses[index % statuses.length], { type: ActivityType.Watching });
  index++;
}, 20_000); // đổi mỗi 60 giây
  },
};