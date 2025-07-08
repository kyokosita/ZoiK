module.exports = {
  name: "userinfo",
  description: "Xem thông tin người dùng",
  async execute(message, args, client) {
    const target =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0])?.user ||
      message.author;

    const member = message.guild.members.cache.get(target.id);

    return message.reply({
      embeds: [
        {
          title: `Thông tin người dùng`,
          color: 0x00ff99,
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