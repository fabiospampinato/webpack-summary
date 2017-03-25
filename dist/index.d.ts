import { options } from './types';
declare class SummaryPlugin {
    options: options;
    watching: boolean;
    startAt: number;
    endAt: number;
    constructor(options?: Partial<options>);
    apply(compiler: any): void;
    onStart(): void;
    onEnd(compilation: any, next: Function): void;
    onWatch(compilation: any, next: Function): void;
    getTimeTokens(milliseconds: number): {
        ms: number;
        s: number;
        m: number;
    };
    getSizeTokens(bytes: number): {
        B: number;
        KB: number;
        MB: number;
    };
    getEntriesTokens(stats: any): {
        name: string;
        asset: any;
        size: {
            B: number;
            KB: number;
            MB: number;
        };
    }[];
    getTokens(stats: any): {
        stats: any;
        size: {
            B: number;
            KB: number;
            MB: number;
        };
        time: {
            ms: number;
            s: number;
            m: number;
        };
        entries: {
            name: string;
            asset: any;
            size: {
                B: number;
                KB: number;
                MB: number;
            };
        }[];
    };
    getTemplate(): string;
    printTemplates(tokens: any): void;
    printTemplate(tokens: any): void;
}
export default SummaryPlugin;
