const { EmbedBuilder, Events } = require("discord.js");

function handleLogs(client) {
  const logSchema = require("../../Schemas/logSchema");

  function send_log(guildId, embed) {
    logSchema.findOne({ Guild: guildId }, async (err, data) => {
      if (!data || !data.Channel) return;
      const logChannel = client.channels.cache.get(data.Channel);

      if (!logChannel) return;
      embed.setTimestamp();

      try {
        logChannel.send({ embeds: [embed] });
      } catch (err) {
        console.log("Error sending logs!");
      }
    });
  }

  //Delete Messages

  client.on("messageDelete", function (message) {
    try {
      if (message.guild === null) return;
      if (message.author.bot) return;

      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTitle("Message Deleted")
        .setTimestamp()
        .addFields({
          name: `Author`,
          value: `<@${message.author.id}> - *${message.author.tag}*`,
        })
        .addFields({ name: `Deleted Message`, value: `${message.content}` })
        .addFields({ name: `Channel`, value: `${message.channel}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      console.log("Could not log deleted message");
    }
  });

  //Channel Permission Update

  client.on(
    "guildChannelPermissionsUpdate",
    (channel, oldPermissions, newPermissions) => {
      try {
        if (channel.guild === null) return;
        const embed = new EmbedBuilder()
          .setColor(0x8e00ac)
          .setTimestamp()
          .setTitle(`Channel Updated`)
          .addFields({ name: "Channel", value: `${channel}` })
          .addFields({
            name: "Changes",
            value: `Channel's Permissions/Name were updated`,
          });

        return send_log(channel.guild.id, embed);
      } catch (err) {
        console.log("Error logging channel changes");
      }
    }
  );

  //Boosting

  client.on("guildMemberBoost", (member) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`${member.user.username} started boosting the server`)
        .addFields({ name: `Member`, value: `${member.user}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting server boost information");
    }
  });

  //Remove Boost

  client.on("guildMemberUnboost", (member) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`${member.user.username} removed boost from the server`)
        .addFields({ name: `Member`, value: `${member.user}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting server boost information");
    }
  });

  //Member Get Role

  client.on("guildMembnerRoleAdd", (member, role) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`${member.user.username} was given a role`)
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Role`, value: `${role}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting get role information");
    }
  });

  //Member Remove Role

  client.on("guildMembnerRoleRemove", (member, role) => {
    try {
      if (member.guild === null) return;
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`${member.user.username} removed role`)
        .addFields({ name: `Member`, value: `${member.user}` })
        .addFields({ name: `Role`, value: `${role}` });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting get role information");
    }
  });

  //Nickname Update

  client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`Nickname Updated`)
        .addFields({
          name: `Old Nickname`,
          value: `${oldNickname || "**None**"}`,
        })
        .addFields({
          name: `New Nickname`,
          value: `${newNickname || "**None**"}`,
        });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting nickname change information");
    }
  });

  //Channel Topic Update

  client.on("guildChannelTopicUpdate", (channel, oldTopic, newTopic) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`Channel Topic Updated`)
        .addFields({
          name: `Channel`,
          value: `${channel}`,
        })
        .addFields({
          name: `Old Topic`,
          value: `${oldTopic || "**None**"}`,
        })
        .addFields({
          name: `New Topic`,
          value: `${newTopic || "**None**"}`,
        });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting channel topic change information");
    }
  });

  // Member Joined
  client.on("guildMemberAdd", (member) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("User Joined")
        .addFields({
          name: `Member`,
          value: `${member.user} | ${member.user.tag}`,
        })
        .addFields({
          name: `Member ID`,
          value: `${member.user.id}`,
        })
        .addFields({
          name: `Account Created`,
          value: `<t:${parseInt(member.user.createdAt / 1000)}:F>`,
        });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting member join information");
    }
  });

  // Member left
  client.on("guildMemberRemove", (member) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("User Left")
        .addFields({
          name: `Member`,
          value: `${member.user} | ${member.user.tag}`,
        })
        .addFields({
          name: `Member ID`,
          value: `${member.user.id}`,
        })
        .addFields({
          name: `Account Created`,
          value: `<t:${parseInt(member.user.createdAt / 1000)}:F>`,
        })
        .addFields({
          name: `Joined Server`,
          value: `<t:${parseInt(member.user.joinedAt / 1000)}:F>`,
        });

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting member leave information");
    }
  });

  // Banner Added
  client.on("guildBannerAdd", (guild, bannerURL) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Server banner updated")
        .setImage(bannerURL);

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Error getting banner change information");
    }
  });

  // Guild Vanity Add
  client.on("guildVanityURLAdd", (guild, vanityURL) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Vanity Link Set")
        .addFields({ name: `Vanity URL`, value: `${vanityURL}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Error getting vanity information");
    }
  });

  // Guild Vanity Remove
  client.on("guildVanityURLRemove", (guild, vanityURL) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Vanity Link Removed")
        .addFields({ name: `Vanity URL`, value: `${vanityURL}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Error getting vanity information");
    }
  });

  // Guild Vanity Updated
  client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Vanity Link Updated")
        .addFields({ name: `Old Vanity URL`, value: `${oldVanityURL}` })
        .addFields({ name: `New Vanity URL`, value: `${newVanityURL}` });

      return send_log(guild.id, embed);
    } catch (err) {
      console.log("Error getting vanity information");
    }
  });

  // Message Edited
  client.on("messageContentEdited", (message, oldContent, newContent) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Message Edited")
        .addFields({ name: `Old Message`, value: `${oldContent}` })
        .addFields({ name: `New Message`, value: `${newContent}` });

      return send_log(message.guild.id, embed);
    } catch (err) {
      console.log("Error getting message edit information");
    }
  });

  // Role Permission Updated
  client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Role Permission Updated")
        .addFields({ name: `Role`, value: `${role}` })
        .addFields({ name: `Old Permissions`, value: `${oldPermissions}` })
        .addFields({ name: `New Permissions`, value: `${newPermissions}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Error getting role permission information");
    }
  });

  // Avatar Updated
  client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Avatar Updated")
        .addFields({ name: `Member`, value: `${user.tag}` })
        .addFields({ name: `Old Avatar`, value: `${oldAvatarURL}` })
        .addFields({ name: `New Avatar`, value: `${newAvatarURL}` });

      return send_log(user.guild.id, embed);
    } catch (err) {
      console.log("Error getting avatar change information");
    }
  });

  // Username Updated
  client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Username Updated")
        .addFields({ name: `Member`, value: `${user.tag}` })
        .addFields({ name: `Old Username`, value: `${oldUsername}` })
        .addFields({ name: `New Username`, value: `${newUsername}` });

      return send_log(user.guild.id, embed);
    } catch (err) {
      console.log("Error getting username change information");
    }
  });

  // Joined VC
  client.on("voiceChannelJoin", (member, channel) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Voice Channel Joined")
        .setDescription(`${member.user.tag} joined ${channel}!`);

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting vc information");
    }
  });

  // Left VC
  client.on("voiceChannelLeave", (member, channel) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Voice Channel Left")
        .setDescription(`${member.user.tag} left ${channel}!`);

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting vc information");
    }
  });

  // User Started to Stream
  client.on("voiceStreamingStart", (member, voiceChannel) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("User Started to Stream")
        .setDescription(
          `${member.user.tag} started streaming in ${voiceChannel.name}`
        );

      return send_log(member.guild.id, embed);
    } catch (err) {
      console.log("Error getting vc stream information");
    }
  });

  // Role Created
  client.on("roleCreate", (role) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle(`Role Added ${role}`)
        .addFields({ name: `Role`, value: `${role.name}` })
        .addFields({ name: `Role ID`, value: `${role.id}` })
        .addFields({ name: `HEX Color`, value: `${role.hexColor}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Error getting role create information");
    }
  });

  // Role Deleted
  client.on("roleDelete", (role) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Role Deleted")
        .setDescription(`${role.name} was deleted`);

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Error getting role delete information");
    }
  });

  // User Banned
  client.on("guildBanAdd", (guild, user) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("User Banned")
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: `Member`, value: `${user}` })
        .addFields({ name: `Member ID`, value: `${user.id}` })
        .addFields({ name: `Member Tag`, value: `${user.tag}` });

      return send_log(role.guild.id, embed);
    } catch (err) {
      console.log("Error getting member ban information");
    }
  });

  // Channel Created
  client.on("channelCreate", (channel) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Channel Created")
        .setDescription(`${channel.name} has been created.`);

      return send_log(channel.guild.id, embed);
    } catch (err) {
      console.log("Error getting channel create information");
    }
  });

  // Channel Deleted
  client.on("channelDelete", (channel) => {
    try {
      const embed = new EmbedBuilder()
        .setColor(0x8e00ac)
        .setTimestamp()
        .setTitle("Channel Deleted")
        .setDescription(`${channel.name} has been deleted.`);

      return send_log(channel.guild.id, embed);
    } catch (err) {
      console.log("Error getting channel delete information");
    }
  });
}

module.exports = { handleLogs };
