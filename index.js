// DS WORLD BOT – Full Index.js Safe Version with Bot-Only VC Deletion
const { 
  Client, 
  GatewayIntentBits, 
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

// ✅ Use environment variable for token
const TOKEN = process.env.TOKEN;

// 🔹 Channel li ghadi t-monitor
const CREATE_CHANNEL_ID = "1480913492574867519";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => console.log("DS WORLD BOT ONLINE 🚀"));

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (newState.channelId === CREATE_CHANNEL_ID) {
    const displayName = newState.member.displayName;

    // Create new VC with user's display name
    const voiceChannel = await newState.guild.channels.create({
      name: `${displayName} 'VC`,
      type: 2, // Voice
      parent: newState.channel.parent
    });

    await newState.member.voice.setChannel(voiceChannel);

    // Embed for the VC
    const embed = new EmbedBuilder()
      .setTitle("♡ 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷 𝐿𝒪𝒱𝐸𝒮 𝒴𝒪𝒰 ♡")
      .setDescription(`𝒲𝐸𝐿𝐶𝒪𝑀𝐸, ${displayName}!\n𝐸𝓃𝒿𝑜𝓎 𝓎𝑜𝓊𝓇 𝓈𝓉𝒶𝓎.\n[𝒟𝑒𝓋𝑒𝓁𝑜𝓅𝑒𝒹 𝒷𝓎 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷](https://discord.gg/PayB3YesXC)`)
      .setColor(0x5865f2)
      .setImage("https://cdn.discordapp.com/attachments/1410364493824917534/1481291852492570664/Copilot_20260311_132153.png");

    // Buttons row1
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("lock").setLabel("Lock").setStyle(ButtonStyle.Danger).setEmoji("1481306495932043346"),
      new ButtonBuilder().setCustomId("unlock").setLabel("Unlock").setStyle(ButtonStyle.Success).setEmoji("1481306624013504643"),
      new ButtonBuilder().setCustomId("hide").setLabel("Hide").setStyle(ButtonStyle.Secondary).setEmoji("1481306721728204933"),
      new ButtonBuilder().setCustomId("show").setLabel("Show").setStyle(ButtonStyle.Primary).setEmoji("1481306865622188184"),
      new ButtonBuilder().setCustomId("rename").setLabel("Rename").setStyle(ButtonStyle.Secondary).setEmoji("1481306958257455104")
    );

    // Buttons row2 (زدت زر Info هنا)
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("kick").setLabel("Kick User").setStyle(ButtonStyle.Danger).setEmoji("1481307134145597528"),
      new ButtonBuilder().setCustomId("limit").setLabel("Set User Limit").setStyle(ButtonStyle.Primary).setEmoji("1481307222771236996"),
      new ButtonBuilder().setCustomId("delete").setLabel("Delete Channel").setStyle(ButtonStyle.Danger).setEmoji("1481307321400299570"),
      new ButtonBuilder().setCustomId("info").setLabel("Info").setStyle(ButtonStyle.Primary).setEmoji("1482387316088770681"),
    );
     
// Buttons row3 (زر Co-Owners بوحدو)
const row3 = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("coowners")
    .setLabel("Co-Owners")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("1482406793639362748") // أيقونة Co-Owners
);

   await voiceChannel.send({ embeds: [embed], components: [row1, row2, row3] });
  }


  // ✅ Delete **only bot-created VC** if empty
  if (oldState.channel && oldState.channel.id !== CREATE_CHANNEL_ID) {
    if (oldState.channel.members.size === 0 && oldState.channel.name.endsWith("VC")) {
      try { 
        await oldState.channel.delete(); 
        console.log(`Deleted empty bot VC: ${oldState.channel.name}`); 
      } catch(err) { 
        console.error(err); 
      }
    }
  }
});

