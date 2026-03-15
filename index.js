// DS WORLD BOT – Full Index.js Safe Version
const { 
  Client, 
  GatewayIntentBits, 
  ChannelType,
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder, 
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType
} = require("discord.js");

// Bot Token
const TOKEN = process.env.TOKEN;

// Channel to monitor
const CREATE_CHANNEL_ID = "1480913492574867519";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once("ready", () => console.log("DS WORLD BOT ONLINE 🚀"));

client.on("voiceStateUpdate", async (oldState, newState) => {
  try {

    if (newState.channelId === CREATE_CHANNEL_ID) {

      const displayName = newState.member.displayName;

      const voiceChannel = await newState.guild.channels.create({
        name: `${displayName} VC`,
        type: ChannelType.GuildVoice,
        parent: newState.channel?.parent
      });

      await newState.member.voice.setChannel(voiceChannel);

      const embed = new EmbedBuilder()
        .setTitle("♡ 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷 𝐿𝒪𝒱𝐸𝒮 𝒴𝒪𝒰 ♡")
        .setDescription(`𝒲𝐸𝐿𝐶𝒪𝑀𝐸, ${displayName}!\n𝐸𝓃𝒿𝑜𝓎 𝓎𝑜𝓊𝓇 𝓈𝓉𝒶𝓎.\n[𝒟𝑒𝓋𝑒𝓁𝑜𝓅𝑒𝒹 𝒷𝓎 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷](https://discord.gg/PayB3YesXC)`)
        .setColor(0x5865f2)
        .setImage("https://cdn.discordapp.com/attachments/1410364493824917534/1481291852492570664/Copilot_20260311_132153.png");

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("lock").setLabel("Lock").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("unlock").setLabel("Unlock").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("hide").setLabel("Hide").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("show").setLabel("Show").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("rename").setLabel("Rename").setStyle(ButtonStyle.Secondary)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("kick").setLabel("Kick User").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("limit").setLabel("Set User Limit").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("coowners").setLabel("Co-Owners").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("delete").setLabel("Delete Channel").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Secondary)
      );

      await voiceChannel.send({ embeds: [embed], components: [row1, row2] });
    }

    if (oldState.channel && oldState.channel.id !== CREATE_CHANNEL_ID) {
      if (oldState.channel.members.size === 0 && oldState.channel.name.endsWith("VC") && oldState.channel.deletable) {
        await oldState.channel.delete();
      }
    }

  } catch(err) {
    console.error(err);
  }
});

