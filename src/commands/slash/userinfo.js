const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Xem thông tin người dùng")
    .addUserOption(option =>
      option.setName("target").setDescription("Người cần xem").setRequired(false)
    ),

  async execute(interaction, client) {
    const target = interaction.options.getUser("target") || interaction.user;
    const member = interaction.guild.members.cache.get(target.id);

    await interaction.reply({
      embeds: [
        {
          title: `Thông tin người dùng`,
          color: 0x3399ff,
          thumbnail: { url: target.displayAvatarURL() },
          fields: [
            { name: "Username", value: target.tag, inline: true },
            { name: "ID", value: target.id, inline: true },
            { name: "Joined", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: "Created", value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
          ],
        },
      ],
    });
  },
};