// Interaction handling (Buttons, Modals, Kick, Limit, Info)
client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "lock":
          await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
          return interaction.reply({ content: "𝒞𝒽𝒶𝓃𝓃𝑒𝓁 𝐿𝑜𝒸𝓀𝑒𝒹!🔒", ephemeral: true });
        case "unlock":
          await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
          return interaction.reply({ content: "𝒞𝒽𝒶𝓃𝓃𝑒𝓁 𝒰𝓃𝓁𝑜𝒸𝓀𝑒𝒹!🔓", ephemeral: true });
        case "hide":
          await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
          return interaction.reply({ content: "𝒞𝒽𝒶𝓃𝓃𝑒𝓁 𝐻𝒾𝒹𝒹𝑒𝓃!🙈", ephemeral: true });
        case "show":
          await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
          return interaction.reply({ content: "𝒞𝒽𝒶𝓃𝓃𝑒𝓁 𝒮𝒽𝑜𝓌𝓃!👁", ephemeral: true });
        case "rename":
          const renameModal = new ModalBuilder()
            .setCustomId("renameModal")
            .setTitle("Rename Channel")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("newName")
                  .setLabel("New Channel Name")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
            );
          return interaction.showModal(renameModal);
        case "limit":
          const limitModal = new ModalBuilder()
            .setCustomId("limitModal")
            .setTitle("Set User Limit")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("userLimit")
                  .setLabel("Enter max users")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
            );
          return interaction.showModal(limitModal);
        case "delete":
          await interaction.reply({ content: "𝒞𝒽𝒶𝓃𝓃𝑒𝓁 𝒟𝑒𝓁𝑒𝓉𝑒𝒹!🗑", ephemeral: true });
          return interaction.channel.delete();
        case "kick":
          const options = interaction.channel.members.map(m => ({
            label: m.displayName,
            value: m.id
          })).filter(m => m.value !== interaction.user.id);

          if (options.length === 0) return interaction.reply({ content: "No other users in this channel!", ephemeral: true });

          const menu = new StringSelectMenuBuilder()
            .setCustomId("kickSelect")
            .setPlaceholder("Select user to kick")
            .addOptions(options);

          const row = new ActionRowBuilder().addComponents(menu);
          return interaction.reply({ content: "Select user to kick:", components: [row], ephemeral: true });

               // 🆕 زر Info
        
case "info":
  const vc = interaction.channel;
  const owner = vc.members.first()?.displayName || "Unknown";
  const name = vc.name;
  const limit = vc.userLimit === 0 ? "Unlimited" : vc.userLimit.toString();
  const createdAt = vc.createdAt.toLocaleString();
  const activeFor = Math.floor((Date.now() - vc.createdAt.getTime()) / 1000) + "s";
  const coOwners = "0/5"; 
  const hidden = vc.permissionsFor(interaction.guild.roles.everyone).has("ViewChannel") ? "No" : "Yes";
  const locked = vc.permissionsFor(interaction.guild.roles.everyone).has("Connect") ? "No" : "Yes";

  const infoEmbed = new EmbedBuilder()
    .setColor(0x9b59b6)
    .setThumbnail("https://cdn.discordapp.com/emojis/1482388410717962386.png?size=96&quality=lossless") // أيقونة Info
    .setDescription("♡ 𝒟𝒮 𝒲𝒪𝑅𝐿𝐷 𝒫𝒜𝒩𝐸𝐿 ♡")
    .addFields(
      { name: "𝒪𝓌𝓃𝑒𝓇 <:ownericon:1482411990331953373> :", value: `@${owner}`, inline: false }, // أيقونة Owner
      { name: "𝒩𝒶𝓂𝑒 <:nameicon:1482407109705601198> :", value: name, inline: false }, // أيقونة Name
      { name: "𝐿𝒾𝓂𝒾𝓉 <:limiticon:1482407403369795615> :", value: limit, inline: false }, // أيقونة Limit
      { name: "𝒞𝓇𝑒𝒶𝓉𝑒𝒹 𝒶𝓉 <:createdicon:1482408011518447668> :", value: createdAt, inline: false }, // أيقونة Created At
      { name: "𝒜𝒸𝓉𝒾𝓋𝒶𝓉𝑒 𝒻𝑜𝓇 <:activeicon:1482408245049032724> :", value: activeFor, inline: false }, // أيقونة Active For
      { name: "𝒞𝑜-𝑜𝓌𝓃𝑒𝓇𝓈 <:coowner:1482406793639362748> :", value: coOwners, inline: false }, // أيقونة Co-Owners
      { name: "𝐻𝒾𝒹𝒹𝑒𝓃 <:hiddenicon:1481306721728204933> :", value: hidden, inline: false }, // أيقونة Hidden
      { name: "𝐿𝑜𝒸𝓀𝑒𝒹 <:lockedicon:1481306495932043346> :", value: locked, inline: false } // أيقونة Locked
    )
    .setFooter({ text: "𝒫𝑜𝓌𝑒𝓇𝑒𝒹 𝒷𝓎 𝒟𝓈 𝒲𝑜𝓇𝓁𝒹 ✨" });

  return interaction.reply({ embeds: [infoEmbed], ephemeral: true });


      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      // باقي الحالات ديال renameModal و limitModal...
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "kickSelect") {
      // باقي الكود ديال kick...
    }

  } catch(err) { 
    console.error(err); 
  }
});

// ✅ Login using environment variable
client.login(TOKEN);
