declare module 'tiktok-tts' {
    function config(tiktokSessionId: any, customBaseUrl?: any): void;
    function createAudioFromText(text: any, path: any, speaker: any): Promise<any>;
    function getConfig(): () => {
        BASE_URL: string;
        tiktokSessionId: any;
    };
}
