const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: 'server',
  description: 'Quản lý template server (copy/paste/list/delete)',
  run: async (client, message, args) => {
    const sub = args[0]?.toLowerCase();
    const templateId = args[1];
    const guild = message.guild;

    if (!['copy', 'paste', 'list', 'delete'].includes(sub)) {
      return message.reply(
        '📚 Dùng các lệnh:\n' +
        '`k!server copy <id>` – sao chép template\n' +
        '`k!server paste <id>` – dán template\n' +
        '`k!server list` – xem danh sách\n' +
        '`k!server delete <id>` – xoá template'
      );
    }

    if (message.author.id !== process.env.OWNER_ID)
      return message.reply('❌ Lệnh `k!server` chỉ dành cho chủ bot.');

    // --- COPY ---
    if (sub === 'copy') {
      if (!templateId) return message.reply('❗ Vui lòng nhập ID cho template.');

      const roles = guild.roles.cache
        .filter(r => r.id !== guild.id && !r.managed)
        .sort((a, b) => b.position - a.position)
        .map(r => ({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          permissions: r.permissions.bitfield.toString(),
          mentionable: r.mentionable,
        }));

      const channels = guild.channels.cache
        .sort((a, b) => a.position - b.position)
        .map(c => ({
          name: c.name,
          type: c.type,
          parent: c.parent?.name || null,
          topic: c.topic || null,
          nsfw: c.nsfw || false,
          bitrate: c.bitrate || null,
          userLimit: c.userLimit || null,
        }));

      await db.set(`template_roles_${templateId}`, roles);
      await db.set(`template_channels_${templateId}`, channels);

      return message.reply(`✅ Đã lưu template với ID **${templateId}**.`);
    }

    // --- PASTE ---
    if (sub === 'paste') {
      if (!templateId) return message.reply('❗ Vui lòng nhập ID cần dán.');

      const roles = await db.get(`template_roles_${templateId}`);
      const channels = await db.get(`template_channels_${templateId}`);

      if (!roles || !channels)
        return message.reply('⚠️ Không tìm thấy template với ID đó.');

      for (const r of roles) {
        await guild.roles.create({
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          permissions: BigInt(r.permissions),
          mentionable: r.mentionable
        }).catch(() => {});
      }

      const categoryMap = {};
      for (const c of channels.filter(c => c.type === 4)) {
        const cat = await guild.channels.create({
          name: c.name,
          type: 4
        }).catch(() => null);
        if (cat) categoryMap[c.name] = cat.id;
      }

      for (const c of channels.filter(c => c.type !== 4)) {
        await guild.channels.create({
          name: c.name,
          type: c.type,
          parent: categoryMap[c.parent] || null,
          topic: c.topic,
          nsfw: c.nsfw,
          bitrate: c.bitrate,
          userLimit: c.userLimit
        }).catch(() => {});
      }

      return message.reply(`📥 Template **${templateId}** đã được dán.`);
    }

    // --- LIST ---
    if (sub === 'list') {
      const data = await db.all();
      const ids = data
        .map(d => d.id.match(/^template_roles_(.+)$/))
        .filter(m => m)
        .map(m => m[1]);

      if (ids.length === 0)
        return message.reply('📭 Chưa có template nào được lưu.');

      return message.reply(`📂 Template có sẵn:\n\`\`\`\n${ids.join('\n')}\n\`\`\``);
    }

    // --- DELETE ---
    if (sub === 'delete') {
      if (!templateId) return message.reply('❗ Vui lòng nhập ID cần xóa.');

      await db.delete(`template_roles_${templateId}`);
      await db.delete(`template_channels_${templateId}`);

      return message.reply(`🗑️ Đã xoá template **${templateId}** (nếu có).`);
    }
  }
};