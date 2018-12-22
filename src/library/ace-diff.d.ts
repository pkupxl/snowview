
declare module 'ace-diff' {

    export interface AceDiffLROpts {
        content?: string | null;
        mode?: string;
        theme?: string;
        editable?: boolean;
        copyLinkEnabled?: boolean;
    }

    export interface AceDiffConstructorOpts extends AceDiffOpts {
        element: string | HTMLElement;
        left: AceDiffLROpts;
        right: AceDiffLROpts;
    }

    export interface AceDiffOpts {
        mode?: string;
        theme?: string;
        diffGranularity?: 'specific' | 'broad';
        showDiffs?: boolean;
        showConnectors?: boolean;
        maxDiffs?: number;
        left?: AceDiffLROpts;
        right?: AceDiffLROpts;
        classes?: {
            diff: string;
            connector: string;
            newCodeConnectorLinkContent: string;
            deletedCodeConnectorLinkContent: string;
        };
    }

    export default class AceDiff {
        constructor(opts: AceDiff.AceDiffConstructorOpts);
        getEditors(): {
            left: any;
            right: any;
        };
        setOptions(options: AceDiff.AceDiffOpts): void;
        getNumDiffs(): number;
        diff(): void;
        destroy(): void;
    }
}