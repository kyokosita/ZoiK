module.exports = {
  name: 'deleteroles',
  description: 'Xóa vai trò.',
  run: async (client, message, args) => {
    const ownerId = process.env.OWNER_ID;
    if (message.author.id !== ownerId) {
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');
    }

    // XÓA TẤT CẢ ROLE
    if (args[0]?.toLowerCase() === 'all') {
      let deleted = 0;
      const roles = message.guild.roles.cache
        .filter(role => 
          role.id !== message.guild.id && // Tránh @everyone
          !role.managed && // Không xóa role tích hợp (bot/app)
          message.guild.members.me.roles.highest.position > role.position // Bot phải có quyền
        );

      for (const role of roles.values()) {
        try {
          await role.delete(`k!deleteroles all`);
          deleted++;
        } catch (err) {
          console.warn(`❌ Không thể xóa role ${role.name}`);
        }
      }

      return message.reply(`✅ Đã xóa ${deleted} vai trò.`);
    }

    // XÓA CÁC ROLE ĐƯỢC TAG
    if (message.mentions.roles.size > 0) {
      let deleted = 0;
      for (const role of message.mentions.roles.values()) {
        if (
          role.id === message.guild.id || // @everyone
          role.managed || // role của bot tích hợp
          role.position >= message.guild.members.me.roles.highest.position // bot không có quyền
        ) continue;

        try {
          await role.delete(`k!deleteroles tag`);
          deleted++;
        } catch (err) {
          console.warn(`❌ Không thể xóa role ${role.name}`);
        }
      }

      return message.reply(`✅ Đã xóa ${deleted} vai trò được tag.`);
    }

    return message.reply('❌ Cú pháp:\n- `k!deleteroles all`\n- `k!deleteroles @role1 @role2 ...`');
  }
};
