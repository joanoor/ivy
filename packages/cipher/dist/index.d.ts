interface EncryptionParams {
    key: string;
    iv: string;
}
declare class AesEncryption {
    private key;
    private iv;
    constructor(opt?: Partial<EncryptionParams>);
    encryptByAES(cipherText: string): string;
    decryptByAES(cipherText: string): string;
}
declare function encryptByBase64(cipherText: string): string;
declare function decodeByBase64(cipherText: string): string;
declare function encryptByMd5(password: string): string;
declare const cmdRSAEncrypt: (publicKey: string, value: string) => string | false;

export { AesEncryption, EncryptionParams, cmdRSAEncrypt, decodeByBase64, encryptByBase64, encryptByMd5 };
