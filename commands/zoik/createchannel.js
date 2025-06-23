module.exports = {
  name: 'createchannel',
  description: 'Tạo kênh hoặc kênh thoại.',
  run: async (client, message, args) => {
    const ownerId = process.env.OWNER_ID;
    if (message.author.id !== ownerId) {
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');
    }

    // Nếu người dùng gõ: k!createchannel list
    if (args[0]?.toLowerCase() === 'list') {
      const categories = message.guild.channels.cache
        .filter(c => c.type === 4)
        .map(c => `📁 ${c.name}`)
        .join('\n') || 'Không có danh mục nào.';

      return message.reply({
        embeds: [{
          title: '📂 Danh sách danh mục hiện có',
          description: categories,
          color: 0x00ccff,
          footer: { text: `Tổng cộng: ${message.guild.channels.cache.filter(c => c.type === 4).size}` }
        }]
      });
    }

    if (!args[0] || !args[1]) {
      return message.reply('❌ Cú pháp: `k!createchannel <loại-kênh> <tên-kênh> [danh-mục]`\nHoặc: `k!createchannel list` để xem danh mục.');
    }

    const typeInput = args[0].toLowerCase();
    const channelName = args[1];
    const categoryName = args.slice(2).join(' '); // phần còn lại là tên danh mục

    const channelTypes = {
      channel: 0,
      text: 0,
      voice: 2,
      news: 5,
      stage: 13,
      forum: 15,
    };

    const type = channelTypes[typeInput];
    if (typeof type === 'undefined') {
      return message.reply('❌ Loại phải là: `channel`, `voice`, `news`, `stage`, hoặc `forum`.');
    }

    let parentCategory = null;

    if (categoryName) {
      parentCategory = message.guild.channels.cache.find(
        c => c.type === 4 && c.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (!parentCategory) {
        return message.reply(`❌ Không tìm thấy danh mục tên **${categoryName}**.`);
      }
    }

    try {
      const newChannel = await message.guild.channels.create({
        name: channelName,
        type: type,
        parent: parentCategory?.id || null,
        reason: `Tạo bởi ${message.author.tag} qua k!createchannel`
      });

      const emoji = {
        0: '💬',  // text
        2: '🔊',  // voice
        5: '📰',  // news
        13: '🎤', // stage
        15: '🗂️'  // forum
      }[type] || '📁';

      return message.reply(`✅ Đã tạo ${emoji} **${newChannel.name}**${parentCategory ? ` trong danh mục **${parentCategory.name}**` : ''}!`);
    } catch (err) {
      console.error(err);
      return message.reply('❌ Có lỗi xảy ra khi tạo kênh.');
    }
  }
};
