const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'moderation',
  run: async (client, message, args) => {
    if (message.author.id !== process.env.OWNER_ID)
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');

    const sub = args[0]?.toLowerCase();
    const member = message.mentions.members.first();
    const reason = args.slice(2).join(' ') || 'Không có lý do.';

    if (!sub || !['ban', 'kick', 'mute'].includes(sub))
      return message.reply('❓ Cú pháp: `k!moderation <ban|kick|mute> @user <lý do>`');

    if (!member) return message.reply('⚠️ Vui lòng tag người cần xử lý.');

    // Check role
    const botMember = message.guild.members.me;
    if (member.id === message.guild.ownerId)
      return message.reply('🚫 Không thể xử lý chủ server.');
    if (member.roles.highest.position >= botMember.roles.highest.position)
      return message.reply('⚠️ Không thể xử lý người có vai trò cao bằng hoặc cao hơn bot.');

    try {
      if (sub === 'ban') {
        await member.ban({ reason });
      } else if (sub === 'kick') {
        await member.kick(reason);
      } else if (sub === 'mute') {
        if (!member.manageable || !member.moderatable)
          return message.reply('❌ Bot không thể mute người này.');

        await member.timeout(60 * 60 * 1000, reason); // 1h timeout
      }

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('🔨 Đã xử lý thành công')
        .addFields(
          { name: '👤 Người bị xử lý', value: `${member.user.tag} (${member.id})` },
          { name: '🔧 Hành động', value: sub.toUpperCase(), inline: true },
          { name: '📄 Lý do', value: reason, inline: true },
        )
        .setFooter({ text: `Xử lý bởi ${message.author.tag}` });

      const reply = await message.reply({ embeds: [embed] });
      setTimeout(() => {
        message.delete().catch(() => {});
        reply.delete().catch(() => {});
      }, 5000);
    } catch (err) {
      console.error(err);
      message.reply('❌ Có lỗi xảy ra. Kiểm tra lại quyền hoặc vai trò.').then(m => {
        setTimeout(() => m.delete().catch(() => {}), 5000);
      });
    }
  }
};