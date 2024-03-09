const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const logSchema = require("../../Schemas/logSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-logs")
    .setDescription("Configure your logging system")
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Sets up your logging system")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will receive logs")
            .setRequired(false)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement
            )
        )
    )
    .addSubcommand((command) =>
      command.setName("disable").setDescription("Disables your logging system")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const sub = await interaction.options.getSubcommand();
    const data = await logSchema.findOne({ Guild: interaction.guild.id });

    switch (sub) {
      case "setup":
        if (data)
          return await interaction.reply({
            content: "You already have a log system setup",
            ephemeral: true,
          });
        else {
          const logchannel =
            interaction.options.getChannel("channel") || interaction.channel;

          const setupembed = new EmbedBuilder()
            .setColor(0x8e00ac)
            .setAuthor({ name: `Logging System` })
            .setTitle(`LOGGING ENABLED`)
            .addFields({
              name: `Setup`,
              value: `Your logging system has been set up successfully`,
            })
            .addFields({ name: `Log Channel`, value: `${logchannel}` })
            .setTimestamp();

          await interaction.reply({ embeds: [setupembed] });

          await logSchema.create({
            Guild: interaction.guild.id,
            Channel: logchannel.id,
          });
        }

        break;
      case "disable":
        if (!data)
          return interaction.reply({
            content: `You do not have a logging system setup`,
            ephemeral: true,
          });
        else {
          const disableembed = new EmbedBuilder()
            .setColor(0x8e00ac)
            .setTitle("LOGGING DISABLED")
            .setDescription("Logging was successfully disabled in this guild")
            .setTimestamp();

          await interaction.reply({ embeds: [disableembed] });

          await logSchema.deleteMany({ Guild: interaction.guild.id });
        }
    }
  },
};
