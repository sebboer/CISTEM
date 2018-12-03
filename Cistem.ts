const stripge = /^ge(.{4,})/g;
const replxx = /(.)\1/g;
const replxxback = /(.)\*/g;
const stripemr = /e[mr]$/g;
const stripnd = /nd$/g;
const stript = /t$/g;
const stripesn = /[esn]$/g;

export function stem(word: string, caseSensitive: boolean) {
    if (word.length === 0) {
        return word;
    }
    const upper = word.slice(0, 1) === word.slice(0, 1).toUpperCase();
    word = word.toLowerCase();

    word = word.replace(/ü/g, 'u');
    word = word.replace(/ö/g, 'o');
    word = word.replace(/ä/g, 'a');
    word = word.replace(/ß/g, 'ss');

    word = word.replace(stripge, '$1');
    word = word.replace(/sch/g, '$');
    word = word.replace(/ei/g, '%');
    word = word.replace(/ie/g, '&');
    word = word.replace(replxx, '$1*');

    while (word.length > 3) {
        if (word.length > 5) {
            let newWord = word.replace(stripemr, '');
            if (word !== newWord) {
                word = newWord;
                continue;
            }

            newWord = word.replace(stripnd, '');
            if (word !== newWord) {
                word = newWord;
                continue;
            }
        }

        if (!upper || caseSensitive) {
            let newWord = word.replace(stript, '');
            if (word !== newWord) {
                word = newWord;
                continue;
            }
        }
        let newWord = word.replace(stripesn, '');
        if (word !== newWord) {
            word = newWord;
        } else {
            break;
        }
    }

    word = word.replace(replxxback, '$1$1');
    word = word.replace(/&/g, 'ie');
    word = word.replace(/%/g, 'ei');
    word = word.replace(/\$/g, 'sch');

    return word;
}

export function segment(word: string, caseSensitive: boolean) {
    let restLength = 0;

    if (word.length === 0) {
        return {word: '', rest: ''};
    }

    const upper = word.slice(0, 1) === word.slice(0, 1).toUpperCase();
    word = word.toLowerCase();

    const original = word;

    word = word.replace(/sch/g, '$');
    word = word.replace(/ei/g, '%');
    word = word.replace(/ie/g, '&');
    word = word.replace(replxx, '$1*');

    while (word.length > 3) {
        if (word.length > 5) {
            let newWord = word.replace(stripemr, '');
            if (word !== newWord) {
                restLength += 2;
                word = newWord;
                continue;
            }

            newWord = word.replace(stripnd, '');
            if (word !== newWord) {
                restLength += 2;
                word = newWord;
                continue;
            }
        }

        if (!upper || caseSensitive) {
            let newWord = word.replace(stript, '');
            if (word !== newWord) {
                restLength += 1;
                word = newWord;
                continue;
            }
        }
        let newWord = word.replace(stripesn, '');
        if (word !== newWord) {
            restLength += 1;
            word = newWord;
        } else {
            break;
        }
    }

    word = word.replace(replxxback, '$1$1');
    word = word.replace(/&/g, 'ie');
    word = word.replace(/%/g, 'ei');
    word = word.replace(/\$/g, 'sch');

    let rest = '';
    if (restLength !== 0) {
        rest = original.substr(original.length - restLength);
    } else {
        rest = '';
    }

    return {word: word, rest: rest}
}