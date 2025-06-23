module.exports = {
  name: 'help',
  description: 'Hiển thị danh sách lệnh dành riêng cho chủ bot.',
  run: async (client, message) => {
    const ownerId = process.env.OWNER_ID;
    if (message.author.id !== ownerId) {
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');
    }

    const commands = client.zoikCommands;

    const description = [...commands.values()]
      .map(cmd => `🔹 \`${cmd.name}\` — ${cmd.description || 'Không có mô tả.'}`)
      .join('\n');

    const embed = {
      title: '📖 Zoik Help — Lệnh dành cho chủ bot',
      color: 0x00ffff,
      description: description || 'Chưa có lệnh nào.',
      footer: { text: 'Prefix: k!' },
      timestamp: new Date()
    };

    const reply = await message.reply({ embeds: [embed] });

    // Xoá sau 20 giây nếu là k!
    setTimeout(() => {
      if (reply.deletable) reply.delete().catch(() => {});
    }, 20000);
  }
};
