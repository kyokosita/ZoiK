const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "server",
  description: "Quản lý server (tạo / xóa kênh & role)",
  async execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const action = args[0]; // create | delete
    const type = args[1];   // text | voice | category | role
    const target = args.slice(2).join(" ") || "Zoik";

    if (!action || !type) return message.reply("⚠️ Thiếu đối số. Cú pháp: `k!server <create|delete> <text|voice|category|role> [tên|all]");

    // CREATE
    if (action === "create") {
      if (type === "text") {
        return message.guild.channels.create({
          name: target,
          type: 0 // GUILD_TEXT
        }).then(() => message.react("✅"));
      }
      if (type === "voice") {
        return message.guild.channels.create({
          name: target,
          type: 2 // GUILD_VOICE
        }).then(() => message.react("✅"));
      }
      if (type === "category") {
        return message.guild.channels.create({
          name: target,
          type: 4 // GUILD_CATEGORY
        }).then(() => message.react("✅"));
      }
      if (type === "role") {
        return message.guild.roles.create({
          name: target,
          color: "Random"
        }).then(() => message.react("✅"));
      }
    }

    // DELETE
    if (action === "delete") {
      if (type === "text") {
        if (target === "all") {
          return message.guild.channels.cache.filter(c => c.type === 0).forEach(c => c.delete().catch(() => {}));
        }
        const chan = message.guild.channels.cache.find(c => c.name === target && c.type === 0);
        if (chan) chan.delete();
      }
      if (type === "voice") {
        if (target === "all") {
          return message.guild.channels.cache.filter(c => c.type === 2).forEach(c => c.delete().catch(() => {}));
        }
        const chan = message.guild.channels.cache.find(c => c.name === target && c.type === 2);
        if (chan) chan.delete();
      }
      if (type === "category") {
        if (target === "all") {
          return message.guild.channels.cache.filter(c => c.type === 4).forEach(c => c.delete().catch(() => {}));
        }
        const chan = message.guild.channels.cache.find(c => c.name === target && c.type === 4);
        if (chan) chan.delete();
      }
      if (type === "role") {
        if (target === "all") {
          return message.guild.roles.cache.filter(r => r.editable).forEach(r => r.delete().catch(() => {}));
        }
        const role = message.guild.roles.cache.find(r => r.name === target && r.editable);
        if (role) role.delete();
      }
    }

    return message.react("✅");
  },
};
