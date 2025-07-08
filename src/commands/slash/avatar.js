const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Lấy ảnh đại diện của một user")
    .addUserOption(option =>
      option.setName("target")
        .setDescription("Người cần xem avatar")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`🖼 Avatar của ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 512, dynamic: true }))
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  },
};