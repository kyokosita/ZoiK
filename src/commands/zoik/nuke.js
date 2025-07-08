const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Clone nhiều channel (chỉ owner)",

  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply("🚫 Bạn cần quyền **ManageChannels**.");
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 500) {
      return message.reply("❌ Vui lòng nhập số lượng kênh từ 1 đến 500.");
    }

    const name = args.slice(1).join(" ") || "Zoik";
    const currentChannel = message.channel;

    try {
      for (let i = 0; i < amount; i++) {
        await currentChannel.clone({ name });
      }

      const embed = new EmbedBuilder()
        .setTitle("💣 Đã nuke thành công")
        .setDescription(`Đã clone **${amount}** kênh với tên **${name}**`)
        .setColor("#FF0000")
        .setTimestamp();

      const reply = await message.reply({ embeds: [embed] });

      setTimeout(() => {
        reply.delete().catch(() => {});
        message.delete().catch(() => {});
      }, 30_000);

    } catch (err) {
      console.error(err);
      message.reply("❌ Không thể nuke kênh.");
    }
  },
};