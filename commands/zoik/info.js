const { EmbedBuilder } = require('discord.js');
const os = require('os');

function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
  name: 'info',
  aliases: ['botinfo', 'stats'],
  description: 'Xem thông tin về bot.',
  run: async (client, message, args) => {
    const uptime = formatDuration(client.uptime);
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('🤖 Bot Info')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '📛 Bot Name', value: client.user.username, inline: true },
        { name: '🆔 ID', value: client.user.id, inline: true },
        { name: '📌 Prefix', value: '`k!` hoặc `z!`', inline: true },
        { name: '🖥️ Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Users', value: `${totalUsers.toLocaleString()}`, inline: true },
        { name: '🕒 Uptime', value: uptime, inline: true },
        { name: '📡 Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: '⚙️ Node.js', value: process.version, inline: true },
        { name: '📚 Library', value: 'discord.js v14', inline: true },
        { name: '🛠️ CPU', value: `\`\`\`${os.cpus()[0].model}\`\`\`` },
        {
          name: '💾 RAM',
          value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`,
          inline: true
        },
        { name: '👑 Developer', value: `<@${process.env.OWNER_ID || 'YOUR_ID'}>`, inline: true }
      )
      .setFooter({ text: `Yêu cầu bởi ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    console.log(`[k!info] ${message.author.tag} vừa dùng lệnh info`);
    return msg;
  }
};