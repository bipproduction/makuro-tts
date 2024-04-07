const { config, createAudioFromText, getConfig } = require('tiktok-tts')
const yargs = require('yargs')
const root_path = process.cwd()

yargs
    .command(
        "start",
        "start",
        yargs => yargs
            .options({
                session: {
                    alias: "s",
                    type: "string",
                    demandOption: true
                },
                text: {
                    alias: "t",
                    type: "string",
                    demandOption: true
                }
            }),
        start
    )
    .demandCommand(1)
    .recommendCommands()
    .parse(process.argv.splice(2))

async function start(argv) {
    const config = {
        session: argv.session,
        text: argv.text
    }

    config(config.session);

    const audio = await createAudioFromText(config.text, "audio", "id_001");
    console.log(audio)
}