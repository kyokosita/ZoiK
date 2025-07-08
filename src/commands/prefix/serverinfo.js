const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Xem thông tin server hiện tại.",
  
  async execute(message) {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setTitle(`🌐 Server Info - ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "🆔 Server ID", value: guild.id, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        { name: "💬 Channels", value: `${guild.channels.cache.size}`, inline: true },
        { name: "📅 Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false }
      )
      .setColor("Blue")
      .setFooter({ text: "ZoiK System Bot" });

    await message.reply({ embeds: [embed] });
  },
};