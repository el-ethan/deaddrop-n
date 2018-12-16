#!/usr/bin/env node

let mailgun = require('mailgun-js');
const config = require('./config.json');
const commander = require('commander');
const colors = require('colors');
const deaddrop = {};

deaddrop.getTaskAndNotes = getTaskAndNotes;
deaddrop.createEmailData = createEmailData;

mailgun = mailgun({apiKey: config.apiKey, domain: config.domain});

function getTaskAndNotes(taskAndNotes, delimiter) {
    let [task, notes] = taskAndNotes.split(delimiter);
    if (task) task = task.trim();
    if (notes) notes = notes.trim();
    return [task, notes];
}

function createEmailData(taskAndNotes, deaddropConfig) {
    const [task, notes] = getTaskAndNotes(taskAndNotes, deaddropConfig.notesDelimiter);
    const fullEmail = `${deaddropConfig.senderName}@${deaddropConfig.domain}`;
    const emailData = {
        from: `${deaddropConfig.senderName} <${fullEmail}>`,
        to: `${deaddropConfig.OFMaildropEmail}`,
        subject: task,
        text: notes || 'sent from deaddrop'
    };
    return emailData;
}

function sendTaskToMaildrop(taskAndNotes) {

    taskAndNotes = taskAndNotes.join(' ');
    const emailData = createEmailData(taskAndNotes, config);
    mailgun.messages().send(emailData, function (error, body) {
        process.stdout.write('Task sent to OmniFocus maildrop.\n'.green);
    });

}

module.exports = deaddrop;

commander
    .arguments('<taskAndNotes...>')
    .action((taskAndNotes) => sendTaskToMaildrop(taskAndNotes))
    .parse(process.argv);
