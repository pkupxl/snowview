import { show } from 'js-snackbar';

export function showError(message: string) {
    show({
        text: message,
        pos: 'bottom-center',
        duration: 1000
    });
}

export function withError<V>(message: string, value: V): V {
    showError(message);
    return value;
}

export function rename(str: string) {
    if (str.substring(0, 3) === 'in_') { return str.substring(3) + '(incoming)'; }
    if (str.substring(0, 3) === 'ou_') { return str.substring(3) + '(outgoing)'; }
    return '';
}