client.on("interactionCreate", async interaction => {

  try {

    const everyone = interaction.guild.roles.everyone;

    if (interaction.isButton()) {

      switch(interaction.customId){

        case "lock":
          await interaction.channel.permissionOverwrites.edit(everyone,{Connect:false});
          return interaction.reply({content:"Channel Locked 🔒",ephemeral:true});

        case "unlock":
          await interaction.channel.permissionOverwrites.edit(everyone,{Connect:true});
          return interaction.reply({content:"Channel Unlocked 🔓",ephemeral:true});

        case "hide":
          await interaction.channel.permissionOverwrites.edit(everyone,{ViewChannel:false});
          return interaction.reply({content:"Channel Hidden 🙈",ephemeral:true});

        case "show":
          await interaction.channel.permissionOverwrites.edit(everyone,{ViewChannel:true});
          return interaction.reply({content:"Channel Visible 👁",ephemeral:true});

        case "rename":
          const renameModal = new ModalBuilder()
            .setCustomId("renameModal")
            .setTitle("Rename Channel")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("newName")
                  .setLabel("New Name")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
            );
          return interaction.showModal(renameModal);

        case "limit":
          const limitModal = new ModalBuilder()
            .setCustomId("limitModal")
            .setTitle("User Limit")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("userLimit")
                  .setLabel("Enter limit (0-99)")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
            );
          return interaction.showModal(limitModal);

        case "delete":
          await interaction.reply({content:"Channel Deleted 🗑",ephemeral:true});
          return interaction.channel.delete();

        case "kick":
          const options = interaction.channel.members
            .filter(m=>!m.user.bot && m.id!==interaction.user.id)
            .map(m=>({label:m.displayName,value:m.id}));

          if(options.length===0)
            return interaction.reply({content:"No users to kick",ephemeral:true});

          const kickMenu = new StringSelectMenuBuilder()
            .setCustomId("kickSelect")
            .setPlaceholder("Select user")
            .addOptions(options);

          const kickRow = new ActionRowBuilder().addComponents(kickMenu);
          return interaction.reply({content:"Select user to kick:",components:[kickRow],ephemeral:true});

        case "coowners":
          const members = interaction.channel.members
            .filter(m=>!m.user.bot)
            .map(m=>({label:m.displayName,value:m.id}));

          if(members.length===0)
            return interaction.reply({content:"No users in VC",ephemeral:true});

          const coMenu = new StringSelectMenuBuilder()
            .setCustomId("coownerSelect")
            .setPlaceholder("Select Co Owner")
            .addOptions(members);

          const coRow = new ActionRowBuilder().addComponents(coMenu);
          return interaction.reply({content:"Select Co Owner:",components:[coRow],ephemeral:true});

        case "info":
          const vc = interaction.channel;
          const owner = vc.members.first()?.displayName || "Unknown";
          const name = vc.name;
          const limit = vc.userLimit === 0 ? "Unlimited" : vc.userLimit.toString();
          const createdAt = vc.createdAt.toLocaleString();
          const activeFor = "N/A";
          const coOwners = "0/5";
          const hidden = vc.permissionsFor(interaction.guild.roles.everyone).has("ViewChannel") ? "No" : "Yes";
          const locked = vc.permissionsFor(interaction.guild.roles.everyone).has("Connect") ? "No" : "Yes";

          const infoEmbed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setThumbnail("https://cdn.discordapp.com/emojis/1482388410717962386.png?size=96&quality=lossless")
            .setDescription("♡ 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷 𝒫𝒜𝒩𝐸𝐿 ♡")
            .addFields(
              { name: "𝒪𝓌𝓃𝑒𝓇 <:owner:1482387316088770681> :", value: owner, inline: false },
              { name: "𝒩𝒶𝓂𝑒 <:name:1482406793639362748> :", value: name, inline: false },
              { name: "Limit", value: limit, inline: false },
              { name: "Created At", value: createdAt, inline: false },
              { name: "Active For", value: activeFor, inline: false },
              { name: "Co-Owners", value: coOwners, inline: false },
              { name: "Hidden", value: hidden, inline: false },
              { name: "Locked", value: locked, inline: false }
            )
            .setFooter({ text: "✨ Powered by DS WORLD ✨" });

          return interaction.reply({ embeds: [infoEmbed], ephemeral: true });
      }

    }

    if(interaction.type===InteractionType.ModalSubmit){

      if(interaction.customId==="renameModal"){

        const newName = interaction.fields.getTextInputValue("newName");
        await interaction.channel.setName(newName);
        return interaction.reply({content:`Channel renamed to ${newName}`,ephemeral:true});

      }

      if(interaction.customId==="limitModal"){

        let limit = parseInt(interaction.fields.getTextInputValue("userLimit"));
        if(isNaN(limit)||limit<0)
          return interaction.reply({content:"Invalid number",ephemeral:true});
        if(limit>99) limit=99;
        await interaction.channel.setUserLimit(limit);
        return interaction.reply({content:`User limit set to ${limit}`,ephemeral:true});

      }

    }

    if(interaction.isStringSelectMenu()){

      if(interaction.customId==="kickSelect"){

        const member = interaction.guild.members.cache.get(interaction.values[0]);
        await member.voice.disconnect();
        return interaction.update({content:`${member.displayName} kicked`,components:[]});

      }

      if(interaction.customId==="coownerSelect"){

        const memberId = interaction.values[0];
        await interaction.channel.permissionOverwrites.edit(memberId,{
          ManageChannels:true,
          MoveMembers:true
        });
        const member = interaction.guild.members.cache.get(memberId);
        return interaction.update({content:`${member.displayName} is now Co Owner`,components:[]});

      }

    }

  } catch(err){
    console.error(err);
  }

});

client.login(TOKEN);