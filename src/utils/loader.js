const fs = require("fs");
const path = require("path");

function loadAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadAllFiles(filePath, fileList);
    } else if (file.endsWith(".js")) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function loadCommands(client) {
  // prefix
  const prefixFiles = loadAllFiles(path.join(__dirname, "../commands/prefix"));
  for (const file of prefixFiles) {
    const command = require(file);
    if (command.name) client.prefixCommands.set(command.name, command);
  }

  // zoik
  const zoikFiles = loadAllFiles(path.join(__dirname, "../commands/zoik"));
  for (const file of zoikFiles) {
    const command = require(file);
    if (command.name) client.zoikCommands.set(command.name, command);
  }

  // slash
  const slashFiles = loadAllFiles(path.join(__dirname, "../commands/slash"));
  for (const file of slashFiles) {
    const command = require(file);
    if (command.data?.name) client.slashCommands.set(command.data.name, command);
  }

  console.log("✅ Commands loader thành công.");
}

function loadEvents(client) {
  const eventPath = path.join(__dirname, "../events");
  const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`${eventPath}/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log("✅ Events loader thành công.");
}

module.exports = { loadCommands, loadEvents };