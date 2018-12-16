const {getTaskAndNotes, createEmailData} = require('deaddrop');

describe('getTaskAndNotes', () => {
    test('returns task string and notes string', () => {
        const taskAndNotes = 'Train for World Cup ,, This might take awhile...';
        const [task, notes] = getTaskAndNotes(taskAndNotes, ',,');
        expect(task).toBe('Train for World Cup');
        expect(notes).toBe('This might take awhile...');
    });

    test('when no space between task and notes, returns task string and notes string', () => {
        const taskAndNotes = 'Train for World Cup,,This might take awhile...';
        const [task, notes] = getTaskAndNotes(taskAndNotes, ',,');
        expect(task).toBe('Train for World Cup');
        expect(notes).toBe('This might take awhile...');
    });

    test('still works if there are no notes', () => {
        const taskAndNotes = 'Same thing we do every night Pinky: try to take over the world!';
        const [task, notes] = getTaskAndNotes(taskAndNotes, ',,');
        expect(task).toBe('Same thing we do every night Pinky: try to take over the world!');
        expect(notes).not.toBeDefined();
    });
});

describe('createEmailData', () => {
    self = this;
    beforeEach(() => {
        self.config = {
            notesDelimiter: ',,'
        };
    });

    test('uses notes as email text', () => {
        const taskAndNotes = 'Replace rug ,, it really tied the room together';
        const {text} = createEmailData(taskAndNotes, self.config);
        expect(text).toBe('it really tied the room together');
    });

    test('sets text to default of no notes specified', () => {
        const taskWithoutNotes = 'Make White Russian';
        const {text} = createEmailData(taskWithoutNotes, self.config);
        expect(text).toBe('sent from deaddrop');
    });

    test('sets task to email subject', () => {
        const taskWithoutNotes = 'Make White Russian';
        const {subject} = createEmailData(taskWithoutNotes, self.config);
        expect(subject).toBe(taskWithoutNotes);
    });

    test('uses config data for email from', () => {
        const {from} = createEmailData('', {senderName: 'me', 'domain': 'mail.com'});
        expect(from).toBe('me <me@mail.com>');
    });

    test('uses config data for email to', () => {
        const {to} = createEmailData('', {OFMaildropEmail: 'of@mail.drop'});
        expect(to).toBe('of@mail.drop');
    });
});
