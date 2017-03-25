declare class SummaryPlugin {
    template: string;
    startAt: number;
    endAt: number;
    constructor(template?: string);
    apply(compiler: any): void;
    onStart(): void;
    onEnd(compilation: any, next: any): void;
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
    printTemplates(tokens: any): void;
    printTemplate(tokens: any): void;
}
export default SummaryPlugin;
