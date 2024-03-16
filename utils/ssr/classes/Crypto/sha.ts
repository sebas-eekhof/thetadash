import crypto from 'crypto';

export default class SHA {
    static hashFile(input: string | Buffer): string {
        return crypto.createHash('sha1').update(input).digest('base64url');
    }
}