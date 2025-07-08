module.exports = {
  name: "userinfo",
  description: "Xem thông tin người dùng (owner)",
  async execute(message, args, client) {
    const target =
      message.mentions.users.first() ||
      message.guild.members.cache.get(args[0])?.user ||
      message.author;

    const member = message.guild.members.cache.get(target.id);

    const roles = member.roles.cache
      .filter(r => r.id !== message.guild.id)
      .map(r => r.toString())
      .join(", ") || "Không có";

    const embed = {
      title: `👑 User Info (Zoik)`,
      color: 0xff8800,
      thumbnail: { url: target.displayAvatarURL() },
      fields: [
        { name: "Username", value: target.tag, inline: true },
        { name: "ID", value: target.id, inline: true },
        { name: "Joined", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: "Created", value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Roles", value: roles, inline: false },
      ],
    };

    return await message.reply({ embeds: [embed] });
  },
};
